import { useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { Chat, Message, User } from "@/lib/types";

// Mock data
const currentUser: User = {
  id: "1",
  name: "You",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
};

const mockChats: Chat[] = [
  {
    id: "1",
    participants: [
      {
        id: "2",
        name: "Alice Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
        online: true,
      },
    ],
    unreadCount: 2,
  },
  {
    id: "2",
    participants: [
      {
        id: "3",
        name: "Bob Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
        online: false,
      },
    ],
    unreadCount: 0,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hey there! How are you?",
    sender: mockChats[0].participants[0],
    timestamp: new Date(Date.now() - 3600000),
    status: "read",
  },
  {
    id: "2",
    content: "I'm good, thanks! How about you?",
    sender: currentUser,
    timestamp: new Date(Date.now() - 3000000),
    status: "read",
  },
  {
    id: "3",
    content: "Just working on some new features. It's going great!",
    sender: mockChats[0].participants[0],
    timestamp: new Date(Date.now() - 2400000),
    status: "read",
  },
];

const Index = () => {
  const [selectedChat, setSelectedChat] = useState<string>(mockChats[0].id);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: currentUser,
      timestamp: new Date(),
      status: "sent",
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ChatSidebar
        chats={mockChats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      <ChatWindow
        chat={mockChats.find((chat) => chat.id === selectedChat)!}
        messages={messages}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Index;