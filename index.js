const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const {
  playerExit,
  getPlayer,
  addPlayer,
} = require('./helper/playerHandler');
const loop = require('./helper/gameLoop');
const state = require('./helper/state');
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

// listen for new clients (sub)
io.on('connection', socket => {
  // Client connection init

  // Configure client 
  socket.emit('config', { PLAY_AREA_SIZE, DIRECTION });
  
  state.sessions.push(socket.id);
  socket.on('join', () => {
    console.log(`New player: ${socket.id}`);
    if (!state.started) {
      addPlayer(socket.id);
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

// Eagerly start loop when server starts
// TODO: lazily start loop
loop();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));