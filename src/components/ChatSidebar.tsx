import { Chat } from "@/lib/types";
import { Avatar } from "./Avatar";
import { format } from "date-fns";

interface ChatSidebarProps {
  chats: Chat[];
  selectedChat?: string;
  onSelectChat: (chatId: string) => void;
}

export const ChatSidebar = ({
  chats,
  selectedChat,
  onSelectChat,
}: ChatSidebarProps) => {
  return (
    <div className="w-80 border-r bg-white/80 backdrop-blur-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-5rem)]">
        {chats.map((chat) => {
          const otherParticipant = chat.participants[0];
          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat === chat.id ? "bg-gray-50" : ""
              }`}
            >
              <Avatar
                src={otherParticipant.avatar}
                alt={otherParticipant.name}
                online={otherParticipant.online}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">
                    {otherParticipant.name}
                  </h3>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {format(chat.lastMessage.timestamp, "HH:mm")}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage.content}
                  </p>
                )}
              </div>
              {chat.unreadCount > 0 && (
                <span className="px-2 py-1 text-xs bg-gray-900 text-white rounded-full">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};