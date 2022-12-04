const tmx = require('tmx-parser')

module.exports = async () => {
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
      tileRow.push({ id: tile.id, gid: tile.gid })
    }
    map2D.push(tileRow)
  }

  return map2D
}