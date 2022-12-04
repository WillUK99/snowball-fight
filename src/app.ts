import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
const mapLoader = require('./loader')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

async function main() {
  const map2D = await mapLoader()

  io.on('connect', (socket) => {
    socket.emit('2D Map', map2D)
  })

  app.use(express.static('public'))

  httpServer.listen(1337)
}

main()

