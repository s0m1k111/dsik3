import { getChatList } from "./api/channels.js";
import { getMessages, sendMessage } from "./api/messages.js";
import { renderChatList, renderMessages } from "./ui/chatUI.js";

let currentChatId = null;
let chatList = [];

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

init();
