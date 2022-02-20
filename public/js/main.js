const Direction = {
  Up: 'Up',
  Down: 'Down',
  Left: 'Left',
  Right: 'Right'
};

const debug = document.getElementById('app-debug')
const canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var players = [];
var keys = Object.keys(Direction);
var randomDir = keys[Math.floor(Math.random() * keys.length)];

var lastDir = randomDir;
var dir = lastDir;

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

  if (dir != lastDir) {
    console.log(`outgoing: ${dir}`);
    socket.emit('update', dir);
    lastDir = dir;
  }
}

const draw = () => {
  ctx.clearRect(0, 0, 500, 500);
  for(var player of players) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.s, player.s);
  }
}

const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

// server connect
const socket = io();

var session = socket.emit('join', { dir, color: randomColor() });

socket.on('update_all', (serverPlayers) => {
  players = serverPlayers;
});

/* game loop */
const hrtimeMs = () => {
  let time = Date.now();
  return time[0] * 1000 + time[1] / 1000000;
}

const TICK_RATE = 30;
let tick = 0;
let previous = hrtimeMs();
let tickLengthMs = 1000 / TICK_RATE;

const loop = () => {
  setTimeout(loop, tickLengthMs);
  let now = hrtimeMs();
  
  draw();

  previous = now;
  tick++;
}

loop();

// if (DEBUG) {
//   const gameLoop = () => {

//     debug.innerHTML= `
//       <div>dir: ${dir}\n</div>
//       <div>server: ${players[0]}\n</div>
//     `;
//     window.requestAnimationFrame(gameLoop);
//   }
  
//   window.requestAnimationFrame(gameLoop);
// }

