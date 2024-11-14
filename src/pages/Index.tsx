import { useEffect, useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { UserSelect } from "@/components/UserSelect";
import { Chat, Message, User } from "@/lib/types";
import { useMessagesStore } from "@/lib/store";
import { connectSocket, socket } from "@/lib/socket";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [showUserSelect, setShowUserSelect] = useState(false);
  const { toast } = useToast();
  const { messages, chats, currentUser, setCurrentUser, setChats, addMessage } = useMessagesStore();

  useEffect(() => {
    // Simulate user login - in a real app, this would come from your auth system
    const user: User = {
      id: Math.random().toString(36).substr(2, 9), // Generate random ID
      name: "User " + Math.floor(Math.random() * 1000),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      online: true,
    };
    setCurrentUser(user);
    connectSocket(user.id);

    socket.on("userList", (users: User[]) => {
      const availableChats = users
        .filter((u) => u.id !== user.id)
        .map((otherUser) => ({
          id: [user.id, otherUser.id].sort().join("-"),
          participants: [otherUser],
          unreadCount: 0,
        }));
      setChats(availableChats);
    });

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

    addMessage(message);
  };

  const handleNewChat = (otherUser: User) => {
    const chatId = [currentUser?.id, otherUser.id].sort().join("-");
    const existingChat = chats.find((c) => c.id === chatId);
    
    if (!existingChat) {
      const newChat: Chat = {
        id: chatId,
        participants: [otherUser],
        unreadCount: 0,
      };
      setChats([...chats, newChat]);
    }
    
    setSelectedChat(chatId);
    setShowUserSelect(false);
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
      {showUserSelect ? (
        <div className="flex-1">
          <UserSelect
            users={chats.map((chat) => chat.participants[0])}
            onSelectUser={handleNewChat}
          />
        </div>
      ) : currentChat ? (
        <ChatWindow
          chat={currentChat}
          messages={currentMessages}
          currentUser={currentUser!}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => setShowUserSelect(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start a new chat
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;