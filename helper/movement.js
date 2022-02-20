const { PLAY_AREA_H, PLAY_AREA_W, DIRECTION } = require('./constants');

function getRandomInt(max) {
  const x = Math.floor(Math.random() * max)
  return x;
}

const updatePlayerLocation = (player) => {
  if (player.x + player.s == PLAY_AREA_W + 1) {
    player.x--;
    player.dir = getRandomInt(2) == 0 ? DIRECTION.Up : DIRECTION.Down;
  }

  if (player.x == -1) {
    player.x++;
    player.dir = getRandomInt(2) == 0 ? DIRECTION.Up : DIRECTION.Down;
  }

  if (player.y + player.s == PLAY_AREA_H + 1) {
    player.y--;
    player.dir = getRandomInt(2) == 0 ? DIRECTION.Left : DIRECTION.Right;
  }

  if (player.y == -1) {
    player.y++;
    player.dir = getRandomInt(2) == 0 ? DIRECTION.Left : DIRECTION.Right;
  }

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

module.exports = updatePlayerLocation;