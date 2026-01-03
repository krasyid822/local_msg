const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Auto-resize textarea
input.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});

// Handle keyboard events
input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (input.value.trim()) {
      socket.emit('chat message', input.value);
      input.value = '';
      input.style.height = 'auto';
    }
  }
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit('chat message', input.value);
    input.value = '';
    input.style.height = 'auto';
  }
});

socket.on('chat message', function(msg) {
  const item = document.createElement('li');
  
  // Create message text span
  const messageText = document.createElement('span');
  messageText.textContent = msg;
  messageText.className = 'message-text';
  
  // Create copy button
  const copyBtn = document.createElement('button');
  copyBtn.textContent = 'Copy';
  copyBtn.className = 'copy-btn';
  copyBtn.onclick = function() {
    navigator.clipboard.writeText(msg).then(function() {
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      setTimeout(function() {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    }).catch(function() {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = msg;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      setTimeout(function() {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    });
  };
  
  item.appendChild(messageText);
  item.appendChild(copyBtn);
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});
