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

const app = express();
const server = http.createServer(app);
const io = socketio(server);
state.io = io;

// Set public directory
app.use(express.static(path.join(__dirname, 'public')));

// listen for new clients (sub)
io.on('connection', socket => {
  socket.on('join', ({ color }) => {
    const player = newPlayer(socket.id, color);
    console.log(`New player: ${player.id}`);
  });

  socket.on('disconnect', () => {
    playerExit(socket.id);
  })

  socket.on('update', ({ dir }) => {
    const player = getPlayer(socket.id);
    if (player) {
      player.dir = dir;
    }
  });

  if (!state.started) {
    loop();
    state.started = true;
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));