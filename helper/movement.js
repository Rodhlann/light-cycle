const { 
  DIRECTION, 
  PLAY_AREA_SIZE 
} = require('./constants');
const state = require('./state');
const { removePlayer }  = require('./playerHandler');

const detectPlayerCollision = (player) => {
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
  // TODO: should only have to calculate this once per game
  const enemies = state.players.filter(p => p != player);
  var intersectingPlayers = enemies.filter(p => player.x == p.x && player.y == p.y);
  if (intersectingPlayers.length) {
    removePlayer(player);
    intersectingPlayers.forEach(removePlayer);
  }

  // Check if intersecting previously crossed location
  var blacklist = state.players.flatMap(p => {
    const rects = [];
    for (var i = 0; i < p.hist.length; i++) {
      var start = p.hist[i];
      var end = p.hist[i + 1] || [];

      // // Avoid calculating collision on start rect;
      // if (!end) {
      //   if (p.dir == DIRECTION.Up) {
      //     end = [p.x, p.y];
      //   } else if (p.dir == DIRECTION.Right) {
      //     end = [p.x + p.s, p.y];
      //   } else if (p.dir == DIRECTION.Down) {
      //     end = [p.x, p.y + p.s];
      //   } else if (p.dir == DIRECTION.Left) {
      //     end = [p.x - p.s, p.y];
      //   }
      // }

      // TODO: clean this up? 
      var w = end[0] > start[0] ? 
        (end[0] - start[0]) + p.s || p.s : 
        end[0] - start[0] || p.s;
      var h = end[1] > start[1] ? 
        (end[1] - start[1]) + p.s || p.s : 
        end[1] - start[1] || p.s;

      rects.push([start[0], start[1], w, h]);
    }
    return rects;
  });
  
  // TODO: issue with negative numbers ? 
  for (point of blacklist) {
    if (
      player.x < point[0] + point[2] &&
      player.x + player.s > point[0] &&
      player.y < point[1] + point[3] &&
      player.y + player.s > point[1]
    ) {
      removePlayer(player);
    }
  }
}

const updatePlayerLocation = () => {
  for (player of state.players) {

    detectPlayerCollision(player);

    var lastLocation = player.hist[player.hist.length - 1];
    if (lastLocation) {
      if ((lastLocation[0] == player.x && (player.dir == DIRECTION.Left || player.dir == DIRECTION.Right)) ||
      (lastLocation[1] == player.y && (player.dir == DIRECTION.Up || player.dir == DIRECTION.Down))) {
        player.hist.push([player.x, player.y]);
      }
    } else {
      player.hist.push([player.x, player.y]);
    }

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