import { Chat, Message, User } from "@/lib/types";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { Avatar } from "./Avatar";

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  currentUser: User;
  onSendMessage: (message: string) => void;
}

export const ChatWindow = ({
  chat,
  messages,
  currentUser,
  onSendMessage,
}: ChatWindowProps) => {
  const otherParticipant = chat.participants[0];

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="p-4 border-b bg-white/80 backdrop-blur-sm flex items-center gap-3">
        <Avatar
          src={otherParticipant.avatar}
          alt={otherParticipant.name}
          online={otherParticipant.online}
        />
        <div>
          <h2 className="font-semibold">{otherParticipant.name}</h2>
          <p className="text-sm text-gray-500">
            {otherParticipant.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.sender.id === currentUser.id}
          />
        ))}
      </div>
      <MessageInput onSend={onSendMessage} />
    </div>
  );
};