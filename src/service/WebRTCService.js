import '../../webrtc-adapter'
import Util from 'Util'
import Service from 'service/Service'
import ServiceFactory, {CHANNEL_BUILDER} from 'ServiceFactory'
const wrtc = Util.require(Util.WEB_RTC)
const CloseEvent = Util.require(Util.CLOSE_EVENT)

const CONNECT_OVER_WEBCHANNEL_TIMEOUT = 10000
const CONNECT_OVER_SIGNALING_TIMEOUT = 4000
const REMOVE_ITEM_TIMEOUT = 5000

/**
 * Service class responsible to establish connections between peers via
 * `RTCDataChannel`.
 *
 */
class WebRTCService extends Service {
  /**
   * @param  {number} id Service identifier
   * @param  {RTCIceServer} iceServers WebRTC configuration object
   */
  constructor (id, iceServers) {
    super(id)
    /**
     * @private
     * @type {RTCIceServer}
     */
    this.iceServers = iceServers
  }

  /**
   * @param {Channel} channel
   * @param {number} senderId
   * @param {number} recepientId
   * @param {Object} msg
   */
  onMessage (channel, senderId, recepientId, msg) {
    const wc = channel.webChannel
    let item = super.getItem(wc, senderId)
    if (!item) {
      item = new CandidatesBuffer()
      super.setItem(wc, senderId, item)
    }
    if ('offer' in msg) {
      item.pc = this.createPeerConnection(candidate => {
        wc.sendInnerTo(senderId, this.id, {candidate})
      })
      this.listenOnDataChannel(item.pc, dataCh => {
        setTimeout(() => super.removeItem(wc, senderId), REMOVE_ITEM_TIMEOUT)
        ServiceFactory.get(CHANNEL_BUILDER).onChannel(wc, dataCh, senderId)
      })
      this.createAnswer(item.pc, msg.offer, item.candidates)
        .then(answer => wc.sendInnerTo(senderId, this.id, {answer}))
        .catch(err => console.error(`During Establishing dataChannel connection over webChannel: ${err.message}`))
    } if ('answer' in msg) {
      item.pc.setRemoteDescription(msg.answer)
        .then(() => item.pc.addReceivedCandidates(item.candidates))
        .catch(err => console.error(`Set answer (webChannel): ${err.message}`))
    } else if ('candidate' in msg) {
      this.addIceCandidate(item, msg.candidate)
    }
  }

  /**
   * Establishes an `RTCDataChannel` with a peer identified by `id` trough `WebChannel`.
   *
   * @param {WebChannel} wc
   * @param {number} id
   *
   * @returns {Promise<RTCDataChannel, string>}
   */
  connectOverWebChannel (wc, id) {
    const item = new CandidatesBuffer(this.createPeerConnection(candidate => {
      wc.sendInnerTo(id, this.id, {candidate})
    }))
    super.setItem(wc, id, item)
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error(`WebRTC ${CONNECT_OVER_WEBCHANNEL_TIMEOUT} connection timeout`)), CONNECT_OVER_WEBCHANNEL_TIMEOUT)
      this.createDataChannel(item.pc, dataCh => {
        setTimeout(() => super.removeItem(wc, id), REMOVE_ITEM_TIMEOUT)
        resolve(dataCh)
      })
      this.createOffer(item.pc)
        .then(offer => wc.sendInnerTo(id, this.id, {offer}))
        .catch(reject)
    })
  }

  /**
   *
   * @param {WebSocket} ws
   * @param {function(channel: RTCDataChannel)} onChannel
   *
   */
  listenFromSignaling (signaling, onChannel) {
    signaling.filter(msg => 'id' in msg && 'data' in msg)
      .subscribe(
        msg => {
          let item = super.getItem(signaling, msg.id)
          if (!item) {
            item = new CandidatesBuffer(this.createPeerConnection(candidate => {
              signaling.send(JSON.stringify({id: msg.id, data: {candidate}}))
            }))
            super.setItem(signaling, msg.id, item)
          }
          if ('offer' in msg.data) {
            this.listenOnDataChannel(item.pc, dataCh => {
              setTimeout(() => super.removeItem(signaling, msg.id), REMOVE_ITEM_TIMEOUT)
              onChannel(dataCh)
            })
            this.createAnswer(item.pc, msg.data.offer, item.candidates)
              .then(answer => {
                signaling.send(JSON.stringify({id: msg.id, data: {answer}}))
              })
              .catch(err => {
                console.error(`During establishing data channel connection through signaling: ${err.message}`)
              })
          } else if ('candidate' in msg.data) {
            this.addIceCandidate(item, msg.data.candidate)
          }
        },
        err => console.log(err),
        () => {
          // clean
        }
      )
  }

  /**
   *
   * @param {type} ws
   * @param {type} key Description
   *
   * @returns {type} Description
   */
  connectOverSignaling (signaling, key) {
    const item = new CandidatesBuffer(this.createPeerConnection(candidate => {
      signaling.send(JSON.stringify({data: {candidate}}))
    }))
    super.setItem(signaling, key, item)
    return new Promise((resolve, reject) => {
      const subs = signaling.filter(msg => 'data' in msg)
        .subscribe(
          msg => {
            if ('answer' in msg.data) {
              item.pc.setRemoteDescription(msg.data.answer)
                .then(() => item.pc.addReceivedCandidates(item.candidates))
                .catch(err => reject(new Error(`Set answer (signaling): ${err.message}`)))
            } else if ('candidate' in msg.data) {
              this.addIceCandidate(super.getItem(signaling, key), msg.data.candidate)
            }
          },
          err => {
            super.removeItem(signaling, key)
            reject(err)
          },
          () => {
            super.removeItem(signaling, key)
            reject(new Error(`Could not create an RTCDataChannel: WebSocket ${signaling.socket.url} closed`))
          }
        )
      this.createDataChannel(item.pc, dataCh => {
        setTimeout(() => {
          subs.unsubscribe()
          super.removeItem(signaling, key)
        }, REMOVE_ITEM_TIMEOUT)
        resolve(dataCh)
      })
      this.createOffer(item.pc)
        .then(offer => {
          signaling.send(JSON.stringify({data: {offer}}))
          setTimeout(() => {
            reject(new Error(`Could not create an RTCDataChannel: CONNECT_OVER_SIGNALING_TIMEOUT (${CONNECT_OVER_SIGNALING_TIMEOUT}ms)`))
          }, CONNECT_OVER_SIGNALING_TIMEOUT)
        })
        .catch(reject)
    })
  }

  /**
   * Creates an SDP offer.
   *
   * @private
   * @param  {RTCPeerConnection} pc
   * @return {Promise<RTCSessionDescription, string>} - Resolved when the offer has been succesfully created,
   * set as local description and sent to the peer.
   */
  createOffer (pc) {
    return pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .then(() => {
        return {
          type: pc.localDescription.type,
          sdp: pc.localDescription.sdp
        }
      })
  }

  /**
   * Creates an SDP answer.
   *
   * @private
   * @param {RTCPeerConnection} pc
   * @param {string} offer
   * @param {string[]} candidates
   * @return {Promise<RTCSessionDescription, string>} - Resolved when the offer
   *  has been succesfully created, set as local description and sent to the peer.
   */
  createAnswer (pc, offer, candidates) {
    return pc.setRemoteDescription(offer)
      .then(() => {
        pc.addReceivedCandidates(candidates)
        return pc.createAnswer()
      })
      .then(answer => pc.setLocalDescription(answer))
      .then(() => {
        return {
          type: pc.localDescription.type,
          sdp: pc.localDescription.sdp
        }
      })
  }

  /**
   * Creates an instance of `RTCPeerConnection` and sets `onicecandidate` event handler.
   *
   * @private
   * @param  {function(candidate: Object)} onCandidate
   * candidate event handler.
   * @return {RTCPeerConnection}
   */
  createPeerConnection (onCandidate) {
    const pc = new wrtc.RTCPeerConnection({iceServers: this.iceServers})
    pc.isRemoteDescriptionSet = false
    pc.addReceivedCandidates = candidates => {
      pc.isRemoteDescriptionSet = true
      for (let c of candidates) this.addIceCandidate({pc}, c)
    }
    pc.onicecandidate = evt => {
      if (evt.candidate !== null) {
        const candidate = {
          candidate: evt.candidate.candidate,
          sdpMid: evt.candidate.sdpMid,
          sdpMLineIndex: evt.candidate.sdpMLineIndex
        }
        onCandidate(candidate)
      }
    }
    return pc
  }

  /**
   *
   * @private
   * @param {RTCPeerConnection} pc
   * @param {function(dc: RTCDataChannel)} onOpen
   *
   */
  createDataChannel (pc, onOpen) {
    const dc = pc.createDataChannel(null)
    dc.onopen = evt => onOpen(dc)
    this.setUpOnDisconnect(pc, dc)
  }

  /**
   *
   * @private
   * @param {RTCPeerConnection} pc
   * @param {function(dc: RTCDataChannel)} onOpen
   *
   */
  listenOnDataChannel (pc, onOpen) {
    pc.ondatachannel = dcEvt => {
      this.setUpOnDisconnect(pc, dcEvt.channel)
      dcEvt.channel.onopen = evt => onOpen(dcEvt.channel)
    }
  }

  /**
   * @private
   * @param {RTCPeerConnection} pc
   * @param {RTCDataChannel} dataCh
   */
  setUpOnDisconnect (pc, dataCh) {
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected') {
        if (dataCh.onclose) {
          dataCh.onclose(new CloseEvent('disconnect', {
            code: 4201,
            reason: 'disconnected'
          }))
        }
      }
    }
  }

  /**
   * @private
   * @param {CandidatesBuffer|null} obj
   * @param {string} candidate
   */
  addIceCandidate (obj, candidate) {
    if (obj !== null && obj.pc && obj.pc.isRemoteDescriptionSet) {
      obj.pc.addIceCandidate(new wrtc.RTCIceCandidate(candidate))
        .catch(evt => console.error(`Add ICE candidate: ${evt.message}`))
    } else obj.candidates[obj.candidates.length] = candidate
  }
}

/**
 * @private
 */
class CandidatesBuffer {
  constructor (pc = null, candidates = []) {
    this.pc = pc
    this.candidates = candidates
  }
}

export default WebRTCService
