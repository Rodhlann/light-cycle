
const Direction = {
  Up: 'Up',
  Down: 'Down',
  Left: 'Left',
  Right: 'Right'
};

const canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var players = [];

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

const draw = () => {
  ctx.clearRect(0, 0, 500, 500);
  for(var player of players) {
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

const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);
// server connect
const socket = io();

socket.emit('join', { color: randomColor() });

socket.on('update', (serverPlayers) => {
  console.log(players);
  players = serverPlayers;
});
