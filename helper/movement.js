const Direction = {
  Up: 'Up',
  Down: 'Down',
  Left: 'Left',
  Right: 'Right'
};

function getRandomInt(max) {
  const x = Math.floor(Math.random() * max)
  return x;
}

const updatePlayerLocation = (player) => {

  var dir = player.dir; 

  if (player.x + player.s == 501) {
    player.x--;
    dir = getRandomInt(2) == 0 ? Direction.Up : Direction.Down;
  }

  if (player.x == -1) {
    player.x++;
    dir = getRandomInt(2) == 0 ? Direction.Up : Direction.Down;
  }

  if (player.y + player.s == 501) {
    player.y--;
    dir = getRandomInt(2) == 0 ? Direction.Left : Direction.Right;
  }

  if (player.y < 0) {
    player.y++;
    dir = getRandomInt(2) == 0 ? Direction.Left : Direction.Right;
  }

  switch(dir) {
    case Direction.Up:
      player.y--;
      break;
    case Direction.Right:
      player.x++;
      break;
    case Direction.Down:
      player.y++;
      break;
    case Direction.Left:
      player.x--;
      break;
    default:
      console.error("Invalid direction on player update.");
  }
}

module.exports = updatePlayerLocation;