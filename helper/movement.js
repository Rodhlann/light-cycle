const { 
  DIRECTION, 
  PLAY_AREA_SIZE 
} = require('./constants');
const state = require('./state');
const { removePlayer }  = require('./playerHandler');

const detectPlayerCollision = (player) => {
  var blacklist = state.players.flatMap(p => p.hist);
  // TODO: should only have to calculate this once per game
  const enemies = state.players.filter(p => p != player);

  // Check for wall collision
  if (
    player.x + player.s > PLAY_AREA_SIZE || 
    player.x < 0 ||
    player.y + player.s > PLAY_AREA_SIZE ||
    player.y < 0
  ) {
    removePlayer(player)
  }

  // Check for actively interesting players (history not yet recorded)
  var intersectingPlayers = enemies.filter(p => player.x == p.x && player.y == p.y);
  if (intersectingPlayers.length) {
    removePlayer(player);
    intersectingPlayers.forEach(removePlayer);
  }

  // Check if intersecting previously crossed location
  for (point of blacklist) {
    if (
      player.x < point[0] + player.s &&
      player.x + player.s > point[0] &&
      player.y < point[1] + player.s &&
      player.y + player.s > point[1]
    ) {
      removePlayer(player);
    }
  }
}

const updatePlayerLocation = () => {
  for (player of state.players) {

    detectPlayerCollision(player);

    player.hist.push([player.x, player.y]);

    switch(player.dir) {
      case DIRECTION.Up:
        player.y-=player.s;
        break;
      case DIRECTION.Right:
        player.x+=player.s;
        break;
      case DIRECTION.Down:
        player.y+=player.s;
        break;
      case DIRECTION.Left:
        player.x-=player.s;
        break;
      default:
        console.error("[ERROR] Invalid direction on player update.");
    }
  }
}

module.exports = { updatePlayerLocation, detectPlayerCollision };