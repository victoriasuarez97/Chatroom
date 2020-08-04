const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessages = require('../chatroom/utils/messages');

const bot = 'Le Chat Room bot';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

// Run when client connects
io.on('connection', socket => {
  // Welcome current User
  socket.emit('msgReceived', formatMessages(bot, `Welcome to Le Chat Room 🐈`));

  // Broadcast when a user connects
  socket.broadcast.emit(
    'msgReceived',
    formatMessages(bot, `A user has joined the room 🚪`)
  );

  // Run when the client disconnects
  socket.on('disconnect', () => {
    io.emit(
      'msgReceived',
      formatMessages(bot, `A user has left the room 🚪🚶`)
    );
  });

  // Listen to chatMessage
  socket.on('chatMessage', message => {
    io.emit('msgReceived', formatMessages('USER', message));
  });
});

app.use(express.static(path.join(__dirname, 'public')));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
