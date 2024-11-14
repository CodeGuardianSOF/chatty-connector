export interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
  lastSeen?: Date;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}