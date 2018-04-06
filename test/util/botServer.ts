import { ReplaySubject } from 'rxjs/ReplaySubject'

import { SignalingState, WebGroup, WebGroupBotServer, WebGroupState } from '../../src/index.node'
import { BOT_HOST, BOT_PORT } from './helper'

// Require dependencies
const http = require('http')
const Koa = require('koa')
const Router = require('koa-router')
const cors = require('kcors')

interface IData {
  onMemberJoinCalled: number
  joinedMembers: number[]
  onMemberLeaveCalled: number
  leftMembers: number
  onStateCalled: number
  states: WebGroupState[]
  onSignalingStateCalled: number
  signalingStates: SignalingState[]
  messages: any[]
  onMessageToBeCalled: number
  state: WebGroupState
  signalingState: SignalingState
  key: string
  topology: number
  members: number[]
  myId: number
  id: number
}

try {
  // Instantiate main objects
  const app = new Koa()
  const router = new Router()
  const server = http.createServer(app.callback())
  const bot = new WebGroupBotServer({ server })
  const webGroups: ReplaySubject<WebGroup> = new ReplaySubject()

  // Configure router
  router
    .get('/data/:wcId', (ctx: any) => {
      const wcId = Number(ctx.params.wcId)
      for (const wg of bot.webGroups) {
        if (wg.id === wcId) {
          ctx.body = fullData(wg)
          return
        }
      }
      ctx.throw(404, 'WebGroup ' + wcId + ' not found')
    })
    .get('/waitJoin/:wcId', async (ctx: any) => {
      const wcId = Number(ctx.params.wcId)
      await new Promise((resolve) => {
        webGroups.subscribe((wg: WebGroup) => {
          if (wg.id === wcId) {
            resolve()
          }
        })
      })
      for (const wg of bot.webGroups) {
        if (wg.id === wcId) {
          await (wg as any).waitJoin
          ctx.body = {id: wcId}
          return
        }
      }
      console.log('err')
      ctx.throw(404, 'WebGroup ' + wcId + ' not found')
    })
    .get('/send/:wcId', (ctx: any) => {
      const wcId = Number(ctx.params.wcId)
      for (const wc of bot.webGroups) {
        if (wc.id === wcId) {
          // Create a message
          const msg = JSON.stringify({ id: wc.myId })

          // Broadcast the message
          wc.send(msg)

          // Send the message privately to each peer
          wc.members.forEach((id) => {
            if (id !== wc.myId) {
              wc.sendTo(id, msg)
            }
          })
          ctx.status = 200
          break
        }
      }
    })

  // Apply router and cors middlewares
  app
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())

  // Configure bot
  bot.onWebGroup = (wg: WebGroup) => {
    const data: any = {
      onMemberJoinCalled: 0,
      joinedMembers: [],
      onMemberLeaveCalled: 0,
      leftMembers: [],
      onStateCalled: 0,
      states: [],
      onSignalingStateCalled: 0,
      signalingStates: [],
      messages: [],
      onMessageToBeCalled: 0,
    }
    const anyWg = (wg as any)
    anyWg.waitJoin = new Promise((resolve) => {
      wg.onStateChange = (state) => {
        if (state === WebGroupState.JOINED) {
          resolve()
        }
        data.onStateCalled++
        data.states.push(state)
      }
    })
    wg.onMessage = (id, msg: string | Uint8Array) => {
      data.onMessageToBeCalled++
      data.messages.push({
        id,
        msg: msg instanceof Uint8Array ? Array.from(msg) : msg,
      })
      let feedback
      let isSend = false
      if (typeof msg === 'string') {
        feedback = 'bot: ' + msg
        isSend = msg.startsWith('send')
      } else {
        isSend = msg[0] === 10
        msg[0] = 42
        feedback = msg
      }
      if (isSend) {
        wg.send(feedback)
      } else {
        wg.sendTo(id, feedback)
      }
    }
    wg.onMemberJoin = (id) => {
      data.onMemberJoinCalled++
      data.joinedMembers.push(id)
    }
    wg.onMemberLeave = (id) => {
      data.onMemberLeaveCalled++
      data.leftMembers.push(id)
    }

    wg.onSignalingStateChange = (state) => {
      data.onSignalingStateCalled++
      data.signalingStates.push(state)
    }
    anyWg.data = data
    webGroups.next(wg)
  }
  bot.onError = (err) => console.error('Bot ERROR: ', err)
  // Start the server
  server.listen(BOT_PORT, BOT_HOST, () => {
    const host = server.address().address
    const port = server.address().port
    console.info('Netflux bot is listening on ' + host + ':' + port)
  })

  // Leave all web channels before process death
  process.on('SIGINT', () => bot.webGroups.forEach((wg) => wg.leave()))
} catch (err) {
  console.error('WebGroupBotServer script error: ', err)
}

function fullData (wg: any): IData {
  wg.data.state = wg.state
  wg.data.signalingState = wg.signalingState
  wg.data.key = wg.key
  wg.data.topology = wg.topology
  wg.data.members = wg.members
  wg.data.myId = wg.myId
  wg.data.id = wg.id
  return wg.data
}
