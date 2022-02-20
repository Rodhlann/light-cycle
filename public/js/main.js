// server connect
const socket = io();

socket.on('config', (config) => {

  if (!config) console.error("Unable to load config from server.");
  
  const Direction = config.DIRECTION;
  const CanvasW = config.PLAY_AREA_W;
  const CanvasH = config.PLAY_AREA_H;
  const TickRate = config.TICK_RATE;

  const canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var players = [];
  var player = {};
  var keys = Object.keys(Direction);
  var randomDir = keys[Math.floor(Math.random() * keys.length)];

  var lastDir = randomDir;
  var dir = lastDir;

  document.onkeydown = (e) => {
    const key = e.key.toLowerCase();
    if (key == 'w' && dir != Direction.Down && player.y != 0)
      dir = Direction.Up;
    if (key == 'd' && dir != Direction.Left && (player.x + player.s != CanvasW))
      dir = Direction.Right;
    if (key == 's' && dir != Direction.Up && (player.y + player.s != CanvasH))
      dir = Direction.Down;
    if (key == 'a' && dir != Direction.Right && player.x != 0)
      dir = Direction.Left;

    if (dir != lastDir) {
      socket.emit('update', dir);
      lastDir = dir;
    }
  }

  const draw = () => {
    ctx.clearRect(0, 0, CanvasW, CanvasH);
    for(var player of players) {
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.s, player.s);
    }
  }

  const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

  var session = socket.emit('join', { dir, color: randomColor() });

  socket.on('update_all', (serverPlayers) => {
    players = serverPlayers;
    player = players.filter(p => p.id == session.id)[0];
    var updatedDir = player && player.dir;
    dir = !!updatedDir ? updatedDir : dir;
  });

  /* game loop */
  const hrtimeMs = () => {
    let time = Date.now();
    return time[0] * 1000 + time[1] / 1000000;
  }

  const TICK_RATE = TickRate;
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
});
