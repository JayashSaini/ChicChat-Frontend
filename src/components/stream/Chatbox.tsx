import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useSocket } from "@context/SocketContext";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";

const ChatBox: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [sendMessageLoading, setSendMessageLoading] = useState(false);

  const { socket } = useSocket();

  const handleOnMessageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Update the message state with the current input value
    setMessage(e.target.value);

    // // If socket doesn't exist or isn't connected, exit the function
    // if (!socket || !isConnected) return;

    // // Check if the user isn't already set as typing
    // if (!selfTyping) {
    //   // Set the user as typing
    //   setSelfTyping(true);

    //   // Emit a typing event to the server for the current chat
    //   socket.emit(TYPING_EVENT, currentChat.current?._id);
    // }

    // // Clear the previous timeout (if exists) to avoid multiple setTimeouts from running
    // if (typingTimeoutRef.current) {
    //   clearTimeout(typingTimeoutRef.current);
    // }

    // // Define a length of time (in milliseconds) for the typing timeout
    // const timerLength = 3000;

    // // Set a timeout to stop the typing indication after the timerLength has passed
    // typingTimeoutRef.current = setTimeout(() => {
    //   // Emit a stop typing event to the server for the current chat
    //   socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);

    //   // Reset the user's typing state
    //   setSelfTyping(false);
    // }, timerLength);
  };

  // Function to send a chat message
  const sendChatMessage = async () => {
    // If no current chat ID exists or there's no socket connection, exit the function
    // if (!currentChat.current?._id || !socket) return;
    // // Emit a STOP_TYPING_EVENT to inform other users/participants that typing has stopped
    // socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);
    // if (attachedFiles.length > 5) {
    //   setMessageHandler(""); // Clear the message input
    //   setAttachedFiles([]); // Clear the list of attached files
    //   return toast.error("Maximum attachment limit exceeded");
    // }
    // // Use the requestHandler to send the message and handle potential response or error
    // await requestHandler(
    //   // Try to send the chat message with the given message and attached files
    //   async () =>
    //     await sendMessage(
    //       currentChat.current?._id || "", // Chat ID or empty string if not available
    //       message, // Actual text message
    //       attachedFiles // Any attached files
    //     ),
    //   setSendMessageLoading,
    //   // On successful message sending, clear the message input and attached files, then update the UI
    //   (res) => {
    //     setMessageHandler(""); // Clear the message input
    //     setAttachedFiles([]); // Clear the list of attached files
    //     setMessagesHandler([res.data, ...messages]); // Update messages in the UI
    //     updateChatLastMessage(currentChat.current?._id || "", res.data); // Update the last message in the chat
    //   },
    //   // If there's an error during the message sending process, raise an alert
    //   alert
    // );
  };

  return (
    <motion.div
      className="w-[500px] max-h-[750px] bg-backgroundTertiary rounded-xl p-3"
      initial={{ opacity: 0, scale: 0.95 }} // Start with 0 opacity and slightly scaled down
      animate={{ opacity: isOpen ? 1 : 0, scale: 1 }} // Fade in with normal scale
      transition={{ duration: 0.3, ease: "easeInOut" }} // Smoother and quicker transition
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
      <div className="w-full h-[610px] custom-scrollbar overflow-auto my-2">
        {!(messages.length > 0) && (
          <div className="w-full h-full flex items-center justify-center text-textSecondary text-sm">
            No messages yet.
          </div>
        )}
      </div>
      <div className="w-full flex">
        <textarea
          placeholder="Send a message"
          value={message}
          onChange={handleOnMessageChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent default new line on Enter key
              //   s();
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
          disabled={!message || sendMessageLoading}
          className="p-4 rounded-full bg-backgroundTertiary cursor-pointer disabled:opacity-50"
        >
          <PaperAirplaneIcon className="w-6 h-6 text-textPrimary" />
        </button>
      </div>
    </motion.div>
  );
};

export default ChatBox;
