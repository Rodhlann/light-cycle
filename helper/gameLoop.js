const { updatePlayerLocation, detectPlayerCollision } = require('./movement');
const { TICK_RATE, DEBUG, COUNTDOWN } = require('./constants');
const state = require('./state');

// Move to utility file
const countdown = (callback) => {
  if (state.countdown >= 0) {
    setTimeout(() => {
      console.log(state.countdown);
      state.io.emit('countdown', state.countdown);
      state.countdown--;
      countdown(callback);
    }, 1000);
  } else {
    state.countdown = COUNTDOWN;
    callback();
  }
}

const gameOver = () => {
  var gameOver = state.players.length == 0;
  if (gameOver) {
    state.started = false;
    console.log("GAME OVER");
    return gameOver;
  }
}

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
    
    state.io.emit('debug', avgFps);
  }
}

let previous = Date.now();
let tickLengthMs = 500 / TICK_RATE;

const loop = () => {
  const players = state.players;
  detectPlayerCollision();
  for (const player of players) {
    updatePlayerLocation(player);
  }

  state.io.sockets.emit('update_all', players);

  calculateFps(previous);

  if (gameOver()) return;
  setTimeout(loop, tickLengthMs);

  previous = Date.now();
}

module.exports = { countdown, loop };