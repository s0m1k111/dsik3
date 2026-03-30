export function renderChatList(chats) {
  const container = document.getElementById("chatList");
  container.innerHTML = "";

  chats.forEach((chat) => {
    const div = document.createElement("div");
    div.className = "chat-item";
    div.dataset.chat = chat.chatId;

    const name = chat.partner ? chat.partner.username : "Неизвестный";
    const last = chat.lastMessage ? chat.lastMessage.text : "Нет сообщений";

    div.innerHTML = `
      <strong>${name}</strong><br>
      <span>${last}</span>
    `;

    container.appendChild(div);
  });
}

export function renderMessages(messages, partnerName) {
  const container = document.getElementById("chatWindow");

  container.innerHTML = `
    <h2>${partnerName}</h2>
    <div id="messages"></div>
  `;

  const msgBox = document.getElementById("messages");

  messages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = "message";

    div.innerHTML = `
      <p><strong>${msg.senderName}</strong></p>
      <p>${msg.text}</p>
    `;

    msgBox.appendChild(div);
  });

  msgBox.scrollTop = msgBox.scrollHeight;
}
