
const Direction = {
  Up: 'Up',
  Down: 'Down',
  Left: 'Left',
  Right: 'Right'
};

const canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var player = {
  color: 'red',
  x: 100,
  y: 100,
  s: 5
}

var allPlayers = [];

var dir = Direction.Up;

document.onkeydown = (e) => {
  const key = e.key.toLowerCase();
  if (key == 'w' && dir != Direction.Down)
      dir = Direction.Up;
  if (key == 'd' && dir != Direction.Left)
      dir = Direction.Right;
  if (key == 's' && dir != Direction.Up)
      dir = Direction.Down;
  if (key == 'a' && dir != Direction.Right)
      dir = Direction.Left;
}

function getRandomInt(max) {
  const x = Math.floor(Math.random() * max)
  return x;
}

// const update = () => {

//   if (player.x + player.s == 501) {
//     player.x--;
//     dir = getRandomInt(2) == 0 ? Direction.Up : Direction.Down;
//   }

//   if (player.x == -1) {
//     player.x++;
//     dir = getRandomInt(2) == 0 ? Direction.Up : Direction.Down;
//   }

//   if (player.y + player.s == 501) {
//     player.y--;
//     dir = getRandomInt(2) == 0 ? Direction.Left : Direction.Right;
//   }

//   if (player.y < 0) {
//     player.y++;
//     dir = getRandomInt(2) == 0 ? Direction.Left : Direction.Right;
//   }

//   switch(dir) {
//     case Direction.Up:
//       player.y--;
//       break;
//     case Direction.Right:
//       player.x++;
//       break;
//     case Direction.Down:
//       player.y++;
//       break;
//     case Direction.Left:
//       player.x--;
//       break;
//     default:
//       throw Error("Invalid direction on player update.");
//   }
// }

const draw = () => {
  ctx.clearRect(0, 0, 500, 500);
  for(var player of allPlayers) {
    console.log(player);
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.s, player.s);
  }
}

// game loop
const gameLoop = () => {
  // update();
  draw();
  socket.emit('update', { dir: dir });
  window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);

// server connect
const socket = io();

socket.emit('join', { color: player.color });

socket.on('update', (players) => {
  allPlayers = players;
})

// TODO: figure out how to remove player on exit ? 
window.onbeforeunload = () => {
  socket.emit('exit');
}

window.addEventListener('beforeunload', function (e) {
  socket.emit('exit');
});
