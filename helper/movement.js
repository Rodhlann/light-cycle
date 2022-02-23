const { DIRECTION } = require('./constants');
const { players } = require('./state');
const { removePlayer }  = require('./playerHandler');

const detectPlayerCollision = () => {
  // if (player.x + player.s == PLAY_AREA_W + 1) {
  //   player.x--;
  //   player.dir = getRandomInt(2) == 0 ? DIRECTION.Up : DIRECTION.Down;
  // }

  // if (player.x == -1) {
  //   player.x++;
  //   player.dir = getRandomInt(2) == 0 ? DIRECTION.Up : DIRECTION.Down;
  // }

  // if (player.y + player.s == PLAY_AREA_H + 1) {
  //   player.y--;
  //   player.dir = getRandomInt(2) == 0 ? DIRECTION.Left : DIRECTION.Right;
  // }

  // if (player.y == -1) {
  //   player.y++;
  //   player.dir = getRandomInt(2) == 0 ? DIRECTION.Left : DIRECTION.Right;
  // }

  var blocked = players.flatMap(p => p.hist);
  for (var player of players) {
    for (point of blocked) {
      if (player.x == point[0] && player.y == point[1] ||
        player.x + player.s == point[0] && player.y + player.s == point[1]
      ) {
        removePlayer(player);
      }
    }
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