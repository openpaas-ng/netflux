import { LogLevel as Logs, setLogLevel as setLogs } from './misc/Util'
import { TopologyEnum } from './service/topology/Topology'
import { SignalingState as SigState } from './Signaling'

export { WebGroup, WebGroupOptions, WebGroupState, DataType } from './WebChannelFacade'

/**
 * Set log level for debugging utility. By default all logs are disabled.
 * @param {...LogLevel} levels
 */
export function setLogLevel (...levels: Logs[]) { setLogs(levels) }

/**
 * The state enum of the signaling server for WebRTC.
 */
export class SignalingState {
  /**
   * Equals to `0`, the connection is not yet open. Value
   * @type {number}
   */
  static get CONNECTING (): number { return SigState.CONNECTING }

  /**
   * Equals to `'CONNECTING'`.
   * @type {string}
   */
  static get [SignalingState.CONNECTING] (): string { return SigState[SigState.CONNECTING] }

  /**
   * Equals to `1`, `RTCDataChannel` has been established with one of the group member.
   * From now the signaling is no longer needed, because the joining process
   * will continue with a help of this member.
   * @type {number}
   */
  static get CONNECTED (): number { return SigState.CONNECTED }

  /**
   * Equals to `'CONNECTED'`.
   * @type {string}
   */
  static get [SignalingState.CONNECTED] (): string {
    return SigState[SigState.CONNECTED]
  }

  /**
   * Equals to `2`, you has successfully joined a web group and ready to help join others.
   * @type {number}
   */
  static get STABLE (): number { return SigState.STABLE }

  /**
   * Equals to `'STABLE'`.
   * @type {string}
   */
  static get [SignalingState.STABLE] (): string { return SigState[SigState.STABLE] }

  /**
   * Equals to `3`, the connection is in process of closing.
   * @type {number}
   */
  static get CLOSING (): number { return SigState.CLOSING }

  /**
   * Equals to `'CLOSING'`.
   * @type {string}
   */
  static get [SignalingState.CLOSING] (): string { return SigState[SigState.CLOSING] }

  /**
   * Equals to `4`, the connection is closed.
   * @type {number}
   */
  static get CLOSED (): number { return SigState.CLOSED }

  /**
   * Equals to `'CLOSED'`.
   * @type {string}
   */
  static get [SignalingState.CLOSED] (): string { return SigState[SigState.CLOSED] }
}

/**
 * The topology enum.
 */
export class Topology {
  /**
   * Full mesh topology identifier.
   * @type {number}
   */
  static get FULL_MESH (): number { return TopologyEnum.FULL_MESH }

  /**
   * Equals to `'FULL_MESH'`.
   * @type {string}
   */
  static get [Topology.FULL_MESH] (): string { return TopologyEnum[TopologyEnum.FULL_MESH] }
}

/**
 * The log level enum.
 */
export class LogLevel {

  /**
   * Equals to `1`, allows logs for debug.
   * @type {number}
   */
  static get DEBUG (): number { return Logs.DEBUG }

  /**
   * Equals to `'DEBUG'`.
   * @type {string}
   */
  static get [Logs.DEBUG] (): string { return Logs[Logs.DEBUG] }

  /**
   * Equals to `2`, logs for WebGroup module.
   * @type {number}
   */
  static get WEB_GROUP (): number { return Logs.WEB_GROUP }

  /**
   * Equals to `'WEB_GROUP'`.
   * @type {string}
   */
  static get [Logs.WEB_GROUP] (): string { return Logs[Logs.WEB_GROUP] }

  /**
   * Equals to `3`, logs for WebRTCBuilder module.
   * @type {number}
   */
  static get WEBRTC (): number { return Logs.WEBRTC }

  /**
   * Equals to `'WEBRTC'`.
   * @type {string}
   */
  static get [Logs.WEBRTC] (): string { return Logs[Logs.WEBRTC] }

  /**
   * Equals to `4`, logs for Channel module.
   * @type {number}
   */
  static get CHANNEL (): number { return Logs.CHANNEL }

  /**
   * Equals to `'CHANNEL'`.
   * @type {string}
   */
  static get [Logs.CHANNEL] (): string { return Logs[Logs.CHANNEL] }

  /**
   * Equals to `5`, logs for Topology module.
   * @type {number}
   */
  static get TOPOLOGY (): number { return Logs.TOPOLOGY }

  /**
   * Equals to `'TOPOLOGY'`.
   * @type {string}
   */
  static get [Logs.TOPOLOGY] (): string { return Logs[Logs.TOPOLOGY] }

  /**
   * Equals to `6`, logs for Signaling module.
   * @type {number}
   */
  static get SIGNALING (): number { return Logs.SIGNALING }

  /**
   * Equals to `'SIGNALING'`.
   * @type {string}
   */
  static get [Logs.SIGNALING] (): string { return Logs[Logs.SIGNALING] }

  /**
   * Equals to `7`, logs for ChannelBuilder module.
   * @type {number}
   */
  static get CHANNEL_BUILDER (): number { return Logs.CHANNEL_BUILDER }

  /**
   * Equals to `'CHANNEL_BUILDER'`.
   * @type {string}
   */
  static get [Logs.CHANNEL_BUILDER] (): string { return Logs[Logs.CHANNEL_BUILDER] }

}

/**
 * The options to be passed into {@link WebGroup} constructor.
 * @typedef {Object} WebGroupOptions
 * @property {Topology} [topology] Topology identifier
 * (Full mesh is the only one supported by Netflux for now).
 * @property {string} [signalingServer] Signaling URL for WebRTC.
 * @property {RTCConfiguration} [rtcConfiguration] Configuration for WebRTC.
 * @property {boolean} [autoRejoin] Whether to automatically rejoin the web group
 * on disconnect or not. Its value may be modified after {@link WebGroup}
 * instantiation at any time.
 */

/**
 * The options to be passed into {@link WebGroupBotServer} constructor.
 * @typedef {Object} WebGroupBotServerOptions
 * @property {Topology} [topology] See WebGroupOptions.topology
 * @property {string} [signalingServer] See WebGroupOptions.signalingServer
 * @property {RTCConfiguration} [rtcConfiguration] See WebGroupOptions.rtcConfiguration
 * @property {boolean} [autoRejoin] See WebGroupOptions.autoRejoin
 * @property {Object} bot Server related options of the bot.
 * @property {NodeJSHttpServer|NodeJSHttpsServer} bot.server NodeJS http(s) server.
 * @property {string} [bot.url] Bot server URL.
 * @property {boolean} [bot.perMessageDeflate] Enable/disable permessage-deflate.
 */

 /**
  * @external {RTCConfiguration} https://developer.mozilla.org/en/docs/Web/API/RTCConfiguration
  */

 /**
  * @external {Uint8Array} https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
  */

 /**
  * @external {NodeJSHttpServer} https://nodejs.org/api/http.html#http_class_http_server
  */

 /**
  * @external {NodeJSHttpsServer} https://nodejs.org/api/https.html#https_class_https_server
  */
