/* eslint-disable import/order */
const express = require('express');
const path = require('path');
const http = require('http');
const formatMessages = require('../chatroom/public/utils/messages');
const {
  userJoin,
  getUserJoin,
  userLeave,
  getRoomUsers,
} = require('../chatroom/public/utils/users');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

const bot = 'Le Chat Room bot';

io.on('connection', socket => {
  socket.on('join-room', ({ username, rooms }) => {
    const user = userJoin(socket.id, username, rooms);
    socket.join(user.rooms);
    socket.emit(
      'msgReceived',
      formatMessages(bot, `Welcome to Le Chat Room 🐈`)
    );

    io.to(user.rooms).emit('room-users', {
      room: user.rooms,
      users: getRoomUsers(user.rooms),
    });

    socket.broadcast
      .to(user.rooms)
      .emit(
        'msgReceived',
        formatMessages(bot, `${user.username} has joined the room 🚪`)
      );
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.rooms).emit(
        'msgReceived',
        formatMessages(bot, `${user.username} has left the room 🚪🚶`)
      );
    }

    io.to(user.rooms).emit('room-users', {
      room: user.rooms,
      users: getRoomUsers(user.rooms),
    });
  });

  socket.on('chatMessage', message => {
    const user = getUserJoin(socket.id);
    io.to(user.rooms).emit(
      'msgReceived',
      formatMessages(user.username, message)
    );
  });
});

app.use(express.static(path.join(__dirname, '/public')));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
