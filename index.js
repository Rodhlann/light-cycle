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
  PLAY_AREA_W,
  PLAY_AREA_H,
  DIRECTION
} = require('./helper/constants');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
state.io = io;

// Set public directory
app.use(express.static(path.join(__dirname, 'public')));

// listen for new clients (sub)
io.on('connection', socket => {
  socket.emit('config', { PLAY_AREA_W, PLAY_AREA_H, DIRECTION });

  socket.on('join', () => {
    const player = newPlayer(socket.id);
    console.log(`New player: ${player.id}`);

    if (!state.started) {
      loop();
      state.started = true;
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