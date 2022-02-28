const { 
  PLAYER_TEMPLATE ,
  STARTING_STATES,
  COLORS
} = require('./constants');
const state = require('./state');

const addPlayer = (id) => {
  const startState = STARTING_STATES.splice(
    [Math.floor(Math.random()*STARTING_STATES.length)], 1)[0];
  const color = COLORS[Math.floor(Math.random()*COLORS.length)];

  const player = {
    id,
    dir: startState.dir,
    x: startState.x, 
    y: startState.y, 
    s: PLAYER_TEMPLATE.s, 
    start: startState,
    hist: [],
    color
  };

  state.players.push(player);

  return player;
}

const removePlayer = (playerToRemove) => {
  console.log(`Player ${playerToRemove.id} crashed!`);

  var index = state.players.findIndex(p => p.id === playerToRemove.id);
  var player = state.players.splice(index, 1)[0];
  if (player) {
    STARTING_STATES.push(player.start);
  }
}

const playerExit = (id) => {
  // TODO: improve player death / exit logic
  console.log(`Player ${id} has left.`)
  var player = state.players.filter(player => player.id === id)[0];
  var index = state.sessions.findIndex(p => p === id);
  state.sessions.splice(index, 1)[0];

  if (player) {
    removePlayer(player);
  }
}

const getPlayer = (id) => {
  const index = state.players.findIndex(player => player.id === id);
  return state.players[index];
}

module.exports = {
  addPlayer,
  playerExit,
  removePlayer,
  getPlayer
};