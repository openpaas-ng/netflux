import { Channel, MAXIMUM_MISSED_HEARTBEAT } from '../../Channel';
import { isBrowser, log } from '../../misc/util';
import { fullMesh as proto } from '../../proto/index';
import { ConnectionError } from '../channelBuilder/ConnectionError';
import { Topology, TopologyState } from './Topology';
const REQUEST_MEMBERS_INTERVAL = 20000;
const MAX_ROUTE_DISTANCE = 3;
const HEARTBEAT_INTERVAL = 3000;
const DELAYED_TIMEOUT = 300000;
/**
 * Fully connected web channel manager. Implements fully connected topology
 * network, when each peer is connected to each other.
 *
 */
export class FullMesh extends Topology {
    constructor(wc) {
        super(wc, FullMesh.SERVICE_ID, proto.Message);
        this.adjacentMembers = new Map();
        this.distantMembers = new Map();
        this.antecedentId = 0;
        this.delayedMembers = new Set();
        this.delayedMembersTimers = new Set();
        this.adjacentBots = new Set();
        // Encode message beforehand for optimization
        this.heartbeatMsg = super.encode({ heartbeat: true });
        // Subscribe to WebChannel stream
        this.wcStream.message.subscribe(({ channel, senderId, msg }) => this.handleServiceMessage(channel, senderId, msg));
        // Set onConnectionRequest callback for ChannelBuilder
        this.wc.channelBuilder.onConnectionRequest = (streamId, data) => {
            try {
                const { id, adjacentIds } = proto.ConnectionRequest.decode(data);
                if (streamId === this.wc.STREAM_ID) {
                    log.topology(`CONNECTION REQUEST from ${id}, where adjacent members are: `, adjacentIds);
                    return this.createOrUpdateDistantMember(id, adjacentIds);
                }
                else {
                    return true;
                }
            }
            catch (err) {
                log.warn('Decode Fullmesh onConnectionRequest message error: ', err);
                return false;
            }
        };
        // Subscribe to channels from ChannelBuilder
        this.wc.channelBuilder.onChannel.subscribe((ch) => {
            log.topology(`New adjacent member: ${ch.id}`);
            this.distantMembers.delete(ch.id);
            this.delayedMembers.delete(ch.id);
            const am = this.adjacentMembers.get(ch.id);
            if (am) {
                log.topology('Replacing the same channel');
                am.close();
            }
            this.adjacentMembers.set(ch.id, ch);
            if (ch.url) {
                this.adjacentBots.add(ch);
            }
            this.notifyDistantMembers();
            if (!this.heartbeatInterval) {
                this.startHeartbeatInterval();
            }
            if (ch.type === Channel.WITH_MEMBER) {
                super.setState(TopologyState.CONSTRUCTING);
                const { members } = ch.initData;
                this.connectToMembers(members, ch.id).then(() => {
                    super.setState(TopologyState.CONSTRUCTED);
                    this.startMembersCheckIntervals();
                });
            }
            else {
                this.startMembersCheckIntervals();
            }
            this.wc.onMemberJoinProxy(ch.id);
            this.updateAntecedentId();
        });
        if (isBrowser) {
            ;
            window.fullmesh = () => {
                log.topology('Fullmesh info:', {
                    myId: this.wc.myId,
                    antecedentId: this.antecedentId,
                    signalingState: this.wc.signaling.state,
                    webGroupState: this.wc.state,
                    topologyState: TopologyState[this.state],
                    adjacentBots: Array.from(this.adjacentBots).map((ch) => ch.id),
                    adjacentMembers: Array.from(this.adjacentMembers.keys()).toString(),
                    distantMembers: Array.from(this.distantMembers.keys()).toString(),
                    distantMembersDETAILS: Array.from(this.distantMembers.keys()).map((id) => {
                        const adjacentMembers = this.distantMembers.get(id);
                        return { id, adjacentMembers: adjacentMembers ? adjacentMembers.adjacentIds : [] };
                    }),
                });
            };
        }
    }
    send(msg) {
        this.adjacentMembers.forEach((ch) => ch.encodeAndSend(msg));
        this.distantMembers.forEach((distantMember, id) => {
            this.sendToDistantPeer(distantMember, { ...msg, recipientId: id });
        });
    }
    sendTo(msg) {
        const ch = this.adjacentMembers.get(msg.recipientId);
        if (ch) {
            ch.encodeAndSend(msg);
        }
        else {
            this.sendToDistantPeer(this.distantMembers.get(msg.recipientId), msg);
        }
    }
    forward(msg) {
        this.sendTo(msg);
    }
    leave() {
        if (this.state !== TopologyState.IDLE) {
            log.topology('LEAVE');
            this.clean();
            this.adjacentMembers.forEach((ch) => ch.close());
            this.wc.onAdjacentMembersLeaveProxy(Array.from(this.adjacentMembers.keys()));
            this.adjacentMembers.clear();
            super.setState(TopologyState.IDLE);
        }
    }
    onChannelClose(channel) {
        if (this.adjacentMembers.delete(channel.id)) {
            this.adjacentBots.delete(channel);
            this.delayedMembers.delete(channel.id);
            this.wc.onAdjacentMembersLeaveProxy([channel.id]);
            if (this.adjacentMembers.size === 0) {
                this.clean();
            }
            else {
                this.notifyDistantMembers();
                this.updateAntecedentId();
            }
            log.topology(`Channel closed with ${channel.id}`);
        }
    }
    get neighbors() {
        return Array.from(this.adjacentMembers.values());
    }
    clean() {
        log.topology('CLEAN');
        this.wc.onDistantMembersLeaveProxy(Array.from(this.distantMembers.keys()));
        this.distantMembers.clear();
        this.antecedentId = 0;
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = undefined;
        clearInterval(this.membersCheckInterval);
        this.membersCheckInterval = undefined;
        this.delayedMembers.clear();
        this.delayedMembersTimers.forEach((t) => clearTimeout(t));
        this.delayedMembersTimers.clear();
        this.adjacentBots.clear();
    }
    handleServiceMessage(channel, senderId, msg) {
        switch (msg.type) {
            case 'members': {
                this.connectToMembers(msg.members.ids, senderId);
                break;
            }
            case 'adjacentMembers': {
                log.topology(`adjacent members received from ${senderId}`, msg.adjacentMembers.ids);
                const ids = msg.adjacentMembers.ids;
                this.createOrUpdateDistantMember(senderId, ids);
                break;
            }
            case 'heartbeat': {
                const distantMember = this.distantMembers.get(senderId);
                if (distantMember) {
                    distantMember.missedHeartbeat = 0;
                }
                break;
            }
        }
    }
    connectToMembers(ids, adjacentId) {
        const missingIds = ids.filter((id) => !this.adjacentMembers.has(id) && id !== this.wc.myId);
        if (missingIds.length !== 0) {
            log.topology(`TRY TO CONNECT to members`, missingIds);
            const attempts = [];
            const msg = proto.ConnectionRequest.encode(proto.ConnectionRequest.create({
                id: this.wc.myId,
                adjacentIds: Array.from(this.adjacentMembers.keys()),
            })).finish();
            for (const id of missingIds) {
                if (!this.distantMembers.has(id)) {
                    this.distantMembers.set(id, {
                        adjacentIds: [adjacentId],
                        missedHeartbeat: 0,
                    });
                    log.topology(`NEW distant member = ${id}; BIS`, adjacentId);
                    this.updateAntecedentId();
                }
                if (!this.delayedMembers.has(id)) {
                    attempts[attempts.length] = this.wc.channelBuilder
                        .connectOverWebChannel(id, () => {
                        this.wc.onMemberJoinProxy(id);
                        this.updateAntecedentId();
                    }, msg)
                        .catch((err) => {
                        log.topology(`FAILED to connect to ${id}, because: ${err.message}`);
                        if (err.message === ConnectionError.CONNECTION_TIMEOUT ||
                            err.message === ConnectionError.NEGOTIATION_ERROR ||
                            err.message === ConnectionError.IN_PROGRESS) {
                            this.delayedMembers.add(id);
                            const timer = setTimeout(() => {
                                this.delayedMembers.delete(id);
                                this.delayedMembersTimers.delete(timer);
                            }, DELAYED_TIMEOUT);
                            this.delayedMembersTimers.add(timer);
                        }
                    });
                }
            }
            return Promise.all(attempts);
        }
        return Promise.resolve();
    }
    notifyDistantMembers() {
        if (this.distantMembers.size !== 0) {
            const msg = super.encode({
                adjacentMembers: { ids: Array.from(this.adjacentMembers.keys()) },
            });
            this.distantMembers.forEach((dm, id) => this.wcStream.send(msg, id));
        }
    }
    startMembersCheckIntervals() {
        if (!this.membersCheckInterval) {
            this.membersCheckInterval = setInterval(() => {
                if (this.antecedentId) {
                    this.wcStream.send({ members: { ids: this.wc.members } }, this.antecedentId);
                }
            }, REQUEST_MEMBERS_INTERVAL);
        }
    }
    startHeartbeatInterval() {
        this.heartbeatInterval = setInterval(() => {
            this.adjacentMembers.forEach((ch) => ch.sendHeartbeat());
            this.distantMembers.forEach((peer, id) => {
                peer.missedHeartbeat++;
                if (peer.missedHeartbeat >= MAXIMUM_MISSED_HEARTBEAT + 1) {
                    log.topology(`Distant peer ${id} stopped to responding: too many missed heartbeats`);
                    if (this.distantMembers.delete(id)) {
                        this.delayedMembers.delete(id);
                        this.wc.onDistantMembersLeaveProxy([id]);
                        this.updateAntecedentId();
                    }
                }
                this.wcStream.send(this.heartbeatMsg, id);
            });
        }, HEARTBEAT_INTERVAL);
    }
    sendToDistantPeer(distantMember, msg) {
        // NO LUCK: recepient is not directly connected to me, thus check distant peers
        // First those who are at distance 1, then 2 etc. up to MAX_ROUTE_DISTANCE
        // (Peer X has a distance equals to 1 if I am not directly connected to X and
        // there is a peer Y which is directly connected to X and to me)
        for (let d = 1; d <= MAX_ROUTE_DISTANCE; d++) {
            const ch = this.findRoutedChannel(distantMember, d);
            if (ch) {
                ch.encodeAndSend(msg);
                return;
            }
        }
    }
    findRoutedChannel(distantMember, distance) {
        if (distantMember) {
            // Looking for bots first
            for (const ch of this.adjacentBots) {
                if (distantMember.adjacentIds.includes(ch.id)) {
                    return ch;
                }
            }
            // If not found, then look among all ajacentMembers
            for (const [neighbourId, ch] of this.adjacentMembers) {
                if (distantMember.adjacentIds.includes(neighbourId)) {
                    return ch;
                }
            }
            if (distance !== 0) {
                for (const id of distantMember.adjacentIds) {
                    const ch = this.findRoutedChannel(this.distantMembers.get(id), distance - 1);
                    if (ch) {
                        return ch;
                    }
                }
            }
        }
        return undefined;
    }
    createOrUpdateDistantMember(id, ids) {
        if (!this.adjacentMembers.has(id)) {
            const distantMember = this.distantMembers.get(id);
            if (distantMember) {
                distantMember.adjacentIds = ids;
                log.topology(`UPDATE distant member = ${id}`, distantMember.adjacentIds);
            }
            else {
                this.distantMembers.set(id, {
                    adjacentIds: ids,
                    missedHeartbeat: 0,
                });
                this.wc.onMemberJoinProxy(id);
                log.topology(`NEW distant member = ${id}`, ids);
                this.updateAntecedentId();
            }
            return true;
        }
        log.topology(`ABNORMAL update or create a distant member ${id}, but he is also an adjacent member`);
        return false;
    }
    updateAntecedentId() {
        if (this.adjacentMembers.size > 0) {
            let maxId = -1;
            let desiredId = -1;
            for (const id of this.wc.members) {
                if (id !== this.wc.myId) {
                    if (id < this.wc.myId && id > desiredId) {
                        desiredId = id;
                    }
                    if (maxId < id) {
                        maxId = id;
                    }
                }
            }
            this.antecedentId = desiredId !== -1 ? desiredId : maxId;
        }
        else {
            this.antecedentId = 0;
        }
        log.topology(`UPDATE, antecedentId = ${this.antecedentId}, members = `, JSON.stringify(this.wc.members));
    }
}
FullMesh.SERVICE_ID = 74315;
