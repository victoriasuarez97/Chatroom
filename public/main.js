/* eslint-disable no-use-before-define */
const socket = io();
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const userList = document.getElementById('users');
const roomName = document.getElementById('room-name');

const { username, rooms } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join room
socket.emit('join-room', { username, rooms });

// Get room and users
socket.on('room-users', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('msgReceived', message => {
  outputMessage(message);

  const shouldScroll =
    chatMessages.scrollTop + chatMessages.clientHeight ===
    chatMessages.scrollHeight;

  if (!shouldScroll) {
    scrollToBottom();
  }
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message
  const message = e.target.elements.message.value;

  // Emit message to server
  socket.emit('chatMessage', message);

  // Clear input
  e.target.elements.message.value = ``;
  e.target.elements.message.focus();
});

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Output message to DOM
function outputMessage(message) {
  const li = document.createElement('li');
  li.id = 'msgReceived';
  li.innerHTML = `<small>
  ${message.username}<span class="align-top"> ${message.time}</span></small>
  <p>${message.text}</p>`;
  document.getElementById('chat-messages').appendChild(li);
}

function createRoomLogo(ownerName) {
  const roomLogo = document.createElement('span');
  roomLogo.id = 'room-icon';
  roomLogo.innerHTML = `<img src="./utils/img/${ownerName}.svg" width="40px">`;
  document.getElementById('room-list').appendChild(roomLogo);
}

// Output room name and icon to DOM
function outputRoomName(room) {
  roomName.innerText = room;

  switch (room) {
    case 'Bernardo':
      createRoomLogo('bernardo');
      break;
    case 'Marcelo':
      createRoomLogo('marcelo');
      break;
    case 'Luna':
      createRoomLogo('luna');
      break;
    default:
      createRoomLogo('luna');
  }
}

// Output users added to list to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
