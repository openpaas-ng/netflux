import Util from 'Util'
import Service from 'service/Service'

const EventSource = Util.requireLib(Util.EVENT_SOURCE_LIB)
const XMLHttpRequest = Util.requireLib(Util.XML_HTTP_REQUEST_LIB)

const CONNECT_TIMEOUT = 2000
const CLOSE_AFTER_RECONNECT_TIMEOUT = 6000

/**
 * Service class responsible to establish connections between peers via
 * `WebSocket`.
 */
class EventSourceService extends Service {

  /**
   * Creates EventSource object.
   *
   * @param {string} url - Server url
   * @returns {Promise<EventSource, string>} It is resolved once the WebSocket has been created and rejected otherwise
   */
  connect (url) {
    return new Promise((resolve, reject) => {
      try {
        const res = new RichEventSource(url)
        res.addEventListener('auth', evtMsg => {
          res.auth = evtMsg.data
          if (res.OPEN === undefined) {
            res.OPEN = 1
          }

          // Close function is defined here and not in the RichEventSource class
          // definition, because in NodeJS with eventsource package, method
          // overriding does not work.
          res.nativeClose = res.close
          res.close = function () {
            if (typeof this.onclose === 'function') {
              this.onclose(Util.createCloseEvent('close'))
            }
            this.nativeClose()
          }
          resolve(res)
        })
        res.onerror = err => reject(err.message)
        // Timeout if "auth" event has not been received.
        setTimeout(() => {
          reject(`Authentication event has not been received from ${url} within ${CONNECT_TIMEOUT}ms`)
        }, CONNECT_TIMEOUT)
      } catch (err) {
        reject(err.message)
      }
    })
  }
}

class RichEventSource extends EventSource {

  constructor (url) {
    super(url)
    this.auth = ''
    this.reconnectTimeout = null
    this.onopen = () => {
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout)
      }
    }
  }

  set onerror (cb) {
    super.onerror = err => {
      cb(err)
      if (!this.reconnectTimeout) {
        this.reconnectTimeout = setTimeout(() => {
          this.close()
        }, CLOSE_AFTER_RECONNECT_TIMEOUT)
      }
    }
  }

  // close () {
  //   console.log('closing EventSource')
  //   if (typeof this.onclose === 'function') {
  //     this.onclose(new CloseEvent('close'))
  //   }
  //   super.close()
  // }

  send (str = '') {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', this.url, true)

    xhr.onload = () => {
      if (xhr.status !== 200) {
        super.onerror(new Error(xhr.statusText))
      }
    }

    xhr.onerror = err => super.onerror(new Error(err.message))
    xhr.send(`${this.auth}@${str}`)
  }
}

export default EventSourceService
