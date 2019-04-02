import { Observable, Subject } from 'rxjs'

import { env } from './misc/env'
import { isBrowser, IStream, isWebSocketSupported, log } from './misc/util'
import { IMessage, Message, signaling as proto } from './proto/index'
import { WebChannel } from './WebChannel'

export type InSigMsg = Message
export type OutSigMsg = IMessage

const MAXIMUM_MISSED_HEARTBEAT = 3
const HEARTBEAT_INTERVAL = 5000

/* Preconstructed messages */
const heartbeatMsg = proto.Message.encode(proto.Message.create({ heartbeat: true })).finish()

export enum SignalingState {
  CONNECTING = 0,
  OPEN = 1,
  CHECKING = 2,
  CHECKED = 4,
  CLOSED = 3,
}

/**
 * This class represents a door of the `WebChannel` for the current peer. If the door
 * is open, then clients can join the `WebChannel` through this peer. There are as
 * many doors as peers in the `WebChannel` and each of them can be closed or opened.
 */
export class Signaling implements IStream<OutSigMsg, InSigMsg> {
  public readonly STREAM_ID = 1
  public url: string
  public state: SignalingState
  public connected: boolean

  private wc: WebChannel
  private stateSubject: Subject<SignalingState>
  private ws: WebSocket | undefined
  private connectionTimeout: any
  private streamSubject: Subject<InSigMsg>

  // Heartbeat
  private heartbeatInterval: any
  private missedHeartbeat: number

  constructor(wc: WebChannel, url: string) {
    this.wc = wc
    this.url = url
    this.state = SignalingState.CLOSED
    this.connected = false
    this.missedHeartbeat = 0

    this.streamSubject = new Subject()
    this.stateSubject = new Subject<SignalingState>()
  }

  get messageFromStream(): Observable<InSigMsg> {
    return this.streamSubject.asObservable()
  }

  sendOverStream(msg: OutSigMsg) {
    log.signaling(this.wc.myId + ' Forward message', msg)
    this.send({
      content: {
        recipientId: msg.recipientId,
        senderId: msg.senderId,
        lastData: msg.content === undefined,
        data: Message.encode(Message.create(msg)).finish(),
      },
    })
  }

  get onState(): Observable<SignalingState> {
    return this.stateSubject.asObservable()
  }

  check(): void {
    if (this.state === SignalingState.CHECKED || this.state === SignalingState.OPEN) {
      // console.log('Signaling check: ', new Error().stack)
      this.setState(SignalingState.CHECKING)
      this.send({
        connect: { id: this.wc.myId, members: this.wc.members.filter((id) => id !== this.wc.myId) },
      })
    }
  }

  connect(key: string): void {
    if (isWebSocketSupported()) {
      this.setState(SignalingState.CONNECTING)
      this.ws = new env.WebSocket(this.fullUrl(key))
      this.ws.binaryType = 'arraybuffer'
      this.connectionTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState !== this.ws.OPEN) {
          log.signaling(`Failed to connect to Signaling server ${this.url}: connection timeout`)
          this.close()
        }
      }, 10000)
      this.ws.onopen = () => {
        this.setState(SignalingState.OPEN)
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout)
        }
        this.startHeartbeat()
      }
      this.ws.onerror = (err) => log.signaling(`WebSocket ERROR`, err)
      this.ws.onclose = (closeEvt) => {
        this.clean()
        this.setState(SignalingState.CLOSED)
      }
      this.ws.onmessage = ({ data }: { data: ArrayBuffer }) => this.handleMessage(data)
    } else {
      throw new Error(
        'Failed to join over Signaling: WebSocket is not supported by your environment'
      )
    }
  }

  /**
   * Close the `WebSocket` with Signaling server.
   */
  close(): void {
    if (this.state !== SignalingState.CLOSED) {
      if (this.ws) {
        this.ws.onmessage = () => {}
        this.ws.onclose = () => {}
        this.ws.onerror = () => {}
        this.ws.close(1000)
      }
      this.clean()
      this.setState(SignalingState.CLOSED)
    }
  }

  private clean() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout)
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }
    this.ws = undefined
  }

  private handleMessage(bytes: ArrayBuffer) {
    try {
      const msg = proto.Message.decode(new Uint8Array(bytes))
      switch (msg.type) {
        case 'heartbeat':
          this.missedHeartbeat = 0
          break
        case 'connected':
          this.connected = msg.connected
          this.setState(SignalingState.CHECKED)
          if (!msg.connected) {
            this.wc.channelBuilder.connectOverSignaling().catch(() => this.check())
          }
          break
        case 'content': {
          const { data, senderId, recipientId } = msg.content as proto.Content
          const streamMessage = Message.decode(data)
          streamMessage.senderId = senderId
          streamMessage.recipientId = recipientId
          log.signaling('StreamMessage RECEIVED: ', streamMessage)
          this.streamSubject.next(streamMessage)
          break
        }
      }
    } catch (err) {
      log.warn('Decode Signaling message error: ', err)
    }
  }

  private setState(state: SignalingState) {
    if (this.state !== state) {
      this.state = state
      this.stateSubject.next(state)
    }
  }

  private startHeartbeat() {
    this.missedHeartbeat = 0
    this.heartbeatInterval = setInterval(() => {
      try {
        this.missedHeartbeat++
        if (this.missedHeartbeat >= MAXIMUM_MISSED_HEARTBEAT) {
          throw new Error('Too many missed heartbeats')
        }
        this.heartbeat()
      } catch (err) {
        this.close()
      }
    }, HEARTBEAT_INTERVAL)
  }

  private send(msg: proto.IMessage) {
    if (this.ws && this.ws.readyState === env.WebSocket.OPEN) {
      try {
        this.ws.send(proto.Message.encode(proto.Message.create(msg)).finish())
      } catch (err) {
        log.signaling('Failed send to Signaling', err)
      }
    }
  }

  private heartbeat() {
    if (this.ws && this.ws.readyState === env.WebSocket.OPEN) {
      try {
        this.ws.send(heartbeatMsg)
      } catch (err) {
        log.signaling('Failed send to Signaling: ' + err.message)
      }
    }
  }

  private fullUrl(key: string): string {
    const urlWithKey = this.url.endsWith('/') ? this.url + key : this.url + '/' + key
    if (isBrowser) {
      return urlWithKey
    } else {
      return urlWithKey + '?favored'
    }
  }
}
