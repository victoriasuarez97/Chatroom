const socket = io();
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');

// Message from server
socket.on('msgReceived', message => {
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
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

// Output message to DOM
function outputMessage(message) {
  const li = document.createElement('li');
  li.id = 'msgReceived';
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
