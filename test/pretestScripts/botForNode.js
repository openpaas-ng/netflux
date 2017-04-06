import {create} from 'dist/netflux.es5.module.node.js'
import {SIGNALING_URL, onMessageForBot} from 'test/util/helper'

run()

// Functions
function run () {
  const wc = create({signalingURL: SIGNALING_URL})
  wc.onMessage = (id, msg, isBroadcast) => onMessageForBot(wc, id, msg, isBroadcast)
  wc.onClose = closeEvt => {
    console.log(`Node bot has disconnected from: ${SIGNALING_URL}`)
  }
  wc.open('NODE')
    .then(() => console.log('Bot for Node is ready'))
    .catch(reason => console.error('Node bot WebChannel open error: ' + reason))

  process.on('SIGINT', () => wc.leave())
}
