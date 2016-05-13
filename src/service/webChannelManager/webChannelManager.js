import * as service from '../service'
import provide from '../../serviceProvider'
import JoiningPeer from '../../JoiningPeer'

/**
 * Web Channel Manager module is a submodule of {@link module:service} and the
 * main component of any Web Channel. It is responsible to preserve Web Channel
 * structure intact (i.e. all peers have the same vision of the Web Channel).
 * Among its duties are:
 *
 * - Add a new peer into Web Channel.
 * - Remove a peer from Web Channel.
 * - Send a broadcast message.
 * - Send a message to a particular peer.
 *
 * @module webChannelManager
 * @see FullyConnectedService
 */

/**
 * Connection service of the peer who received a message of this type should
 * establish connection with one or several peers.
 */
const CONNECT_WITH = 1
const CONNECT_WITH_FEEDBACK = 2
const CONNECT_WITH_TIMEOUT = 5000
const ADD_INTERMEDIARY_CHANNEL = 4
const THIS_CHANNEL_TO_JOINING_PEER = 5

/**
 * Each Web Channel Manager Service must implement this interface.
 * @interface
 * @extends module:service~Interface
 */
class Interface extends service.Interface {

  onMessage (wc, channel, msg) {
    let cBuilder = provide(wc.settings.connector, wc.settings)
    switch (msg.code) {
      case CONNECT_WITH:
        msg.peers = this.reUseIntermediaryChannelIfPossible(wc, msg.jpId, msg.peers)
        let failed = []
        if (msg.peers.length === 0) {
          wc.sendSrvMsg(this.name, msg.sender,
            {code: CONNECT_WITH_FEEDBACK, id: wc.myId, failed}
          )
        } else {
          let counter = 0
          msg.peers.forEach((id) => {
            cBuilder.connectMeTo(wc, id)
              .then((channel) => {
                return wc.initChannel(channel, true, id)
              })
              .then((channel) => {
                wc.getJoiningPeer(msg.jpId).toAddList(channel)
                wc.sendSrvMsg(this.name, wc.myId,
                  {code: THIS_CHANNEL_TO_JOINING_PEER, id: msg.jpId, toBeAdded: true},
                  channel
                )
                counter++
                if (counter === msg.peers.length) {
                  wc.sendSrvMsg(this.name, msg.sender,
                    {code: CONNECT_WITH_FEEDBACK, id: wc.myId, failed}
                  )
                }
              })
              .catch((reason) => {
                counter++
                failed.push({id, reason})
                if (counter === msg.peers.length) {
                  wc.sendSrvMsg(this.name, msg.sender,
                    {code: CONNECT_WITH_FEEDBACK, id: wc.myId, failed}
                  )
                }
              })
          })
        }
        break
      case CONNECT_WITH_FEEDBACK:
        wc.connectWithRequests.get(msg.id)(true)
        break
      case ADD_INTERMEDIARY_CHANNEL:
        let jp = wc.getJoiningPeer(msg.jpId)
        jp.toAddList(jp.intermediaryChannel)
        break
      case THIS_CHANNEL_TO_JOINING_PEER:
        if (wc.hasJoiningPeer(msg.id)) {
          jp = wc.getJoiningPeer(msg.id)
        } else {
          jp = new JoiningPeer(msg.id)
          wc.addJoiningPeer(jp)
        }
        if (msg.toBeAdded) {
          jp.toAddList(this)
        } else {
          jp.toRemoveList(this)
        }
        break
    }
  }

  /**
   * Send a request to a peer asking him to establish a connection with some
   * peers. This function is used when a new peer is joining Web Channel.
   * The request can be sent to the peer who is joining as well as other peers
   * who are already members of Web Channel.
   *
   * @param  {WebChannel} wc - The Web Channel.
   * @param  {string} id - Id of the peer who will receive this request.
   * @param  {string} jpId - Joining peer id (it is possible that `id`=`jpId`).
   * @param  {string[]} peers - Ids of peers with whom `id` peer must established
*              connections.
   * @return {Promise} - Is resolved once some of the connections could be established. It is rejected when an error occured.
   */
  connectWith (wc, id, jpId, peers) {
    wc.sendSrvMsg(this.name, id,
      {code: CONNECT_WITH, jpId: jpId, sender: wc.myId, peers}
    )
    return new Promise((resolve, reject) => {
      wc.connectWithRequests.set(id, (isDone) => {
        if (isDone) {
          resolve()
        } else {
          reject()
        }
      })
      setTimeout(() => {
        reject('CONNECT_WITH_TIMEOUT')
      }, this.calculateConnectWithTimeout(peers.length))
    })
  }

  calculateConnectWithTimeout (nbPeers) {
    if (nbPeers > 0) {
      return CONNECT_WITH_TIMEOUT + Math.log10(nbPeers)
    } else {
      return CONNECT_WITH_TIMEOUT
    }
  }

  reUseIntermediaryChannelIfPossible (webChannel, jpId, ids) {
    let idToRemove = null
    let jp
    if (webChannel.isJoining()) {
      jp = webChannel.getJoiningPeer(jpId)
      if (ids.indexOf(jp.intermediaryId) !== -1) {
        idToRemove = jp.intermediaryId
      }
    } else {
      if (ids.indexOf(jpId) !== -1) {
        jp = webChannel.getJoiningPeer(jpId)
        if (jp.intermediaryChannel !== null) {
          idToRemove = jpId
        }
      }
    }
    if (idToRemove !== null) {
      jp.toAddList(jp.intermediaryChannel)
      webChannel.sendSrvMsg(this.name, idToRemove, {
        code: ADD_INTERMEDIARY_CHANNEL, jpId
      })
      ids.splice(ids.indexOf(idToRemove), 1)
    }
    return ids
  }

  /**
   * Adds a new peer into Web Channel.
   *
   * @abstract
   * @param  {Channel} ch - Channel to be added (it should has
   * the `webChannel` property).
   * @return {Promise} - Resolved once the channel has been succesfully added,
   * rejected otherwise.
   */
  add (ch) {
    throw new Error('Must be implemented by subclass!')
  }

  /**
   * Send a message to all peers in Web Channel.
   *
   * @abstract
   * @param  {WebChannel} wc - Web Channel where the message will be propagated.
   * @param  {string} data - Data in stringified JSON format to be send.
   */
  broadcast (wc, data) {
    throw new Error('Must be implemented by subclass!')
  }

  /**
   * Send a message to a particular peer in Web Channel.
   *
   * @abstract
   * @param  {string} id - Peer id.
   * @param  {WebChannel} wc - Web Channel where the message will be propagated.
   * @param  {string} data - Data in stringified JSON format to be send.
   */
  sendTo (id, wc, data) {
    throw new Error('Must be implemented by subclass!')
  }

  /**
   * Leave Web Channel.
   *
   * @abstract
   * @param  {WebChannel} wc - Web Channel to leave.
   */
  leave (wc) {
    throw new Error('Must be implemented by subclass!')
  }
}

export {
/** @see module:webChannelManager~Interface */
Interface }
