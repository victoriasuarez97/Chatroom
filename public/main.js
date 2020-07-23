const socket = io();

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);
});

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

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
  const div = document.createElement('div');
  div.classList.add('messages-sent');
  div.innerHTML = `<small class="details">${message.username}<span> ${
    message.time
  }</span></small>
  <p class="sent">${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log(username, room);
