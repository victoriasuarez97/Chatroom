const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessages = require('../chatroom/utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

const usernames = {};
const bot = 'Le Chat Room bot';

io.on('connection', socket => {
  socket.on('new user', username => {
    usernames[socket.id] = username;
  });
  socket.emit('msgReceived', formatMessages(bot, `Welcome to Le Chat Room 🐈`));

  socket.broadcast.emit(
    'msgReceived',
    formatMessages(bot, `A user has joined the room 🚪`)
  );

  socket.on('disconnect', () => {
    io.emit(
      'msgReceived',
      formatMessages(bot, `A user has left the room 🚪🚶`)
    );
  });

  socket.on('chatMessage', message => {
    io.sockets.emit(
      'msgReceived',
      formatMessages(usernames[socket.id], message)
    );
  });
});

app.use(express.static(path.join(__dirname, 'public')));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
