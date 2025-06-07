const socket = io();
let username = "";

// Listen for the initial data (chat history and username)
socket.on("receive-messages", (data) => {
  if (data.username) username = data.username;
  const messages = data.chatHistory || [];
  renderMessages(messages);
});

// Handle form submission
document.querySelector(".chat").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("message");
  const msg = input.value.trim();
  if (msg !== "") {
    socket.emit("post-message", { message: msg });
    input.value = "";
  }
});

// Render messages with username and avatar
function renderMessages(messages) {
  const messagesList = document.getElementById("messages");
  messagesList.innerHTML = "";
  messages.forEach((msg) => {
    const isMe = msg.username === username;
    const bubbleAlign = isMe ? "justify-end" : "justify-start";
    const bubbleColor = isMe
      ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white"
      : "bg-gray-700 text-white";
    const avatarBg = isMe
      ? "bg-gradient-to-r from-blue-500 to-pink-500"
      : "chat-avatar";
    const initials = msg.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const messageDiv = document.createElement("div");
    messageDiv.className = `flex ${bubbleAlign} items-end space-x-3 mb-2`;

    // Avatar and username
    const avatarDiv = document.createElement("div");
    avatarDiv.className = `${avatarBg} w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md`;
    avatarDiv.textContent = initials;

    const contentDiv = document.createElement("div");
    contentDiv.className = `flex flex-col max-w-xs`;

    const nameDiv = document.createElement("span");
    nameDiv.className = "text-xs font-semibold mb-1 ml-1";
    nameDiv.textContent = msg.username;

    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = `chat-bubble px-4 py-2 rounded-2xl rounded-bl-none shadow-md ${bubbleColor}`;
    bubbleDiv.textContent = msg.message;

    contentDiv.appendChild(nameDiv);
    contentDiv.appendChild(bubbleDiv);

    if (isMe) {
      messageDiv.appendChild(contentDiv);
      messageDiv.appendChild(avatarDiv);
    } else {
      messageDiv.appendChild(avatarDiv);
      messageDiv.appendChild(contentDiv);
    }

    messagesList.appendChild(messageDiv);
  });

  messagesList.scrollTop = messagesList.scrollHeight;
}
