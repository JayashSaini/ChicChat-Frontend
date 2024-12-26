import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "@components/Input";
import { MdContentCopy } from "react-icons/md";
import { toast } from "sonner";
import { IoExitOutline } from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";

const People: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const roomId = "111111111111";
  const participants = [
    {
      _id: "3434343434343",
      username: "Jayash",
      avatar: {
        url: "https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg",
        public_id: "111111111111",
      },
    },
    {
      _id: "3434343434543",
      username: "Aman",
      avatar: {
        url: "https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg",
        public_id: "111111111111",
      },
    },
    {
      _id: "3434342323343",
      username: "Tushar",
      avatar: {
        url: "https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg",
        public_id: "111111111111",
      },
    },
    {
      _id: "3434343434343",
      username: "Vijay",
      avatar: {
        url: "https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg",
        public_id: "111111111111",
      },
    },
  ];

  return (
    <motion.div
      className="w-[500px] max-h-[750px] bg-backgroundTertiary rounded-xl p-3"
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
          value={`https://chicchat.com/room/join=${roomId}`}
          disabled
          className="w-[90%] text-sm"
        />
        <MdContentCopy
          role="button"
          className="w-[10%] text-xl text-textPrimary cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(
              `https://chicchat.com/room/join=${roomId}`
            );
            toast.message("🔗 Link copied!", {
              position: "top-center",
              duration: 1000,
            });
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
      <div className="w-full max-h-[540px]  overflow-y-auto custom-scrollbar space-y-2 rounded-md">
        {[...participants]
          .filter((user) =>
            // If there's a query, filter chats that contain the query in their metadata title
            query ? user.username.toLocaleLowerCase()?.includes(query) : true
          )
          .map((p, idx) => (
            <div
              key={idx}
              className="w-full px-4 py-4 bg-backgroundVideo flex justify-between items-center rounded-md select-none"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={p.avatar.url}
                  alt={p.username}
                  className="rounded-full w-[35px] h-[35px]"
                />
                <p className="text-sm">{p.username}</p>
              </div>
              <IoExitOutline className="text-textPrimary text-xl cursor-pointer" />
            </div>
          ))}
      </div>
    </motion.div>
  );
};

export default People;
