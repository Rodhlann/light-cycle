const { COUNTDOWN } = require('./constants');

const state = {
  countdown: COUNTDOWN,
  started: false,
  players: [],
  io: undefined
};

module.exports = state;