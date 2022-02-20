const updatePlayerLocation = require('./movement');
const { TICK_RATE } = require('./constants');
const state = require('./state');

const hrtimeMs = () => {
  let time = process.hrtime();
  return time[0] * 1000 + time[1] / 1000000;
}

let tick = 0;
let previous = hrtimeMs();
let tickLengthMs = 1000 / TICK_RATE;

const loop = () => {
  setTimeout(loop, tickLengthMs);
  let now = hrtimeMs();

  const players = state.players;
  for (const player of players) {
    updatePlayerLocation(player);
  }
  if (players.length) {
    console.log(`outgoing: ${players[0].dir}`)
    state.io.sockets.emit('update_all', players);
  }

  previous = now;
  tick++;
}

module.exports = loop;