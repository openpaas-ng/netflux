import BotServer from 'BotServer'
import WebChannel from 'WebChannel'
import {WEBSOCKET, WEBRTC, FULLY_CONNECTED} from 'serviceProvider'

let defaultSettings = {
  connector: WEBRTC,
  topology: FULLY_CONNECTED,
  signalingURL: 'wss://sigver-coastteam.rhcloud.com:8443',
  iceServers: [
    {urls: 'stun:turn01.uswest.xirsys.com'}
  ],
  listenOn: ''
}

function create (options) {
  let mySettings = Object.assign({}, defaultSettings, options)
  return new WebChannel(mySettings)
}

export {
  create,
  BotServer,
  WEBSOCKET,
  WEBRTC
}

/**
* @external ws/WebSocket
* @see {@link https://github.com/websockets/ws/blob/master/doc/ws.md#user-content-class-wswebsocket}
*/
/**
 * @external JSON
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON}
 */
/**
 * @external Error
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Error}
 */
/**
 * @external RTCPeerConnection
 * @see {@link https://developer.mozilla.org/en/docs/Web/API/RTCPeerConnection}
 */
/**
 * @external RTCSessionDescription
 * @see {@link https://developer.mozilla.org/en/docs/Web/API/RTCSessionDescription}
 */
/**
 * @external RTCDataChannel
 * @see {@link https://developer.mozilla.org/en/docs/Web/API/RTCDataChannel}
 */
/**
 * @external RTCIceCandidate
 * @see {@link https://developer.mozilla.org/en/docs/Web/API/RTCIceCandidate}
 */
/**
 * @external RTCPeerConnectionIceEvent
 * @see {@link https://developer.mozilla.org/en/docs/Web/API/RTCPeerConnectionIceEvent}
 */
/**
 * @external CloseEvent
 * @see {@link https://developer.mozilla.org/en/docs/Web/API/CloseEvent/CloseEvent}
 */
/**
 * @external WebSocket
 * @see {@link https://developer.mozilla.org/en/docs/Web/API/WebSocket}
 */
/**
 * @external Set
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Set}
 */
/**
 * @external Map
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map}
 */
/**
 * @external ArrayBufferView
 * @see {@link https://developer.mozilla.org/en/docs/Web/API/ArrayBufferView}
 */
/**
 * @external ArrayBuffer
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}
 */
/**
 * @external String
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String}
 */
/**
 * @external Int8Array
 * @see {@link developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Int8Array}
 */
/**
 * @external Uint8Array
 * @see {@link developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array}
 */
/**
 * @external Uint8ClampedArray
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray}
 */
/**
 * @external Int16Array
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Int16Array}
 */
/**
 * @external Uint16Array
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array}
 */
/**
 * @external Int32Array
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Int32Array}
 */
/**
 * @external Uint32Array
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array}
 */
/**
 * @external Float32Array
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Float32Array}
 */
/**
 * @external Float64Array
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Float64Array}
 */
/**
 * @external DataView
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/DataView}
 */

/**
 * An event handler to be called when the *close* event is received either by the *WebSocket* or by the *RTCDataChannel*.
 * @callback closeEventHandler
 * @param {external:CloseEvent} evt Close event object
 */

 /**
  * An event handler to be called when a *Channel* has been established.
  * @callback channelEventHandler
  * @param {Channel} channel Netflux channel
  */
