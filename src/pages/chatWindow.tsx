import MessageItem from "@components/chat/MessageItem";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import React, { useRef, useState } from "react";
import {
  classNames,
  getChatObjectMetadata,
  isImageFile,
  requestHandler,
} from "@utils/index";
import { useChat } from "@context/ChatContext";
import { useAuth } from "@context/AuthContext";
import Typing from "@components/chat/Typing";
import { deleteMessage, sendMessage } from "@api/index";
import { ChatMessageInterface } from "@interfaces/chat";
import { toast } from "sonner";
import { useSocket } from "@context/SocketContext";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "@context/SliderContext";
import { FaArrowLeft } from "react-icons/fa";

// Sockets Events
const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";

const ChatWindow: React.FC = React.memo(() => {
  const [sendMessageLoading, setSendMessageLoading] = useState(false);

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]); // To store files attached to messages
  const [selfTyping, setSelfTyping] = useState(false); // To track if the current user is typing

  const navigate = useNavigate();

  const {
    currentChat,
    isLoadingMessages,
    setMessagesHandler,
    messages,
    updateChatLastMessageOnDeletion,
    isTyping,
    message,
    setMessageHandler,
    isConnected,
    updateChatLastMessage,
  } = useChat();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { isMobileScreen } = useSidebar();

  // To keep track of the setTimeout function
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to send a chat message
  const sendChatMessage = async () => {
    // If no current chat ID exists or there's no socket connection, exit the function
    if (!currentChat.current?._id || !socket) return;

    // Emit a STOP_TYPING_EVENT to inform other users/participants that typing has stopped
    socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);

    if (attachedFiles.length > 5) {
      setMessageHandler(""); // Clear the message input
      setAttachedFiles([]); // Clear the list of attached files
      return toast.error("Maximum attachment limit exceeded");
    }

    // Use the requestHandler to send the message and handle potential response or error
    await requestHandler(
      // Try to send the chat message with the given message and attached files
      async () =>
        await sendMessage(
          currentChat.current?._id || "", // Chat ID or empty string if not available
          message, // Actual text message
          attachedFiles // Any attached files
        ),
      setSendMessageLoading,
      // On successful message sending, clear the message input and attached files, then update the UI
      (res) => {
        setMessageHandler(""); // Clear the message input
        setAttachedFiles([]); // Clear the list of attached files
        setMessagesHandler([res.data, ...messages]); // Update messages in the UI
        updateChatLastMessage(currentChat.current?._id || "", res.data); // Update the last message in the chat
      },

      // If there's an error during the message sending process, raise an alert
      alert
    );
  };

  const deleteChatMessage = async (message: ChatMessageInterface) => {
    //ONClick delete the message and reload the chat when deleteMessage socket gives any response in chat.tsx
    //use request handler to prevent any errors

    await requestHandler(
      async () => await deleteMessage(message.chat, message._id),
      null,
      (res) => {
        setMessagesHandler([
          ...messages.filter((msg) => msg._id !== res.data._id),
        ]);
        updateChatLastMessageOnDeletion(message.chat, message);
      },
      (e) => toast.error(e)
    );
  };

  const handleOnMessageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Update the message state with the current input value
    setMessageHandler(e.target.value);

    // If socket doesn't exist or isn't connected, exit the function
    if (!socket || !isConnected) return;

    // Check if the user isn't already set as typing
    if (!selfTyping) {
      // Set the user as typing
      setSelfTyping(true);

      // Emit a typing event to the server for the current chat
      socket.emit(TYPING_EVENT, currentChat.current?._id);
    }

    // Clear the previous timeout (if exists) to avoid multiple setTimeouts from running
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Define a length of time (in milliseconds) for the typing timeout
    const timerLength = 3000;

    // Set a timeout to stop the typing indication after the timerLength has passed
    typingTimeoutRef.current = setTimeout(() => {
      // Emit a stop typing event to the server for the current chat
      socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);

      // Reset the user's typing state
      setSelfTyping(false);
    }, timerLength);
  };

  return (
    <div className="md:w-3/5 w-full md:h-screen h-[calc(100vh-56px)] overflow-y-auto bg-background">
      {currentChat.current && currentChat.current?._id ? (
        <>
          <div className=" bg-backgroundSecondary p-4 sticky top-0 z-20 flex justify-between items-center w-full  border-border">
            <div className="flex justify-start items-center w-max gap-3">
              {isMobileScreen && (
                <div
                  role="button"
                  className="px-2"
                  onClick={() => navigate("/workspace/chat")}
                >
                  <FaArrowLeft className="text-textPrimary text-base" />
                </div>
              )}
              {currentChat.current.isGroupChat ? (
                <div className="w-16 relative h-16 flex-shrink-0 flex justify-start items-center flex-nowrap">
                  {currentChat.current.participants
                    .slice(0, 3)
                    .map((participant, i) => {
                      return (
                        <img
                          key={participant._id}
                          src={participant.avatar.url}
                          className={classNames(
                            "w-10 h-10 border-[1px] dark:border-white border-[#e1e1e1] rounded-full absolute outline outline-4 outline-dark",
                            i === 0
                              ? "left-0 z-30"
                              : i === 1
                              ? "left-3 z-20"
                              : i === 2
                              ? "left-5 z-10"
                              : ""
                          )}
                        />
                      );
                    })}
                </div>
              ) : (
                <img
                  className="h-14 w-14 rounded-full flex flex-shrink-0 object-cover"
                  src={getChatObjectMetadata(currentChat.current, user!).avatar}
                />
              )}
              <div>
                <p className="font-bold text-textPrimary sm:text-lg text-sm">
                  {getChatObjectMetadata(currentChat.current, user!).title}
                </p>
                <small className="text-textSecondary sm:text-sm text-xs">
                  {
                    getChatObjectMetadata(currentChat.current, user!)
                      .description
                  }
                </small>
              </div>
            </div>
          </div>
          <div
            className={classNames(
              "sm:p-8 p-4 custom-scrollbar overflow-y-auto flex flex-col-reverse gap-6 w-full",
              attachedFiles.length > 0
                ? "md:h-[calc(100vh-336px)] h-[calc(100vh-392px)]"
                : "md:h-[calc(100vh-176px)] h-[calc(100vh-232px)]"
            )}
            id="message-window"
          >
            {isLoadingMessages ? (
              <div className="flex justify-center items-center h-[calc(100%-88px)]">
                <Typing />
              </div>
            ) : (
              <>
                {isTyping ? <Typing /> : null}
                {messages?.map((msg) => {
                  return (
                    <MessageItem
                      key={msg._id}
                      isOwnMessage={msg.sender?._id === user?._id}
                      isGroupChatMessage={currentChat.current?.isGroupChat}
                      message={msg}
                      deleteChatMessage={deleteChatMessage}
                    />
                  );
                })}
              </>
            )}
          </div>
          {attachedFiles.length > 0 ? (
            <div className="grid gap-4 grid-cols-5 p-4 justify-start max-w-fit">
              {attachedFiles.map((file, i) => {
                return (
                  <div
                    key={i}
                    className="group w-32 h-32 relative aspect-square rounded-xl cursor-pointer"
                  >
                    <div className="absolute inset-0 flex justify-center items-center w-full h-full bg-black/40 group-hover:opacity-100 opacity-0 transition-opacity ease-in-out duration-150">
                      <button
                        onClick={() => {
                          setAttachedFiles(
                            attachedFiles.filter((_, ind) => ind !== i)
                          );
                        }}
                        className="absolute -top-2 -right-2"
                      >
                        <XCircleIcon className="h-6 w-6 text-textPrimary" />
                      </button>
                    </div>
                    {isImageFile(URL.createObjectURL(file)) ? (
                      <img
                        className="h-full rounded-xl w-full object-cover"
                        src={URL.createObjectURL(file)}
                        alt="attachment"
                      />
                    ) : (
                      <div className=" text-sm flex justify-center items-center h-full w-full bg-[#ffc1078a] text-textPrimary px-5 rounded-lg">
                        <p>No preview available</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
          <div className="sticky top-full p-4 flex justify-between items-center w-full gap-2  border-border bg-backgroundSecondary">
            <input
              hidden
              id="attachments"
              type="file"
              value=""
              multiple
              max={5}
              onChange={(e) => {
                if (e.target.files) {
                  setAttachedFiles([...e.target.files]);
                }
              }}
            />
            <label
              htmlFor="attachments"
              className="p-4 rounded-full bg-backgroundTertiary cursor-pointer"
            >
              <PaperClipIcon className="w-6 h-6 text-textPrimary" />
            </label>

            <textarea
              placeholder="Message"
              value={message}
              onChange={handleOnMessageChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevent default new line on Enter key
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
              disabled={
                (!message && attachedFiles.length <= 0) || sendMessageLoading
              }
              className="p-4 rounded-full bg-backgroundTertiary cursor-pointer disabled:opacity-50"
            >
              <PaperAirplaneIcon className="w-6 h-6 text-textPrimary" />
            </button>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <div className="text-textPrimary text-base">No chat selected</div>
        </div>
      )}
    </div>
  );
});

export default ChatWindow;
