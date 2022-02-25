const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const {
  playerExit,
  getPlayer,
  newPlayer,
} = require('./helper/playerHandler');
const loop = require('./helper/gameLoop');
const state  = require('./helper/state');
const {
  PLAY_AREA_SIZE,
  DIRECTION
} = require('./helper/constants');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
state.io = io;

// Set public directory
app.use(express.static(path.join(__dirname, 'public')));

// Move to utility file
var count = 2;
const countdown = (callback) => {
  if (count >= 0) {
    setTimeout(() => {
      console.log(count + 1);
      count--;
      countdown(callback);
    }, 1000);
  } else {
    count = 2;
    callback();
  }
}

// listen for new clients (sub)
io.on('connection', socket => {
  socket.emit('config', { PLAY_AREA_SIZE, DIRECTION });

  socket.on('join', () => {
    const player = newPlayer(socket.id);
    console.log(`New player: ${player.id}`);

    if (!state.started) {
      countdown(() => {
        loop();
        state.started = true;
      });
    }
  });

  socket.on('disconnect', () => {
    playerExit(socket.id);
  })

  socket.on('update', (dir) => {
    const player = getPlayer(socket.id);
    if (player) {
      player.dir = dir;
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));