import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { useAuth } from "@context/index";
import Typing from "@components/chat/Typing";
import MessageItem from "./MessageItem";
import { addRoomMessage } from "@redux/slice/room.slice";
import { toast } from "sonner";

const TYPING_EVENT = "user:typing";
const STOP_TYPING_EVENT = "user:stop-typing";

const ChatBox: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [selfTyping, setSelfTyping] = useState(false);

  const { socket } = useSelector((state: RootState) => state.socket);
  const { room, roomMessages, isParticipantTyping } = useSelector(
    (state: RootState) => state.room
  );
  const { user } = useAuth();
  const dispatch: AppDispatch = useDispatch();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Reference for auto-scrolling

  // Scroll to the bottom when roomMessages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [roomMessages]);

  const handleOnMessageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMessage(e.target.value);

    if (!socket) return;

    if (!selfTyping) {
      setSelfTyping(true);
      socket.emit(TYPING_EVENT, room?.roomId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const timerLength = 3000;
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(STOP_TYPING_EVENT, room?.roomId);
      setSelfTyping(false);
    }, timerLength);
  };

  const sendChatMessage = async () => {
    if (!socket) return;
    if (!message || message.length === 0) {
      toast.info("Please enter a message.");
      return;
    }

    socket.emit(STOP_TYPING_EVENT, room?.roomId);
    socket.emit("user:send-message", {
      roomId: room?.roomId,
      message: {
        username: user?.username || "",
        content: message,
        createdAt: new Date().toISOString(),
      },
    });

    dispatch(
      addRoomMessage({
        isOwnMessage: true,
        username: user?.username || "",
        content: message,
        createdAt: new Date().toISOString(),
      })
    );
    setMessage("");
  };

  useEffect(() => {
    if (!socket) return;
    return () => {
      socket.emit(STOP_TYPING_EVENT, room?.roomId);
    };
  }, [socket, room?.roomId]);

  return (
    <motion.div
      className="w-[500px] max-h-[700px] bg-backgroundTertiary rounded-xl p-3 "
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isOpen ? 1 : 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ position: "relative" }}
    >
      <div className="w-full flex items-center justify-between px-1 my-2">
        <h3 className="text-textPrimary text-lg font-semibold">Chat</h3>
        <FiArrowRight
          className="text-xl text-textSecondary"
          role="button"
          onClick={onClose}
        />
      </div>

      {/* Message List */}
      <div className="w-full h-[560px] custom-scrollbar overflow-auto my-2">
        {roomMessages && roomMessages.length > 0 ? (
          <div className="w-full h-auto space-y-2">
            {roomMessages?.map((message, idx) => (
              <MessageItem key={idx} message={message} />
            ))}
            {isParticipantTyping && <Typing />}
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-textSecondary text-sm">
            No messages yet.
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="w-full flex">
        <textarea
          placeholder="Send a message"
          value={message}
          onChange={handleOnMessageChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendChatMessage();
            }
          }}
          style={{
            whiteSpace: "pre-wrap",
            resize: "none",
          }}
          rows={1}
          className="block w-full rounded-md border border-border py-3 px-4 bg-transparent text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-[#ffc1079f]"
        />

        <button
          onClick={sendChatMessage}
          disabled={!message}
          className="p-4 rounded-full bg-backgroundTertiary cursor-pointer disabled:opacity-50"
        >
          <PaperAirplaneIcon className="w-6 h-6 text-textPrimary" />
        </button>
      </div>
    </motion.div>
  );
};

export default ChatBox;
