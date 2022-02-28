const { updatePlayerLocation, detectPlayerCollision } = require('./movement');
const { TICK_RATE, DEBUG, COUNTDOWN } = require('./constants');
const state = require('./state');
const { addPlayer } = require('./playerHandler');

// Move to utility file
const handleCountdown = (callback) => {
  if (state.countdown >= 0) {
    setTimeout(() => {
      state.io.emit('countdown', state.countdown);
      state.countdown--;
      handleCountdown(callback);
    }, 1000);
  } else {
    state.countdown = COUNTDOWN;
    callback();
  }
}

// const gameOver = () => {
//   var gameOver = state.players.length == 0;
//   if (gameOver) {
//     state.started = false;
//     console.log("GAME OVER");
//     return gameOver;
//   }
// }

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
  // handle play start countdown
  if (state.players.length && state.started) {
    updatePlayerLocation();
    state.io.sockets.emit('update_all', state.players);
  
    calculateFps(previous);
    setTimeout(loop, tickLengthMs);

    previous = Date.now();
  } else if (state.players.length && !state.started) {
    handleCountdown(() => {
      state.started = true;
      setTimeout(loop, tickLengthMs);
    });
  } else if (!state.players.length && state.started) {
    console.log("GAME OVER");
    // TODO: create restart game function
    if (state.sessions.length) {
      var restartMsg = state.sessions.reduce((p, c) => p += `\n\t${c},`, 'New session with players: [');
      console.log(restartMsg + '\n]');
      state.sessions.forEach(s => addPlayer(s));
    }
    state.started = false;
    setTimeout(loop, tickLengthMs);
  } else if (!state.players.length && !state.started) {
    // console.log('Waiting for players');
    setTimeout(loop, tickLengthMs);
  }
}

module.exports = loop;