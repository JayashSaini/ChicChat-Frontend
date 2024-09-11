import React, { useState } from "react";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import ToolTip from "@components/ui/tooltip";
import { Logo } from "@layout/workspace.layout";
import { useSidebar } from "@context/SliderContext";
import ChatItem from "./ChatItem";
import { useChat } from "@context/ChatContext";
import Typing from "./Typing";
import { getChatObjectMetadata, LocalStorage } from "@utils/index";
import { useAuth } from "@context/AuthContext";
import AddChatModal from "./AddChatModal";

const ChatSidebar: React.FC = React.memo(() => {
  const [localSearchQuery, setLocalSearchQuery] = useState(""); // For local search functionality
  const [openAddChat, setOpenAddChat] = useState(false); // To control the 'Add Chat' modal

  const { theme, isMobileScreen } = useSidebar();
  const {
    chats,
    isLoadingChats,
    currentChat,
    getMessages,
    unreadMessages,
    setChatsHandler,
    setMessageHandler,
    getChats,
  } = useChat();
  const { user } = useAuth();

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

      <div className="md:w-2/5 w-full h-full bg-backgroundSecondary relative  overflow-y-auto border-r-[1px]  border-r-border">
        <div className="z-10 w-full sticky top-0  py-4 md:px-4 px-2 flex justify-between items-center gap-4">
          <div className="w-full ">
            {!isMobileScreen && (
              <div className="mb-3 flex justify-between items-center">
                <Logo theme={theme} />
                <ToolTip title="Add User">
                  {" "}
                  <AddCommentOutlinedIcon
                    className="text-textSecondary cursor-pointer sm:text-lg text-sm"
                    onClick={() => setOpenAddChat(true)}
                  />
                </ToolTip>
              </div>
            )}

            <div className="flex  items-center gap-2">
              <input
                placeholder="Search user or group..."
                className=" text-[15px] bg-backgroundTertiary block w-full rounded-[5px] border border-border py-2 px-3  text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-[1px] focus:ring-primary"
                value={localSearchQuery}
                onChange={(e) =>
                  setLocalSearchQuery(e.target.value.toLowerCase())
                }
              />
              {isMobileScreen && (
                <ToolTip title="Add User">
                  {" "}
                  <AddCommentOutlinedIcon
                    className="text-textSecondary cursor-pointer text-xl mx-2"
                    onClick={() => setOpenAddChat(true)}
                  />
                </ToolTip>
              )}
            </div>

            <div className="w-full py-2 space-y-3 ">
              {isLoadingChats ? (
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
                          unreadMessages.filter((n) => n.chat === chat._id)
                            .length
                        }
                        onClick={(chat) => {
                          if (
                            currentChat.current?._id &&
                            currentChat.current?._id === chat._id
                          )
                            return;
                          LocalStorage.set("currentChat", chat);
                          currentChat.current = chat;
                          setMessageHandler("");
                          getMessages();
                        }}
                        key={chat._id}
                        onChatDelete={(chatId) => {
                          setChatsHandler([
                            ...chats.filter((chat) => chat._id !== chatId),
                          ]);
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
          </div>
        </div>
      </div>
    </>
  );
});

export default ChatSidebar;
