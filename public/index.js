const mapImage = new Image()
mapImage.src = '/snowy-sheet.png'

const canvasEl = document.getElementById('canvas')
const ctx = canvasEl.getContext('2d')
canvasEl.width = window.innerWidth
canvasEl.height = window.innerHeight

let map = [[]]
const TILE_SIZE = 16
const TILES_IN_ROW = 8

window.addEventListener('resize', () => {
  canvasEl.width = window.innerWidth
  canvasEl.height = window.innerHeight
})

const socket = io(`ws://localhost:1337`)

socket.on('connect', () => {
  console.log('connected')
})

socket.on('2D Map', (mapData) => map = mapData)

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < map.length; row++) {
    for (let column = 0; column < map[0].length; column++) {
      const { id } = map[row][column]
      const imageRow = parseInt(id / TILES_IN_ROW, 10)
      const imageColumn = parseInt(id % TILES_IN_ROW, 10)
      ctx.drawImage(
        mapImage,
        imageColumn * TILE_SIZE,
        imageRow * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        column * TILE_SIZE,
        row * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
      )
    }
  }

  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)
