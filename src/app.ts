import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
const mapLoader = require('./loader')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

type InputsMap = {
  [key: string]: {
    'w': boolean
    'a': boolean
    's': boolean
    'd': boolean
  }
}

type Player = {
  id: string
  x: number
  y: number
}

const TICK_RATE = 30
const MOVEMENT_SPEED = 10

let players: Player[] = []
const inputsMap: InputsMap = {}

const tick = () => {
  for (const player of players) {
    const inputsForPlayer = inputsMap[player.id]
    if (inputsForPlayer.w) player.y -= MOVEMENT_SPEED
    if (inputsForPlayer.a) player.x -= MOVEMENT_SPEED
    if (inputsForPlayer.s) player.y += MOVEMENT_SPEED
    if (inputsForPlayer.d) player.x += MOVEMENT_SPEED
  }

  io.emit('players', players)
}

const main = async () => {
  const map2D = await mapLoader()

  io.on('connect', (socket) => {
    socket.emit('2D Map', map2D)

    inputsMap[socket.id] = {
      'w': false,
      'a': false,
      's': false,
      'd': false,
    }

    players.push({
      id: socket.id,
      x: 0,
      y: 0,
    })

    socket.on('inputs', (inputs) => {
      inputsMap[socket.id] = inputs
    })

    socket.on('disconnect', () => {
      players = players.filter((player) => player.id !== socket.id)
    })
  })

  app.use(express.static('public'))

  httpServer.listen(1337)

  setInterval(() => {
    tick()
  }, 1000 / TICK_RATE)
}

main()

