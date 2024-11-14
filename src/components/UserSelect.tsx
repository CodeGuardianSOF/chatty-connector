import { User } from "@/lib/types";
import { Avatar } from "./Avatar";

interface UserSelectProps {
  users: User[];
  onSelectUser: (user: User) => void;
}

export const UserSelect = ({ users, onSelectUser }: UserSelectProps) => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Select a user to chat with</h2>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Avatar src={user.avatar} alt={user.name} online={user.online} />
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-gray-500">
                {user.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};