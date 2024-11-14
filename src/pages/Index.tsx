import { useEffect, useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { Chat, Message, User } from "@/lib/types";
import { useMessagesStore } from "@/lib/store";
import { connectSocket, socket } from "@/lib/socket";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedChat, setSelectedChat] = useState<string>("");
  const { toast } = useToast();
  const { messages, chats, currentUser, setCurrentUser, setChats } = useMessagesStore();

  useEffect(() => {
    // Simulate user login - in a real app, this would come from your auth system
    const user: User = {
      id: "1",
      name: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      online: true,
    };
    setCurrentUser(user);
    connectSocket(user.id);

    // Simulate fetching initial chats - in a real app, this would come from your API
    setChats([
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
    ]);

    if (!selectedChat && chats.length > 0) {
      setSelectedChat(chats[0].id);
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = (content: string) => {
    if (!currentUser || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      content,
      sender: currentUser,
      timestamp: new Date(),
      status: "sent",
      chatId: selectedChat,
    };

    socket.emit("message", {
      content,
      chatId: selectedChat,
      senderId: currentUser.id,
    });

    useMessagesStore.getState().addMessage(message);
  };

  const currentChat = chats.find((chat) => chat.id === selectedChat);
  const currentMessages = messages[selectedChat] || [];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ChatSidebar
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      {currentChat && (
        <ChatWindow
          chat={currentChat}
          messages={currentMessages}
          currentUser={currentUser!}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default Index;