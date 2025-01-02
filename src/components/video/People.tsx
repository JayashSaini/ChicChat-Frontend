import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Input from "@components/Input";
import { MdContentCopy } from "react-icons/md";
import { toast } from "sonner";
import { IoExitOutline } from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useAuth } from "@context/index";

const People: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [query, setQuery] = useState("");
  const { room, participants } = useSelector((state: RootState) => state.room);
  const { user } = useAuth();
  const { socket } = useSelector((state: RootState) => state.socket);

  useEffect(() => {
    if (user?._id.toString() === room?.admin.toString()) setIsAdmin(true);
    else setIsAdmin(false);
  }, [user, room]);

  function userKickHandler(userId: string) {
    if (isAdmin) {
      socket?.emit("admin:kick-user", { userId, roomId: room?.roomId });
    } else {
      toast.error("Only admin can kick users.");
    }
  }

  return (
    <motion.div
      className="w-[500px] max-h-[700px] bg-backgroundTertiary rounded-xl p-3"
      initial={{ opacity: 0, scale: 0.95 }} // Start with 0 opacity and slightly scaled down
      animate={{ opacity: isOpen ? 1 : 0, scale: 1 }} // Fade in with normal scale
      transition={{ duration: 0.3, ease: "easeInOut" }} // Smoother and quicker transition
      style={{ position: "relative" }}
    >
      <div className="w-full flex items-center justify-between px-1 my-2">
        <h3 className="text-textPrimary text-lg font-semibold">Invite</h3>
        <FiArrowRight
          className="text-xl text-textSecondary"
          role="button"
          title="Close"
          aria-label="Close"
          onClick={onClose}
        />
      </div>
      <div className="flex gap-2 items-center justify-start">
        <Input
          type="text"
          value={`https://chicchat.com/room/join=${room?.roomId}`}
          disabled
          className="w-[90%] text-sm"
        />
        <MdContentCopy
          role="button"
          className="w-[10%] text-xl text-textPrimary cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(
              `https://chicchat.com/room/join=${room?.roomId}`
            );
            toast.message("🔗 Link copied!");
          }}
        />
      </div>
      <div className="mb-3 mt-6">
        <Input
          type="text"
          value={query}
          placeholder="Search user"
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
        />
      </div>
      <div className="w-full h-full max-h-[490px]  overflow-y-auto custom-scrollbar space-y-2 rounded-md">
        {participants.length > 0 ? (
          [...participants]
            .filter(({ user }) =>
              // If there's a query, filter chats that contain the query in their metadata title
              query ? user.username.toLocaleLowerCase()?.includes(query) : true
            )
            .map(({ user }, idx) => (
              <div
                key={idx}
                className="w-full px-4 py-4 bg-backgroundVideo flex justify-between items-center rounded-md select-none"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={user.avatar.url}
                    alt={user.username}
                    className="rounded-full w-[35px] h-[35px]"
                  />
                  <p className="text-sm">{user.username}</p>
                </div>
                <IoExitOutline
                  onClick={() => userKickHandler(user?._id.toString())}
                  className="text-textPrimary text-xl cursor-pointer"
                />
              </div>
            ))
        ) : (
          <div className="h-full w-full flex items-center justify-center text-sm text-textPrimary">
            No Participants here.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default People;
