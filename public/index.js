const socket = io(`ws://localhost:1337`)

socket.on('connect', () => {
  console.log('connected')
})
