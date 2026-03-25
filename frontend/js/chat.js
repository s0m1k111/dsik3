import { getChatList } from "./api/channels.js";
import { getMessages, sendMessage } from "./api/messages.js";
import { renderChatList, renderMessages } from "./ui/chatUI.js";

let currentChatId = null;

async function openChat(chatId) {
  currentChatId = chatId;

  const data = await getMessages(chatId);

  if (data.error) {
    alert(data.error);
    return;
  }

  renderMessages(data.messages);
}

async function init() {
  const chats = await getChatList();

  if (chats.error) {
    alert(chats.error);
    return;
  }

  // Рендерим список чатов
  renderChatList(chats.chats);

  // Добавляем обработчики кликов
  chats.chats.forEach((chat) => {
    const element = document.querySelector(`[data-chat="${chat.chatId}"]`);
    if (element) {
      element.addEventListener("click", () => openChat(chat.chatId));
    }
  });
}

init();
