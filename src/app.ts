import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

io.on('connection', (socket) => {
  console.log(socket.id)
})

app.use(express.static('public'))

httpServer.listen(1337)
