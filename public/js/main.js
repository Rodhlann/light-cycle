/* ---- DEBUG ---- */
const DEBUG = true;
var serverFps = '';
var playerColor = '';
var content = '';
var debugElement;

if (DEBUG) {
  var appMain = document.getElementsByClassName('app-main')[0];
  debugElement = document.createElement("div");
  debugElement.style = 'color: lime';
  appMain.appendChild(debugElement);
}

const drawDebugContent = () => {
  if (debugElement) debugElement.innerHTML = content;
}
const resetDebugContent = () => {
  content = '';
}
const addDebugContent = (...strings) => {
  for(var str of strings) {
    content += str;
  }
}

const fpsArray = [];
const calculateFps = (fps) => {
  if (DEBUG) {
    if (fpsArray.length <= 10) {
      fpsArray.push(fps);
    } else {
      fpsArray.splice(0, 1);
      fpsArray.push(fps);
    }
  
    var avgFps = fpsArray.reduce((partialSum, a) => partialSum + a, 0) / fpsArray.length;
  
    addDebugContent(`
      <div>Client FPS: ${parseInt(avgFps)}</div>
      <div>Server FPS: ${parseInt(serverFps)}</div>
      <div>Player Color:&nbsp<label style="background-color:${playerColor}; padding:0px 5px 0px 5px;"></label></div>
    `);
  }
}
/* ---- END DEBUG ---- */

// server connect
const socket = io();
const TICK_RATE = 60;

socket.on('config', (config) => {
  
  socket.on('debug', (fps) => {
    serverFps = fps;
  });

  if (!config) console.error("Unable to load config from server.");
  
  const Direction = config.DIRECTION;
  const CanvasW = config.PLAY_AREA_W;
  const CanvasH = config.PLAY_AREA_H;

  const canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var players = [];
  var player = {};

  var lastDir = undefined;
  var dir = lastDir;

  document.onkeydown = (e) => { // TODO: Fix issue where sometimes perpendicular input direction isn't respected immediately after start
    const key = e.key.toLowerCase();

    if (dir) {
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
  }

  const draw = () => {
    // TODO: If no players make game over / game start modal? 
    ctx.clearRect(0, 0, CanvasW, CanvasH);
    for(var player of players) {
      ctx.fillStyle = player.color;
      ctx.shadowColor = player.color;
      ctx.shadowBlur = 12;
      for (var point of player.hist) {
        ctx.fillRect(point[0], point[1], player.s, player.s);
      }
    }
    drawDebugContent();
  }

  var session = socket.emit('join');

  socket.on('update_all', (serverPlayers) => {
    players = serverPlayers;
    player = players.filter(p => p.id == session.id)[0];
    playerColor = player.color;
    var updatedDir = player && player.dir;
    dir = !!updatedDir ? updatedDir : dir;
  });

  /* game loop */
  let previous = Date.now();
  let tickLengthMs = 1000 / TICK_RATE;

  const loop = () => {    
    resetDebugContent();

    var delta  = (Date.now() - previous)/1000;
    calculateFps(1/delta);

    draw();

    setTimeout(loop, tickLengthMs);    

    previous = Date.now();
  }

  loop();
});

// NOTE: window.requestAnimationFrame(..) is apparently the "right" way to do
// a game loop in JS 
// const gameLoop = () => {

//   ... < logic > ...

//   window.requestAnimationFrame(gameLoop);
// }

// window.requestAnimationFrame(gameLoop);
