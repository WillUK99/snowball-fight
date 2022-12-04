const socket = io(`ws://localhost:1337`)

socket.on('connect', () => {
  console.log('connected')
})

socket.on('2D Map', (mapData) => {
  console.log('***', mapData)
})
