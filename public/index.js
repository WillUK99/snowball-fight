const mapImage = new Image()
mapImage.src = '/snowy-sheet.png'
const santaImage = new Image()
santaImage.src = '/santa.png'

const canvasEl = document.getElementById('canvas')
const ctx = canvasEl.getContext('2d')
canvasEl.width = window.innerWidth
canvasEl.height = window.innerHeight

const TILE_SIZE = 16
const TILES_IN_ROW = 8

let map = [[]]
let players = []


window.addEventListener('resize', () => {
  canvasEl.width = window.innerWidth
  canvasEl.height = window.innerHeight
})

const socket = io(`ws://localhost:1337`)

socket.on('connect', () => {
  console.log('connected')
})

socket.on('2D Map', (mapData) => map = mapData)

socket.on('players', (serverPlayers) => {
  players = serverPlayers
})

const keyboardInputs = {
  'w': false,
  'a': false,
  's': false,
  'd': false,
}

const setActiveKeys = (keyPressed, boolean) => {
  Object.keys(keyboardInputs).map(() => keyboardInputs[keyPressed] = boolean)
  socket.emit('inputs', keyboardInputs)
}

window.addEventListener('keydown', (e) => {
  const { key } = e
  setActiveKeys(key, true)
})

window.addEventListener('keyup', (e) => {
  const { key } = e
  setActiveKeys(key, false)
})

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

  for (const player of players) {
    const { x, y } = player
    ctx.drawImage(
      santaImage,
      x,
      y
    )
  }

  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)
