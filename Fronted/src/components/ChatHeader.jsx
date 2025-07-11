import { X } from "lucide-react";
import { UseAuthStore } from "../store/UseAuthStore";
import { UseChatStore } from "../store/UseChatStore";
import CallButton from "./CallButton";
import toast from "react-hot-toast";

export const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = UseChatStore();
  const { onlineUsers } = UseAuthStore();
  const {handleVideoCall} = UseChatStore();


  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers?.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <div className="flex items-center gap-2">
  <CallButton handleVideoCall={handleVideoCall} />
  <button onClick={() => setSelectedUser(null)}>
    <X />
  </button>
</div>
      </div>
    </div>
  );
};
// export default ChatHeader;