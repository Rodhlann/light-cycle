const state = require('./state');
const { 
  PLAYER_TEMPLATE ,
  STARTING_STATES,
  COLORS
} = require('./constants');
const { players } = require('./state');

const newPlayer = (id) => {
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

const removePlayer = (player) => {
  var index = state.players.findIndex(p => p.id === player.id);
  var player = players.splice(index, 1)[0];
  if (player) {
    STARTING_STATES.push(player.start);
  }
}

const playerExit = (id) => {
    console.log(`Player ${id} has left.`)
    var player = state.players.filter(player => player.id === id)[0];
    if (player) { // TODO: If player refreshes / leaves after they lose they won't be in the list
      removePlayer(player);
    }
}

const getPlayer = (id) => {
  const index = state.players.findIndex(player => player.id === id);
  return state.players[index];
}

module.exports = {
  newPlayer,
  playerExit,
  removePlayer,
  getPlayer
};