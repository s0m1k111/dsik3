import { getChatList } from "./api/channels.js";
import { getMessages, sendMessage } from "./api/messages.js";
import { renderChatList, renderMessages } from "./ui/chatUI.js";

document.addEventListener("DOMContentLoaded", () => {
  const inputArea = document.getElementById("inputArea");
  if (inputArea) inputArea.classList.add("hidden");
});

let currentChatId = null;
let chatList = [];

const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

async function openChat(chatId) {
  currentChatId = chatId;

  const data = await getMessages(chatId);

  if (data.error) {
    alert(data.error);
    return;
  }

  // Находим чат в списке
  const chat = chatList.find((c) => c.chatId === chatId);

  const partnerName = chat?.partner?.username || "Неизвестный";

  // Добавляем senderName к каждому сообщению
  data.messages.forEach((msg) => {
    msg.senderName = msg.senderId === chat.partner.id ? chat.partner.username : "Вы";
  });

  renderMessages(data.messages, partnerName);
}

async function init() {
  const data = await getChatList();

  if (data.error) {
    alert(data.error);
    return;
  }

  chatList = data.chats;

  renderChatList(chatList);

  chatList.forEach((chat) => {
    const element = document.querySelector(`[data-chat="${chat.chatId}"]`);
    if (element) {
      element.addEventListener("click", () => openChat(chat.chatId));
    }
  });
}

// Отправка по кнопке
sendBtn.addEventListener("click", () => {
  sendCurrentMessage();
});

// Отправка по Enter
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendCurrentMessage();
  }
});

// Функция отправки
async function sendCurrentMessage() {
  if (!currentChatId) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = "";

  // Мгновенно добавляем в UI
  addMessageToUI({
    senderName: "Вы",
    text,
  });

  // Отправляем на сервер
  const res = await sendMessage(currentChatId, text);

  if (res.error) {
    console.error("Ошибка отправки:", res.error);
    alert("Ошибка отправки сообщения");
    return;
  }
}

// Добавление сообщения в UI
function addMessageToUI(msg) {
  const msgBox = document.getElementById("messages");

  const div = document.createElement("div");
  div.className = `message ${msg.senderName === "Вы" ? "right" : "left"}`;

  div.innerHTML = `
    <strong>${msg.senderName}</strong>
    <p>${msg.text}</p>
  `;

  msgBox.appendChild(div);
  msgBox.scrollTop = msgBox.scrollHeight;
}

init();
