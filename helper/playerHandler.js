const state = require('./state');
const { PLAYER_TEMPLATE } = require('./constants');

const newPlayer = (id, dir, color) => {
  const player = {
    id,
    dir,
    x: PLAYER_TEMPLATE.x, 
    y: PLAYER_TEMPLATE.y, 
    s: PLAYER_TEMPLATE.s, 
    color};

  state.players.push(player);

  return player;
}

const playerExit = (id) => {
  const index = state.players.findIndex(player => player.id === id);
  if (index !== -1) {
    console.log(`Player ${id} has left.`)
    return state.players.splice(index, 1)[0];
  }
}

const getPlayer = (id) => {
  const index = state.players.findIndex(player => player.id === id);
  return state.players[index];
}

module.exports = {
  newPlayer,
  playerExit,
  getPlayer
};