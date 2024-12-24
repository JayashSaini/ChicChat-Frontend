import {
  PaperAirplaneIcon,
  PaperClipIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { deleteMessage, getChatMessages, sendMessage } from "../api";
import AddChatModal from "../components/chat/AddChatModal";
import ChatItem from "../components/chat/ChatItem";
import MessageItem from "../components/chat/MessageItem";
import Typing from "../components/chat/Typing";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import {
  ChatListItemInterface,
  ChatMessageInterface,
} from "../interfaces/chat";
import {
  LocalStorage,
  classNames,
  getChatObjectMetadata,
  requestHandler,
} from "../utils";

const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";
// const SOCKET_ERROR_EVENT = "socketError";

const ChatPage = () => {
  // Import the 'useAuth' and 'useSocket' hooks from their respective contexts
  const { user, logout } = useAuth();
  const { socket } = useSocket();

  // Create a reference using 'useRef' to hold the currently selected chat.
  // 'useRef' is used here because it ensures that the 'currentChat' value within socket event callbacks
  // will always refer to the latest value, even if the component re-renders.
  const currentChat = useRef<ChatListItemInterface | null>(null);

  // To keep track of the setTimeout function
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define state variables and their initial values using 'useState'
  const [isConnected, setIsConnected] = useState(false); // For tracking socket connection

  const [openAddChat, setOpenAddChat] = useState(false); // To control the 'Add Chat' modal
  const [loadingChats, setLoadingChats] = useState(false); // To indicate loading of chats
  const [loadingMessages, setLoadingMessages] = useState(false); // To indicate loading of messages

  const [chats, setChats] = useState<ChatListItemInterface[]>([]); // To store user's chats
  const [messages, setMessages] = useState<ChatMessageInterface[]>([]); // To store chat messages
  const [unreadMessages, setUnreadMessages] = useState<ChatMessageInterface[]>(
    []
  ); // To track unread messages

  const [isTyping, setIsTyping] = useState(false); // To track if someone is currently typing
  const [selfTyping, setSelfTyping] = useState(false); // To track if the current user is typing

  const [message, setMessage] = useState(""); // To store the currently typed message
  const [localSearchQuery, setLocalSearchQuery] = useState(""); // For local search functionality

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]); // To store files attached to messages

  /**
   *  A  function to update the last message of a specified chat to update the chat list
   */
  const updateChatLastMessage = (
    chatToUpdateId: string,
    message: ChatMessageInterface // The new message to be set as the last message
  ) => {
    // Search for the chat with the given ID in the chats array
    const chatToUpdate = chats.find((chat) => chat._id === chatToUpdateId)!;

    // Update the 'lastMessage' field of the found chat with the new message
    chatToUpdate.lastMessage = message;

    // Update the 'updatedAt' field of the chat with the 'updatedAt' field from the message
    chatToUpdate.updatedAt = message?.updatedAt;

    // Update the state of chats, placing the updated chat at the beginning of the array
    setChats([
      chatToUpdate, // Place the updated chat first
      ...chats.filter((chat) => chat._id !== chatToUpdateId), // Include all other chats except the updated one
    ]);
  };
  /**
   *A function to update the chats last message specifically in case of deletion of message *
   **/

  const updateChatLastMessageOnDeletion = (
    chatToUpdateId: string, //ChatId to find the chat
    message: ChatMessageInterface //The deleted message
  ) => {
    // Search for the chat with the given ID in the chats array
    const chatToUpdate = chats.find((chat) => chat._id === chatToUpdateId)!;

    //Updating the last message of chat only in case of deleted message and chats last message is same
    if (chatToUpdate.lastMessage?._id === message._id) {
      requestHandler(
        async () => getChatMessages(chatToUpdateId),
        null,
        (req) => {
          const { data } = req;

          chatToUpdate.lastMessage = data[0];
          setChats([...chats]);
        },
        alert
      );
    }
  };

  // Function to send a chat message
  const sendChatMessage = async () => {
    // If no current chat ID exists or there's no socket connection, exit the function
    if (!currentChat.current?._id || !socket) return;

    // Emit a STOP_TYPING_EVENT to inform other users/participants that typing has stopped
    socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);

    // Use the requestHandler to send the message and handle potential response or error
    await requestHandler(
      // Try to send the chat message with the given message and attached files
      async () =>
        await sendMessage(
          currentChat.current?._id || "", // Chat ID or empty string if not available
          message, // Actual text message
          attachedFiles // Any attached files
        ),
      null,
      // On successful message sending, clear the message input and attached files, then update the UI
      (res) => {
        setMessage(""); // Clear the message input
        setAttachedFiles([]); // Clear the list of attached files
        setMessages((prev) => [res.data, ...prev]); // Update messages in the UI
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
        setMessages((prev) => prev.filter((msg) => msg._id !== res.data._id));
        updateChatLastMessageOnDeletion(message.chat, message);
      },
      alert
    );
  };

  const handleOnMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the message state with the current input value
    setMessage(e.target.value);

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
    <>
      <AddChatModal
        open={openAddChat}
        onClose={() => {
          setOpenAddChat(false);
        }}
        onSuccess={() => {
          getChats();
        }}
      />

      <div className="w-full justify-between items-stretch h-screen flex flex-shrink-0">
        <div className="w-1/3 relative ring-white overflow-y-auto px-4">
          <div className="z-10 w-full sticky top-0 bg-dark py-4 flex justify-between items-center gap-4">
            <button
              type="button"
              className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-xl text-sm px-5 py-4 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 flex-shrink-0"
              onClick={logout}
            >
              Log Out
            </button>

            <Input
              placeholder="Search user or group..."
              value={localSearchQuery}
              onChange={(e) =>
                setLocalSearchQuery(e.target.value.toLowerCase())
              }
            />
            <button
              onClick={() => setOpenAddChat(true)}
              className="rounded-xl border-none bg-primary text-white py-4 px-5 flex flex-shrink-0"
            >
              + Add chat
            </button>
          </div>
          {loadingChats ? (
            <div className="flex justify-center items-center h-[calc(100%-88px)]">
              <Typing />
            </div>
          ) : (
            // Iterating over the chats array
            [...chats]
              // Filtering chats based on a local search query
              .filter((chat) =>
                // If there's a localSearchQuery, filter chats that contain the query in their metadata title
                localSearchQuery
                  ? getChatObjectMetadata(chat, user!)
                      .title?.toLocaleLowerCase()
                      ?.includes(localSearchQuery)
                  : // If there's no localSearchQuery, include all chats
                    true
              )
              .map((chat) => {
                return (
                  <ChatItem
                    chat={chat}
                    isActive={chat._id === currentChat.current?._id}
                    unreadCount={
                      unreadMessages.filter((n) => n.chat === chat._id).length
                    }
                    onClick={(chat) => {
                      if (
                        currentChat.current?._id &&
                        currentChat.current?._id === chat._id
                      )
                        return;
                      LocalStorage.set("currentChat", chat);
                      currentChat.current = chat;
                      setMessage("");
                      getMessages();
                    }}
                    key={chat._id}
                    onChatDelete={(chatId) => {
                      setChats((prev) =>
                        prev.filter((chat) => chat._id !== chatId)
                      );
                      if (currentChat.current?._id === chatId) {
                        currentChat.current = null;
                        LocalStorage.remove("currentChat");
                      }
                    }}
                  />
                );
              })
          )}
        </div>
        <div className="w-2/3 border-l-[0.1px] border-secondary">
          {currentChat.current && currentChat.current?._id ? (
            <>
              <div className="p-4 sticky top-0 bg-dark z-20 flex justify-between items-center w-full border-b-[0.1px] border-secondary">
                <div className="flex justify-start items-center w-max gap-3">
                  {currentChat.current.isGroupChat ? (
                    <div className="w-12 relative h-12 flex-shrink-0 flex justify-start items-center flex-nowrap">
                      {currentChat.current.participants
                        .slice(0, 3)
                        .map((participant, i) => {
                          return (
                            <img
                              key={participant._id}
                              src={participant.avatar.url}
                              className={classNames(
                                "w-9 h-9 border-[1px] border-white rounded-full absolute outline outline-4 outline-dark",
                                i === 0
                                  ? "left-0 z-30"
                                  : i === 1
                                  ? "left-2 z-20"
                                  : i === 2
                                  ? "left-4 z-10"
                                  : ""
                              )}
                            />
                          );
                        })}
                    </div>
                  ) : (
                    <img
                      className="h-14 w-14 rounded-full flex flex-shrink-0 object-cover"
                      src={
                        getChatObjectMetadata(currentChat.current, user!).avatar
                      }
                    />
                  )}
                  <div>
                    <p className="font-bold">
                      {getChatObjectMetadata(currentChat.current, user!).title}
                    </p>
                    <small className="text-zinc-400">
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
                  "p-8 overflow-y-auto flex flex-col-reverse gap-6 w-full",
                  attachedFiles.length > 0
                    ? "h-[calc(100vh-336px)]"
                    : "h-[calc(100vh-176px)]"
                )}
                id="message-window"
              >
                {loadingMessages ? (
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
                            <XCircleIcon className="h-6 w-6 text-white" />
                          </button>
                        </div>
                        <img
                          className="h-full rounded-xl w-full object-cover"
                          src={URL.createObjectURL(file)}
                          alt="attachment"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}
              <div className="sticky top-full p-4 flex justify-between items-center w-full gap-2 border-t-[0.1px] border-secondary">
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
                  className="p-4 rounded-full bg-dark hover:bg-secondary"
                >
                  <PaperClipIcon className="w-6 h-6" />
                </label>

                <Input
                  placeholder="Message"
                  value={message}
                  onChange={handleOnMessageChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendChatMessage();
                    }
                  }}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!message && attachedFiles.length <= 0}
                  className="p-4 rounded-full bg-dark hover:bg-secondary disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              No chat selected
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
