const { updatePlayerLocation, detectPlayerCollision } = require('./movement');
const { TICK_RATE, DEBUG } = require('./constants');
const state = require('./state');

const fpsArray = [];
// TODO: figure out why FPS is locked around 30
const calculateFps = (previous) => {
  if (DEBUG) {
    var delta = (Date.now() - previous)/1000;
    var fps = 1/delta; 
  
    if (fpsArray.length <= 10) {
      fpsArray.push(fps);
    } else {
      fpsArray.splice(0, 1);
      fpsArray.push(fps);
    }
  
    var avgFps = fpsArray.reduce((partialSum, a) => partialSum + a, 0) / fpsArray.length;
  
    console.log('FPS: ' + parseInt(avgFps));
  }
}

let tick = 0;
let previous = Date.now();
let tickLengthMs = 1000 / TICK_RATE;

const loop = () => {
  setTimeout(loop, tickLengthMs);

  const players = state.players;
  for (const player of players) {
    detectPlayerCollision();
    updatePlayerLocation(player);
  }
  if (players.length) {
    state.io.sockets.emit('update_all', players);
  }

  calculateFps(previous);

  previous = Date.now();
  tick++;
}

module.exports = loop;