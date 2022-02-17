const { PLAY_AREA_H, PLAY_AREA_W, DIRECTION } = require('./constants');

function getRandomInt(max) {
  const x = Math.floor(Math.random() * max)
  return x;
}

const updatePlayerLocation = (player) => {
  // console.log(player);

  var dir = player.dir; 

  if (player.x + player.s == PLAY_AREA_W + 1) {
    player.x-=5;
    dir = getRandomInt(2) == 0 ? DIRECTION.Up : DIRECTION.Down;
  }

  if (player.x == -1) {
    player.x++;
    dir = getRandomInt(2) == 0 ? DIRECTION.Up : DIRECTION.Down;
  }

  if (player.y + player.s == PLAY_AREA_H + 1) {
    player.y--;
    dir = getRandomInt(2) == 0 ? DIRECTION.Left : DIRECTION.Right;
  }

  if (player.y < 0) {
    player.y++;
    dir = getRandomInt(2) == 0 ? DIRECTION.Left : DIRECTION.Right;
  }

  switch(dir) {
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