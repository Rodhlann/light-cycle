const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const {
  playerExit,
  getPlayer,
  getPlayers,
  newPlayer,
} = require('./helper/playerHandler');
const updatePlayerLocation = require('./helper/movement');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set public directory
app.use(express.static(path.join(__dirname, 'public')));

// listen for new clients (sub)
io.on('connection', socket => {
  socket.on('join', ({ color }) => {
    const player = newPlayer(socket.id, 100, 100, 5, 5, color);
    console.log(`New player: ${player.id}`);
  });

  socket.on('exit', () => {
    playerExit(socket.id);
  })

  socket.on('update', ({ dir }) => {
    const player = getPlayer(socket.id);
    if (player) {
      player.dir = dir;
    }
  });

  const hrtimeMs = () => {
    let time = process.hrtime()
    return time[0] * 1000 + time[1] / 1000000
  }

  const TICK_RATE = 60
  let tick = 0
  let previous = hrtimeMs()
  let tickLengthMs = 1000 / TICK_RATE

  const loop = () => {
      setTimeout(loop, tickLengthMs)
      let now = hrtimeMs()

      const players = getPlayers();
      for (const player of players) {
        updatePlayerLocation(player);
      }
      if (players.length) {
        socket.emit('update', players);
      }

      previous = now
      tick++
  }

  loop();
});

// update client location (pub)

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));