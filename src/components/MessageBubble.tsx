import { Message } from "@/lib/types";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwn?: boolean;
}

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div
      className={`flex ${
        isOwn ? "justify-end" : "justify-start"
      } mb-4 animate-message-in`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isOwn
            ? "bg-chat-sent text-gray-800"
            : "bg-chat-bubble text-gray-800"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs text-gray-500">
            {format(message.timestamp, "HH:mm")}
          </span>
          {isOwn && (
            <span className="text-gray-500">
              {message.status === "read" ? (
                <CheckCheck className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};