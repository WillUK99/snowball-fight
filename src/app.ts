import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
const tmx = require('tmx-parser')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

async function main() {
  const map: any = await new Promise((resolve, reject) => {
    tmx.parseFile('./src/map.tmx', (err: Error, loadedMap: any) => {
      if (err) return reject(err)
      resolve(loadedMap)
    })
  })

  const layer = map.layers[0]
  const tiles = layer.tiles
  // console.log(tiles)
  const map2D: any[] = []

  for (let row = 0; row < map.width; row++) {
    const tileRow: any[] = []
    for (let column = 0; column < map.height; column++) {
      const tile = tiles[row * map.height + column]
      map2D.push({ id: tile.id, gid: tile.gid })
    }
    map2D.push(tileRow)
  }

  console.log('***', map2D)

  io.on('connect', (socket) => {
    io.emit('mapData', map2D)
  })

  app.use(express.static('public'))

  httpServer.listen(1337)
}

main()

