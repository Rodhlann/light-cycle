const { COUNTDOWN } = require('./constants');

const state = {
  countdown: COUNTDOWN,
  started: false,
  players: [],
  sessions: [],
  io: {}
};

module.exports = state;