const ws = new WebSocket('ws://localhost:8080');
const container = document.querySelector('.container');


ws.onmessage = function(event) {
  const message = event.data;
  container.innerHTML += `<p>${message}</p>`;
};

document.getElementById('messageForm').onsubmit = function(event) {
  event.preventDefault();
  const message = document.getElementById('messageInput').value;
  ws.send(message);
  document.getElementById('messageInput').value = ''; // Clear input
};









































