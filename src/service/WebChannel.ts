import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs/Subscription'

import { Channel } from '../Channel'
import {
  generateKey,
  isBrowser,
  isOnline,
  isURL,
  isVisible,
  log,
  MAX_KEY_LENGTH,
  randNumbers } from '../misc/Util'
import { IMessage, Message, service, webChannel } from '../proto'
import { Signaling, SignalingState } from '../Signaling'
import { UserDataType, UserMessage } from '../UserMessage'
import { WebSocketBuilder } from '../WebSocketBuilder'
import { ChannelBuilder } from './ChannelBuilder'
import { IServiceMessageDecoded, IServiceMessageEncoded, Service } from './Service'
import { FullMesh } from './topology/FullMesh'
import { ITopology, TopologyEnum, TopologyStateEnum } from './topology/Topology'
import { WebRTCBuilder } from './WebRTCBuilder'

/**
 * Service id.
 */
const ID = 200

export interface IWebChannelOptions {
  topology?: TopologyEnum,
  signalingServer?: string,
  rtcConfiguration?: RTCConfiguration,
  autoRejoin?: boolean,
}

export const defaultOptions: IWebChannelOptions = {
  topology: TopologyEnum.FULL_MESH,
  signalingServer: 'wss://signaling.netflux.coedit.re',
  rtcConfiguration: {
    iceServers: [
      {urls: 'stun:stun3.l.google.com:19302'},
    ],
  },
  autoRejoin: true,
}

export enum WebChannelState { JOINING, JOINED, LEAVING, LEFT }

/**
 * This class is an API starting point. It represents a group of collaborators
 * also called peers. Each peer can send/receive broadcast as well as personal
 * messages. Every peer in the `WebChannel` can invite another person to join
 * the `WebChannel` and he also possess enough information to be able to add it
 * preserving the current `WebChannel` structure (network topology).
 * [[include:installation.md]]
 */
export class WebChannel extends Service {

  /**
   * An array of all peer ids except yours.
   */
  readonly members: number[]

  /**
   * Topology id.
   */
  topology: TopologyEnum

  /**
   * WebChannel id.
   */
  id: number

  /**
   * Your id as a peer in the network.
   */
  myId: number

  /**
   * Unique string mandatory to join a network.
   */
  key: string

  /**
   * If true, when the connection with Signaling is closed, will continuously
   * trying to reconnect to Signaling until succeed in order to join the network.
   */
  autoRejoin: boolean

  /**
   * Thi handler is called each time the state of Signaling server changes.
   */
  onSignalingStateChange: (state: SignalingState) => void

  /**
   * Thi handler is called each time the state of the network changes.
   */
  onStateChange: (state: WebChannelState) => void

  /**
   * This handler is called when a new peer has joined the network.
   */
  onMemberJoin: (id: number) => void

  /**
   * This handler is called when a peer hes left the network.
   */
  onMemberLeave: (id: number) => void

  /**
   *  This handler is called when a message has been received from the network.
   */
  onMessage: (id: number, msg: UserDataType) => void

  serviceMessageSubject: Subject<IServiceMessageEncoded>
  webRTCBuilder: WebRTCBuilder
  webSocketBuilder: WebSocketBuilder
  channelBuilder: ChannelBuilder
  topologyService: ITopology
  state: WebChannelState
  signaling: Signaling

  private userMsg: UserMessage
  private isRejoinDisabled: boolean
  private topologySub: Subscription
  private rejoinTimer: any

  constructor ({
    topology = defaultOptions.topology,
    signalingServer = defaultOptions.signalingServer,
    rtcConfiguration = defaultOptions.rtcConfiguration,
    autoRejoin = defaultOptions.autoRejoin,
  }: IWebChannelOptions = {}) {
    super(ID, webChannel.Message)

    // PUBLIC MEMBERS
    this.topology = topology
    this.id = this.generateId()
    this.myId = this.generateId()
    this.members = [this.myId]
    this.key = ''
    this.autoRejoin = autoRejoin

    // PUBLIC EVENT HANDLERS
    this.onMemberJoin = function none () {}
    this.onMemberLeave = function none () {}
    this.onMessage = function none () {}
    this.onStateChange = function none () {}
    this.onSignalingStateChange = function none () {}

    // PRIVATE
    this.state = WebChannelState.LEFT
    this.userMsg = new UserMessage()

    // Signaling init
    this.signaling = new Signaling(this, signalingServer)
    this.signaling.onChannel.subscribe((ch) => this.initChannel(ch))
    this.signaling.onState.subscribe(
      (state: SignalingState) => {
        log.signalingState(SignalingState[state], this.myId)
        this.onSignalingStateChange(state)
        switch (state) {
        case SignalingState.CONNECTING:
          this.setState(WebChannelState.JOINING)
          break
        case SignalingState.CLOSED:
          if (this.topologyService.state === TopologyStateEnum.DISCONNECTED) {
            this.setState(WebChannelState.LEFT)
          }
          this.rejoin(3000)
          break
        case SignalingState.STABLE:
          this.topologyService.setStable()
          break
        }
      },
    )

    // Services init
    this.serviceMessageSubject = new Subject()
    super.setupServiceMessage(this.serviceMessageSubject)
    this.webRTCBuilder = new WebRTCBuilder(this, rtcConfiguration)
    this.webSocketBuilder = new WebSocketBuilder(this)
    this.channelBuilder = new ChannelBuilder(this)
    this.onServiceMessage.subscribe(
      (msg) => this.treatServiceMessage(msg),
      (err) => console.error('service/WebChannel inner message error', err),
    )

    // Topology init
    this.setTopology(topology)
    // FIXME: manage topologyService onState subscription

    // Listen to browser events only
    if (isBrowser) {
      // global.window.addEventListener('offline', () => {
      //   setTimeout(() => {
      //     if (!isOnline()) {
      //       this.internalLeave()
      //     }
      //   }, 2000)
      // })
      global.window.addEventListener('online', () => {
        if (isVisible() && this.state === WebChannelState.LEFT) {
          this.rejoin()
        }
      })

      global.window.addEventListener('visibilitychange', () => {
        if (isVisible() && this.state === WebChannelState.LEFT) {
          this.rejoin()
        }
      })

      global.window.addEventListener('beforeunload', () => this.internalLeave())
    }
  }

  /**
   * Join the network via a key provided by one of the network member or a `Channel`.
   */
  join (key: string = generateKey()): void {
    if (typeof key !== 'string') {
      throw new Error(`Failed to join: the key type "${typeof key}" is not a "string"`)
    } else if (key === '') {
      throw new Error('Failed to join: the key is an empty string')
    } else if (key.length > MAX_KEY_LENGTH) {
      throw new Error(
        `Failed to join : the key length of ${key.length} exceeds the maximum of ${MAX_KEY_LENGTH} characters`,
      )
    }
    this.key = key
    if (isOnline() && this.state === WebChannelState.LEFT && this.signaling.state === SignalingState.CLOSED) {
      this.setState(WebChannelState.JOINING)
      this.isRejoinDisabled = !this.autoRejoin
      this.signaling.join(this.key)
    }
  }

  /**
   * Invite a server peer to join the network.
   */
  invite (url: string): void {
    if (isURL(url)) {
      this.webSocketBuilder.connect(`${url}/invite?wcId=${this.id}&senderId=${this.myId}`)
        .then((connection) => this.initChannel(new Channel(this, connection as WebSocket)))
        .catch((err) => console.error(`Failed to invite the bot ${url}: ${err.message}`))
    } else {
      throw new Error(`Failed to invite a bot: ${url} is not a valid URL`)
    }
  }

  /**
   * Leave the network which means close channels with all peers and connection
   * with Signaling server.
   */
  leave () {
    if (this.state !== WebChannelState.LEAVING && this.state !== WebChannelState.LEFT) {
      this.setState(WebChannelState.LEAVING)
      this.key = ''
      this.isRejoinDisabled = true
      this.signaling.close()
      this.topologyService.leave()
    }
  }

  /**
   * Broadcast a message to the network.
   */
  send (data: UserDataType): void {
    if (this.members.length !== 1) {
      const msg: any = {
        senderId: this.myId,
        recipientId: 0,
        isService: false,
      }
      const chunkedData = this.userMsg.encode(data)
      for (const chunk of chunkedData) {
        msg.content = chunk
        this.topologyService.send(msg)
      }
    }
  }

  /**
   * Send a message to a particular peer in the network.
   */
  sendTo (id: number, data: UserDataType): void {
    if (this.members.length !== 1) {
      const msg: any = {
        senderId: this.myId,
        recipientId: id,
        isService: false,
      }
      const chunkedData = this.userMsg.encode(data)
      for (const chunk of chunkedData) {
        msg.content = chunk
        this.topologyService.sendTo(msg)
      }
    }
  }

  onMemberJoinProxy (id: number): void {
    if (!this.members.includes(id)) {
      this.members[this.members.length] = id
      this.onMemberJoin(id)
    }
  }

  onMemberLeaveProxy (id: number): void {
    if (this.members.includes(id)) {
      this.members.splice(this.members.indexOf(id), 1)
      this.onMemberLeave(id)
    }
  }

  /**
   * Send service message to a particular peer in the network.
   */
  sendToProxy ({ senderId = this.myId, recipientId = this.myId, isService = true, content}:
    {senderId?: number, recipientId?: number, isService?: boolean, content?: Uint8Array} = {},
  ): void {
    this.topologyService.sendTo({senderId, recipientId, isService, content})
  }

  /**
   * Broadcast service message to the network.
   */
  sendProxy ({ senderId = this.myId, recipientId = 0, isService = true, content }:
    {senderId?: number, recipientId?: number, isService?: boolean, content?: Uint8Array } = {},
  ): void {
    this.topologyService.send({senderId, recipientId, isService, content})
  }

  encode ({ senderId = this.myId, recipientId = 0, isService = true, content }: IMessage = {}): Uint8Array {
    const msg = {senderId, recipientId, isService, content}
    return Message.encode(Message.create(msg)).finish()
  }

  /**
   * Message handler. All messages arrive here first.
   */
  onMessageProxy (channel: Channel, bytes: Uint8Array): void {
    const msg = Message.decode(new Uint8Array(bytes))
    // recipientId values:
    // 0: broadcast message
    // 1: is a message to me from a peer who does not know yet my ID
    if (msg.recipientId === 0 || msg.recipientId === this.myId || msg.recipientId === 1) {
      this.treatMessage(channel, msg)
    }
    if (msg.recipientId !== this.myId) {
      this.topologyService.forward(msg)
    }
  }

  private treatMessage (channel: Channel, msg: IMessage): void {
    // User Message
    if (!msg.isService) {
      const data = this.userMsg.decode(msg.content as Uint8Array, msg.senderId as number)
      if (data !== undefined) {
        this.onMessage(msg.senderId as number, data)
      }

    // Service Message
    } else {
      const fullMsg: any = service.Message.decode(msg.content as Uint8Array)
      fullMsg.channel = channel
      fullMsg.senderId = msg.senderId
      fullMsg.recipientId = msg.recipientId
      this.serviceMessageSubject.next(fullMsg as IServiceMessageEncoded)
    }
  }

  private treatServiceMessage ({channel, senderId, msg}: IServiceMessageDecoded): void {
    switch (msg.type) {
    case 'init': {
      const { topology, wcId, generatedIds, members } = msg.init
      // Check whether the intermidiary peer is already a member of your
      // network (possible when merging two networks (works with FullMesh)).
      // If it is a case then you are already a member of the network.
      if (this.members.includes(senderId)) {
        if (!generatedIds.includes(this.myId)) {
          this.setState(WebChannelState.LEAVING)
          console.warn(`Failed merge networks: my members contain intermediary peer id,
            but my id is not included into the intermediary peer members`)
          channel.closeQuietly()
          this.topologyService.leave()
          return
        }
        if (this.topology !== topology) {
          this.setState(WebChannelState.LEAVING)
          console.warn('Failed merge networks: different topologies')
          channel.closeQuietly()
          this.topologyService.leave()
          return
        }
        log.webgroup(`I:${this.myId} close connection with intermediary member ${senderId},
          because already connected with him`)
        this.setState(WebChannelState.JOINED)
        channel.closeQuietly()
      } else {
        this.setTopology(topology)
        this.id = wcId
        channel.id = senderId
        channel.send(this.encode({ recipientId: channel.id, content: super.encode({ initOk: true }) }))
        this.topologyService.initJoining(channel, members)
      }
      break
    }
    case 'initOk': {
      channel.id = senderId
      this.topologyService.addJoining(channel)
      break
    }
    default:
      throw new Error(`Unknown message type: "${msg.type}"`)
    }
  }

  private setState (state: WebChannelState): void {
    if (this.state !== state) {
      log.webGroupState(WebChannelState[state], this.myId)
      this.state = state
      this.onStateChange(state)
    }
  }

  /**
   * Delegate adding a new peer in the network to topology.
   */
  private initChannel (ch: Channel): void {
    const msg = this.encode({
      recipientId: 1,
      content: super.encode({ init: {
        topology: this.topology,
        wcId: this.id,
        generatedIds: this.members,
        members: this.members,
      }}),
    })
    ch.send(msg)
  }

  private setTopology (topology: TopologyEnum): void {
    if (this.topologyService !== undefined) {
      if (this.topology !== topology) {
        this.topology = topology
        this.topologyService.leave()
        this.topologyService = new FullMesh(this)
        this.subscribeToTopology()
      }
    } else {
      this.topology = topology
      this.topologyService = new FullMesh(this)
      this.subscribeToTopology()
    }
  }

  private subscribeToTopology () {
    if (this.topologySub) {
      this.topologySub.unsubscribe()
    }
    this.topologySub = this.topologyService.onState.subscribe((state: TopologyStateEnum) => {
      switch (state) {
      case TopologyStateEnum.JOINING:
        this.setState(WebChannelState.JOINING)
        break
      case TopologyStateEnum.JOINED:
        this.setState(WebChannelState.JOINED)
        break
      case TopologyStateEnum.STABLE:
        this.setState(WebChannelState.JOINED)
        this.signaling.open()
        break
      case TopologyStateEnum.DISCONNECTED:
        if (this.signaling.state === SignalingState.CLOSED) {
          this.setState(WebChannelState.LEFT)
        }
        this.rejoin(2000)
        break
      }
    })
  }

  private rejoin (timeout: number = 0) {
    if (!this.isRejoinDisabled) {
      this.isRejoinDisabled = !this.autoRejoin
      global.clearTimeout(this.rejoinTimer)
      this.rejoinTimer = setTimeout(() => {
        if (isOnline() && isVisible()) {
          log.webgroup('REJOIN...')
          this.signaling.join(this.key)
        }
      }, timeout)
    }
  }

  /**
   * Generate random id for a `WebChannel` or a new peer.
   */
  private generateId (excludeIds: number[] = []): number {
    const id = randNumbers()[0]
    if (excludeIds.includes(id)) {
      return this.generateId()
    }
    return id
  }

  private internalLeave () {
    if (this.state !== WebChannelState.LEAVING && this.state !== WebChannelState.LEFT) {
      this.signaling.close()
      this.topologyService.leave()
      this.setState(WebChannelState.LEFT)
    }
  }
}
