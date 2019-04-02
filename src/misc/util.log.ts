const netfluxCSS = 'background-color: #FFCA28; padding: 0 3px'
const debugCSS = 'background-color: #b3ba2e; padding: 0 3px'
const webrtcCSS = 'background-color: #CE93D8; padding: 0 3px'
const channelCSS = 'background-color: #90CAF9; padding: 0 3px'
const topologyCSS = 'background-color: #26A69A; padding: 0 3px'
const signalingCSS = 'background-color: #66BB6A; padding: 0 3px'
const channelBuilderCSS = 'background-color: #F57C00; padding: 0 3px'
const signalingStateCSS = 'background-color: #9FA8DA; padding: 0 2px'
const webGroupStateCSS = 'background-color: #EF9A9A; padding: 0 2px'
const warningeCSS = 'background-color: #FF5252; padding: 0 2px'

export interface ILog {
  webgroup: (msg: string, ...rest: any[]) => void
  signalingState: (msg: string, id: number) => void
  webGroupState: (msg: string, id: number) => void
  webrtc: (msg: string, ...rest: any[]) => void
  channel: (msg: string, ...rest: any[]) => void
  topology: (msg: string, ...rest: any[]) => void
  signaling: (msg: string, ...rest: any[]) => void
  channelBuilder: (msg: string, ...rest: any[]) => void
  debug: (msg: string, ...rest: any[]) => void
  warn: (msg: string, ...rest: any[]) => void
}

const log: ILog = {
  webgroup: () => {},
  signalingState: () => {},
  webGroupState: () => {},
  webrtc: () => {},
  channel: () => {},
  topology: () => {},
  signaling: () => {},
  channelBuilder: () => {},
  debug: () => {},
  warn: () => {},
}

export enum LogLevel {
  DEBUG,
  WEB_GROUP,
  WEBRTC,
  CHANNEL,
  TOPOLOGY,
  SIGNALING,
  CHANNEL_BUILDER,
}

export let logLevels: LogLevel[] = []

export function setLogLevel(...levels: LogLevel[]) {
  logLevels = levels
  if (logLevels.includes(LogLevel.WEB_GROUP)) {
    log.webgroup = (msg: string, ...rest: any[]): void => {
      if (rest.length === 0) {
        console.info(`%cNETFLUX WebGroup%c: ${msg}`, netfluxCSS, '')
      } else {
        console.info(`%cNETFLUX WebGroup%c: ${msg}`, netfluxCSS, '', ...rest)
      }
    }
    log.signalingState = (msg: string, id: number): void => {
      console.info(
        `%cNETFLUX ${id} WebGroup%c: Signaling: %c${msg}%c`,
        netfluxCSS,
        '',
        signalingStateCSS,
        ''
      )
    }
    log.webGroupState = (msg: string, id: number): void => {
      console.info(
        `%cNETFLUX ${id} WebGroup%c: WebGroup: %c${msg}%c`,
        netfluxCSS,
        '',
        webGroupStateCSS,
        ''
      )
    }
  } else {
    log.webgroup = () => {}
    log.signalingState = () => {}
    log.webGroupState = () => {}
  }

  // DataChannelBuilder logs
  if (logLevels.includes(LogLevel.WEBRTC)) {
    log.webrtc = (msg: string, ...rest: any[]) => {
      if (rest.length === 0) {
        console.info(`%cNETFLUX WebRTC%c: ${msg}`, webrtcCSS, '')
      } else {
        console.info(`%cNETFLUX WebRTC%c: ${msg}`, webrtcCSS, '', ...rest)
      }
    }
  } else {
    log.webrtc = () => {}
  }

  // Channel logs
  if (logLevels.includes(LogLevel.CHANNEL)) {
    log.channel = (msg: string, ...rest: any[]) => {
      if (rest.length === 0) {
        console.info(`%cNETFLUX Channel%c: ${msg}`, channelCSS, '')
      } else {
        console.info(`%cNETFLUX Channel%c: ${msg}`, channelCSS, '', ...rest)
      }
    }
  } else {
    log.channel = () => {}
  }

  // Topology logs
  if (logLevels.includes(LogLevel.TOPOLOGY)) {
    log.topology = (msg: string, ...rest: any[]) => {
      if (rest.length === 0) {
        console.info(`%cNETFLUX Topology%c: ${msg}`, topologyCSS, '')
      } else {
        console.info(`%cNETFLUX Topology%c: ${msg}`, topologyCSS, '', ...rest)
      }
    }
  } else {
    log.topology = () => {}
  }

  // Signaling logs
  if (logLevels.includes(LogLevel.SIGNALING)) {
    log.signaling = (msg: string, ...rest: any[]) => {
      if (rest.length === 0) {
        console.info(`%cNETFLUX Signaling%c: ${msg}`, signalingCSS, '')
      } else {
        console.info(`%cNETFLUX Signaling%c: ${msg}`, signalingCSS, '', ...rest)
      }
    }
  } else {
    log.signaling = () => {}
  }

  // ChannelBuilder logs
  if (logLevels.includes(LogLevel.CHANNEL_BUILDER)) {
    log.channelBuilder = (msg: string, ...rest: any[]) => {
      if (rest.length === 0) {
        console.info(`%cNETFLUX ChannelBuilder%c: ${msg}`, channelBuilderCSS, '')
      } else {
        console.info(`%cNETFLUX ChannelBuilder%c: ${msg}`, channelBuilderCSS, '', ...rest)
      }
    }
  } else {
    log.channelBuilder = () => {}
  }

  // Logs for current DEBUG
  if (logLevels.includes(LogLevel.DEBUG)) {
    log.debug = (msg: string, ...rest: any[]) => {
      if (rest.length === 0) {
        console.info(`%cNETFLUX Debug%c: ${msg}`, debugCSS, '')
      } else {
        console.info(`%cNETFLUX Debug%c: ${msg}`, debugCSS, '', ...rest)
      }
    }
  } else {
    log.debug = () => {}
  }
  log.warn = (msg: string, ...rest: any[]) => {
    if (rest.length === 0) {
      console.info(`%cNETFLUX WARNING%c: ${msg}`, warningeCSS, '')
    } else {
      console.info(`%cNETFLUX WARNING%c: ${msg}`, warningeCSS, '', ...rest)
    }
  }
}

export { log }
