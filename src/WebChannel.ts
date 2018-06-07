import { Observable, Subject } from 'rxjs'

import { Channel } from './Channel'
import {
  extractHostnameAndPort,
  generateId,
  generateKey,
  isBrowser,
  isOnline,
  IStream,
  isURL,
  isVisible,
  log,
  validateKey,
} from './misc/util'
import { IMessage, Message } from './proto'
import { ChannelBuilder } from './service/channelBuilder/ChannelBuilder'
import { FullMesh } from './service/topology/FullMesh'
import { ITopology, TopologyEnum, TopologyState } from './service/topology/Topology'
import { UserDataType, UserMessage } from './service/UserMessage'
import { Signaling, SignalingState } from './Signaling'
import { WebChannelState } from './WebChannelState'
import { WebSocketBuilder } from './WebSocketBuilder'

export interface IWebChannelOptions {
  topology?: TopologyEnum
  signalingServer?: string
  rtcConfiguration?: RTCConfiguration
  autoRejoin?: boolean
}

export interface IWebChannelFullOptions {
  topology: TopologyEnum
  signalingServer: string
  rtcConfiguration: RTCConfiguration
  autoRejoin: boolean
}

export const webChannelDefaultOptions: IWebChannelFullOptions = {
  topology: TopologyEnum.FULL_MESH,
  signalingServer: 'wss://signaling.netflux.coedit.re',
  rtcConfiguration: {
    iceServers: [{ urls: 'stun:stun3.l.google.com:19302' }],
  },
  autoRejoin: true,
}

export interface InWcMsg extends Message {
  channel: Channel
}

export type OutWcMessage = IMessage

const REJOIN_TIMEOUT = 3000

/**
 * This class is an API starting point. It represents a group of collaborators
 * also called peers. Each peer can send/receive broadcast as well as personal
 * messages. Every peer in the `WebChannel` can invite another person to join
 * the `WebChannel` and he also possess enough information to be able to add it
 * preserving the current `WebChannel` structure (network topology).
 * [[include:installation.md]]
 */
export class WebChannel implements IStream<OutWcMessage, InWcMsg> {
  public readonly STREAM_ID = 2
  public members: number[]
  public topologyEnum: TopologyEnum
  public myId: number
  public key: string
  public autoRejoin: boolean
  public rtcConfiguration: RTCConfiguration
  public state: WebChannelState

  public onSignalingStateChange: (state: SignalingState) => void
  public onStateChange: (state: WebChannelState) => void
  public onMemberJoin: (id: number) => void
  public onMemberLeave: (id: number) => void
  public onMessage: (id: number, msg: UserDataType) => void

  public webSocketBuilder: WebSocketBuilder
  public channelBuilder: ChannelBuilder
  public topology: ITopology
  public signaling: Signaling
  public userMsg: UserMessage
  public streamSubject: Subject<InWcMsg>

  private _id: number
  private idSubject: Subject<number>
  private _onAlone: () => void
  private rejoinEnabled: boolean
  private rejoinTimer: number | undefined

  constructor(options: IWebChannelOptions) {
    const fullOptions = Object.assign({}, webChannelDefaultOptions, options)
    this.streamSubject = new Subject()
    this.idSubject = new Subject()
    this.topologyEnum = fullOptions.topology
    this.autoRejoin = fullOptions.autoRejoin
    this.rtcConfiguration = fullOptions.rtcConfiguration
    this.members = []
    this._id = 0
    this.key = ''
    this.myId = 0
    this.state = WebChannelState.LEFT
    this.rejoinEnabled = false
    this.rejoinTimer = undefined
    this.topology = {} as ITopology
    this._onAlone = () => {}
    this.onMemberJoin = function none() {}
    this.onMemberLeave = function none() {}
    this.onMessage = function none() {}
    this.onStateChange = function none() {}
    this.onSignalingStateChange = function none() {}

    // Initialize services
    this.userMsg = new UserMessage()
    this.signaling = new Signaling(this, fullOptions.signalingServer)
    this.subscribeToSignalingState()
    this.webSocketBuilder = new WebSocketBuilder(this)
    this.channelBuilder = new ChannelBuilder(this)
    this.setTopology(fullOptions.topology)

    // Listen to browser events
    if (isBrowser) {
      this.subscribeToBrowserEvents()
    }
  }

  get onIdChange(): Observable<number> {
    return this.idSubject.asObservable()
  }

  get id(): number {
    return this._id
  }

  set id(value: number) {
    this._id = value
    this.idSubject.next(value)
  }

  get messageFromStream(): Observable<InWcMsg> {
    return this.streamSubject.asObservable()
  }

  set onAlone(handler: () => void) {
    this._onAlone = handler
  }

  sendOverStream(msg: OutWcMessage) {
    this.topology.sendTo(msg)
  }

  join(key: string = generateKey()): void {
    validateKey(key)
    if (this.state === WebChannelState.LEFT) {
      this.startJoin(key)
    }
  }

  invite(url: string): void {
    if (isURL(url)) {
      const hostnamePort = extractHostnameAndPort(url)
      for (const ch of this.topology.neighbors) {
        if (hostnamePort === extractHostnameAndPort(ch.url)) {
          return
        }
      }
      this.webSocketBuilder
        .connectToInvite(url)
        .catch((err) => log.webgroup(`Failed to invite the bot ${url}: ${err.message}`))
    } else {
      throw new Error(`Failed to invite a bot: ${url} is not a valid URL`)
    }
  }

  leave() {
    if (this.state !== WebChannelState.LEFT) {
      this.rejoinEnabled = false
      this.key = ''
      this.signaling.close()
      this.topology.leave()
      this.clean()
    }
  }

  send(data: UserDataType): void {
    if (this.members.length !== 1) {
      for (const chunk of this.userMsg.encodeUserMessage(data)) {
        this.topology.send({
          senderId: this.myId,
          recipientId: 0,
          serviceId: UserMessage.SERVICE_ID,
          content: chunk,
        })
      }
    }
  }

  sendTo(id: number, data: UserDataType): void {
    if (this.members.length !== 1) {
      for (const chunk of this.userMsg.encodeUserMessage(data)) {
        this.topology.sendTo({
          senderId: this.myId,
          recipientId: id,
          serviceId: UserMessage.SERVICE_ID,
          content: chunk,
        })
      }
    }
  }

  onMemberJoinProxy(id: number): void {
    if (!this.members.includes(id)) {
      this.members[this.members.length] = id
      this.onMemberJoin(id)
    }
  }

  onAdjacentMembersLeaveProxy(ids: number[]): void {
    if (ids.length !== 0) {
      this.onMemberLeaveProxy(ids)
      if (this.members.length === 1) {
        this._onAlone()
        this.topology.setLeftState()
      } else if (
        this.signaling.state === SignalingState.CHECKED &&
        this.topology.state === TopologyState.JOINED
      ) {
        this.signaling.check()
      }
    }
  }

  onDistantMembersLeaveProxy(ids: number[]) {
    this.onMemberLeaveProxy(ids)
  }

  init(key: string, id: number = generateId()) {
    log.webgroup('INIT')
    this.id = id
    this.myId = generateId()
    this.members = [this.myId]
    this.key = key
    this.rejoinEnabled = this.autoRejoin
    if (this.rejoinTimer) {
      clearTimeout(this.rejoinTimer)
      this.rejoinTimer = undefined
    }
    this.setState(WebChannelState.JOINING)
  }

  private clean() {
    log.webgroup('CLEAN')
    if (this.rejoinTimer) {
      clearTimeout(this.rejoinTimer)
      this.rejoinTimer = undefined
    }
    this.channelBuilder.clean()
    this.userMsg.clean()
    this.members = []
    this.id = 0
    this.myId = 0
    this.setState(WebChannelState.LEFT)
  }

  private setState(state: WebChannelState): void {
    if (this.state !== state) {
      log.webGroupState(WebChannelState[state], this.myId)
      this.state = state
      this.onStateChange(state)
    }
  }

  private setTopology(topologyEnum: TopologyEnum): void {
    this.topologyEnum = topologyEnum
    this.topology = new FullMesh(this)
    this.topology.onState.subscribe((state: TopologyState) => {
      switch (state) {
        case TopologyState.JOINING:
          this.setState(WebChannelState.JOINING)
          if (this.signaling.state === SignalingState.CLOSED) {
            // This is for a bot who was invited to the group
            this.signaling.connect(this.key)
          }
          break
        case TopologyState.JOINED:
          this.setState(WebChannelState.JOINED)
          if (
            this.signaling.state === SignalingState.OPEN ||
            this.signaling.state === SignalingState.CHECKED
          ) {
            this.signaling.check()
          }
          break
        case TopologyState.LEFT:
          switch (this.signaling.state) {
            case SignalingState.CLOSED:
              this.rejoin()
              break
            case SignalingState.CONNECTING:
              this.setState(WebChannelState.JOINING)
              break
            case SignalingState.OPEN:
              this.setState(WebChannelState.JOINING)
              this.signaling.check()
              break
            case SignalingState.CHECKING:
              this.setState(WebChannelState.JOINING)
              break
            case SignalingState.CHECKED:
              this.signaling.check()
              break
          }

          break
      }
    })
  }

  private subscribeToSignalingState() {
    this.signaling.onState.subscribe((state: SignalingState) => {
      log.signalingState(SignalingState[state], this.myId)
      this.onSignalingStateChange(state)
      switch (state) {
        case SignalingState.CLOSED:
          if (this.topology.state === TopologyState.LEFT) {
            this.rejoin()
          } else {
            this.reconnectToSignaling()
          }
          break
        case SignalingState.OPEN:
          if (this.topology.state !== TopologyState.JOINING) {
            this.signaling.check()
          }
          break
        case SignalingState.CHECKED:
          if (
            this.state === WebChannelState.JOINING &&
            this.topology.state === TopologyState.LEFT &&
            this.signaling.connected
          ) {
            this.topology.setJoinedState()
          }
          break
      }
    })
  }

  private subscribeToBrowserEvents() {
    window.addEventListener('online', () => {
      if (
        this.state === WebChannelState.LEFT &&
        isVisible() &&
        !this.rejoinTimer &&
        this.rejoinEnabled
      ) {
        this.startJoin()
      }
    })
    window.addEventListener('visibilitychange', () => {
      if (
        isVisible() &&
        this.state === WebChannelState.LEFT &&
        isOnline() &&
        !this.rejoinTimer &&
        this.rejoinEnabled
      ) {
        this.startJoin()
      }
    })
    window.addEventListener('beforeunload', () => this.leave())
  }

  private startJoin(key = this.key) {
    this.init(key)
    this.signaling.connect(key)
  }

  private rejoin() {
    log.webgroup('rejoinOrLeave')
    if (this.rejoinEnabled) {
      this.clean()
      // this.init(this.key)
      log.webgroup('rejoinOrLeave: set rejoinTimer ')
      this.rejoinTimer = setTimeout(() => {
        if (
          this.state === WebChannelState.LEFT &&
          isVisible() &&
          isOnline() &&
          this.rejoinEnabled
        ) {
          log.webgroup('rejoinOrLeave: startJoin ')
          this.startJoin()
        } else {
          log.webgroup('rejoinOrLeave: NOT startJoin ')
        }
        this.rejoinTimer = undefined
      }, REJOIN_TIMEOUT)
    }
  }

  private reconnectToSignaling() {
    log.webgroup('reconnect: ')
    if (this.rejoinEnabled && !this.rejoinTimer) {
      this.rejoinTimer = setTimeout(() => {
        if (isVisible() && isOnline() && this.rejoinEnabled) {
          this.signaling.connect(this.key)
        }
        this.rejoinTimer = undefined
      }, REJOIN_TIMEOUT)
    }
  }

  private onMemberLeaveProxy(ids: number[]) {
    ids.forEach((id) => {
      if (this.members.includes(id)) {
        this.members.splice(this.members.indexOf(id), 1)
        this.onMemberLeave(id)
      }
    })
  }
}
