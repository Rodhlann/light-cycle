const updatePlayerLocation = require('./movement');
const { TICK_RATE } = require('./constants');
const { getPlayers } = require('./playerHandler');
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

  const players = getPlayers();
  for (const player of players) {
    updatePlayerLocation(player);
  }
  if (players.length) {
    state.io.sockets.emit('update', players);
  }

  previous = now;
  tick++;
}

module.exports = loop;