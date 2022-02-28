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

// Receive configuration data from server
socket.on('config', (config) => {
  
  socket.on('debug', (fps) => {
    serverFps = fps;
  });

  if (!config) console.error("[ERROR] Unable to load config from server.");
  
  const Direction = config.DIRECTION;
  const CanvasSize = config.PLAY_AREA_SIZE;

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
      if (key == 'd' && dir != Direction.Left && (player.x + player.s != CanvasSize))
        dir = Direction.Right;
      if (key == 's' && dir != Direction.Up && (player.y + player.s != CanvasSize))
        dir = Direction.Down;
      if (key == 'a' && dir != Direction.Right && player.x != 0)
        dir = Direction.Left;

      if (dir != lastDir) {
        // console.log('client dir: ' + dir);
        socket.emit('update', dir);
        lastDir = dir;
      }
    }
  }

  socket.on('countdown', serverCountdown => countdown = serverCountdown);

  var countdown = undefined;
  const drawCountdown = () => {
    ctx.clearRect(0, 0, CanvasSize, CanvasSize);
    
    drawGrid();

    ctx.fillStyle = 'orange';
    ctx.shadowColor = 'orange';
    ctx.shadowBlur = 10;

    ctx.font = 'bold 50px courier new';
    ctx.fillText(countdown, 235, 260);
  }

  const drawGrid = () => {
    // every x pixels fill a pixel
    ctx.fillStyle = '#22373b';
    ctx.shadowColor = '#22373b';
    ctx.shadowBlur = 10;

    for (var i = 0; i < CanvasSize; i+=50) {
      ctx.fillRect(0, i, CanvasSize, 1);
      ctx.fillRect(i, 0, 1, CanvasSize);
    }
  }

  const draw = () => {
    ctx.clearRect(0, 0, CanvasSize, CanvasSize);

    drawGrid();

    // TODO: If no players make game over / game start modal?
    var historyCount = 0;
    for(var p of players) {
      if (p == player) {
        ctx.fillStyle = playerColor;
        ctx.shadowColor = playerColor;
      } else {
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
      }

      ctx.shadowBlur = 12;

      // TODO: Think there's a slowdown here...
      for (var point of p.hist) {
        ctx.fillRect(point[0], point[1], p.s, p.s);
      }
      historyCount += p.hist.length;

      ctx.fillRect(p.x, p.y, p.s, p.s);
    }

    addDebugContent(`<div>History Count: ${parseInt(historyCount)}</div>`)
    addDebugContent(`<div>Player Count: ${parseInt(players.length)}</div>`);

    drawDebugContent();
  }

  var session = socket.emit('join');

  socket.on('update_all', (serverPlayers) => {
    players = serverPlayers;
    player = players.filter(p => p.id == session.id)[0] || {};
    playerColor = '#93EBFC';
    dir = !!player.dir ? player.dir : dir;
  });

  /* game loop */
  let previous = Date.now();
  let tickLengthMs = 1000 / TICK_RATE;

  const loop = () => {    
    resetDebugContent();

    var delta  = (Date.now() - previous)/1000;
    calculateFps(1/delta);

    if (countdown > 0) {
      drawCountdown();
    } else {
      draw();
    }

    var now = Date.now();
    previous = now;
    setTimeout(loop, tickLengthMs);    
  }

  loop();
});

// NOTE: window.requestAnimationFrame(..) is the "right" way to do
// a game loop in JS 
// const gameLoop = () => {

//   ... < logic > ...

//   window.requestAnimationFrame(gameLoop);
// }

// window.requestAnimationFrame(gameLoop);
