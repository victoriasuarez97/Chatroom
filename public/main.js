const socket = io();

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);
});

const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');

// Scroll
chatMessages.scroll = chatMessages.scrollHeight;

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

// Output message to DOM
function outputMessage(message) {
  const li = document.createElement('li');
  li.className = 'received';
  document.getElementById('msgSent');
  li.innerHTML = `<small class="details">${
    message.username
  }<span class="align-top"> ${message.time}</span></small>
  <p>${message.text}</p>`;
  document.getElementById('chat-messages').appendChild(li);
}

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log(username, room);
