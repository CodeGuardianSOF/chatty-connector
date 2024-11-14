import { create } from 'zustand';
import { Message, Chat, User } from './types';
import { socket } from './socket';

interface MessagesStore {
  messages: Record<string, Message[]>;
  chats: Chat[];
  currentUser: User | null;
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setChats: (chats: Chat[]) => void;
  setCurrentUser: (user: User) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
}

export const useMessagesStore = create<MessagesStore>((set) => ({
  messages: {},
  chats: [],
  currentUser: null,
  setMessages: (chatId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: messages },
    })),
  addMessage: (message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [message.chatId]: [...(state.messages[message.chatId] || []), message],
      },
    })),
  setChats: (chats) => set({ chats }),
  setCurrentUser: (user) => set({ currentUser: user }),
  updateMessageStatus: (messageId, status) =>
    set((state) => {
      const newMessages = { ...state.messages };
      Object.keys(newMessages).forEach((chatId) => {
        newMessages[chatId] = newMessages[chatId].map((msg) =>
          msg.id === messageId ? { ...msg, status } : msg
        );
      });
      return { messages: newMessages };
    }),
}));

// Socket event listeners
socket.on("message", (message: Message) => {
  useMessagesStore.getState().addMessage(message);
});

socket.on("messageStatus", ({ messageId, status }: { messageId: string; status: Message['status'] }) => {
  useMessagesStore.getState().updateMessageStatus(messageId, status);
});