const { 
  DIRECTION, 
  PLAY_AREA_W, 
  PLAY_AREA_H 
} = require('./constants');
const { players } = require('./state');
const { removePlayer }  = require('./playerHandler');

const detectPlayerCollision = () => {
  var blocked = players.flatMap(p => p.hist);
  for (var player of players) {
    if (
      player.x + player.s > PLAY_AREA_W || 
      player.x < 0 ||
      player.y + player.s > PLAY_AREA_H ||
      player.y < 0
    ) {
      removePlayer(player)
    }

    // for (point of blocked) {
    //   if (player.x == point[0] && player.y == point[1] ||
    //     player.x + player.s == point[0] && player.y + player.s == point[1]
    //   ) {
    //     removePlayer(player);
    //   }
    // }
  }
}

const updatePlayerLocation = (player) => {
  player.hist.push([player.x, player.y]);

  switch(player.dir) {
    case DIRECTION.Up:
      player.y--;
      break;
    case DIRECTION.Right:
      player.x++;
      break;
    case DIRECTION.Down:
      player.y++;
      break;
    case DIRECTION.Left:
      player.x--;
      break;
    default:
      console.error("Invalid direction on player update.");
  }
}

module.exports = { updatePlayerLocation, detectPlayerCollision };