const players = [];

const newPlayer = (id, x, y, s, color) => {
  const player = {id, x, y, s, color};

  players.push(player);

  return player;
}

const playerExit = (id) => {
  const index = players.findIndex(player => player.id === id);
  if (index !== -1) {
    console.log(`Player ${id} has left.`)
    return players.splice(index, 1)[0];
  }
}

const getPlayer = (id) => {
  const index = players.findIndex(player => player.id === id);
  return players[index];
}

const getPlayers = () => {
  return players;
}

module.exports = {
  newPlayer,
  playerExit,
  getPlayer,
  getPlayers
};