import {
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassPlusIcon,
  PaperClipIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import moment from "moment";
import { useState } from "react";
import { ChatMessageInterface } from "../../interfaces/chat";
import { classNames, isImageFile } from "../../utils";

const MessageItem: React.FC<{
  isOwnMessage?: boolean;
  isGroupChatMessage?: boolean;
  message: ChatMessageInterface;
  deleteChatMessage: (message: ChatMessageInterface) => void;
}> = ({ message, isOwnMessage, isGroupChatMessage, deleteChatMessage }) => {
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [openOptions, setopenOptions] = useState<boolean>(false); // To open delete menu option on hover

  return (
    <>
      {resizedImage ? (
        <div className="h-full z-40 p-8 overflow-hidden w-full absolute inset-0 bg-black/70 flex justify-center items-center">
          <XMarkIcon
            className="absolute top-5 right-5 w-9 h-9 text-white cursor-pointer"
            onClick={() => setResizedImage(null)}
          />
          {isImageFile(resizedImage) ? (
            <img
              className="w-full h-full object-contain"
              src={resizedImage}
              alt="chat image"
            />
          ) : (
            <div className=" text-sm flex justify-center items-center h-full w-full bg-backgroundSecondary/50  text-textPrimary px-5">
              <p>No preview available</p>
            </div>
          )}
        </div>
      ) : null}
      <div
        className={classNames(
          "flex justify-start items-end gap-3 max-w-lg min-w-",
          isOwnMessage ? "ml-auto" : ""
        )}
      >
        <img
          src={message.sender?.avatar?.url}
          className={classNames(
            "h-7 w-7 object-cover rounded-full flex flex-shrink-0",
            isOwnMessage ? "order-2" : "order-1"
          )}
        />
        {/* message box have to add the icon on hover here */}
        <div
          onMouseLeave={() => setopenOptions(false)}
          className={classNames(
            "p-4 rounded-2xl flex flex-col group",
            isOwnMessage
              ? "order-1 rounded-br-none dark:bg-[#ffc10738] bg-[#ffc1076e]"
              : "order-2 rounded-bl-none dark:bg-[#333333] bg-[#e7e6e6]"
          )}
        >
          {isGroupChatMessage && !isOwnMessage ? (
            <p
              className={classNames(
                "text-xs font-semibold mb-2",
                ["text-[#167F76]", "text-danger"][
                  message.sender.username.length % 2
                ]
              )}
            >
              {message.sender?.username}
            </p>
          ) : null}
          {message?.attachments?.length > 0 ? (
            <div>
              {/* The option to delete the message will only open in case of own messages */}
              {isOwnMessage ? (
                <button
                  className="self-center p-1 relative options-button"
                  onClick={() => setopenOptions(!openOptions)}
                >
                  <EllipsisVerticalIcon className="group-hover:w-6 group-hover:opacity-100 w-0 opacity-0 transition-all ease-in-out duration-100 text-textPrimary" />
                  <div
                    className={classNames(
                      "bg-backgroundTertiary delete-menu z-20 text-left -translate-x-28 -translate-y-4 absolute bottom-0 text-[12px] w-auto rounded-xl shadow-md border-[1px] border-border",
                      openOptions ? "block" : "hidden"
                    )}
                  >
                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        const ok = confirm(
                          "Are you sure you want to delete this message"
                        );
                        if (ok) {
                          deleteChatMessage(message);
                        }
                      }}
                      role="button"
                      className="px-5 py-2 text-danger rounded-sm w-auto inline-flex items-center hover:bg-secondary"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete Message
                    </p>
                  </div>
                </button>
              ) : null}

              <div
                className={classNames(
                  "grid max-w-7xl gap-2",
                  message.attachments?.length === 1 ? "grid-cols-1" : "",
                  message.attachments?.length === 2 ? "grid-cols-2" : "",
                  message.attachments?.length >= 3 ? "grid-cols-3" : "",
                  message.content ? "mb-6" : ""
                )}
              >
                {message.attachments?.map((file) => (
                  <div
                    key={file._id}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                  >
                    <button
                      onClick={() => setResizedImage(file.url)}
                      className="absolute inset-0 z-20 flex justify-center items-center w-full gap-2 h-full bg-black/60 group-hover:opacity-100 opacity-0 transition-opacity ease-in-out duration-150"
                    >
                      <MagnifyingGlassPlusIcon className="h-6 w-6 text-textPrimary" />
                      <a
                        href={file.url}
                        download
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                      >
                        <ArrowDownTrayIcon
                          title="download"
                          className="hover:text-zinc-400 h-6 w-6 text-white cursor-pointer"
                        />
                      </a>
                    </button>
                    {isImageFile(file.url) ? (
                      <img
                        className="h-full w-full object-cover"
                        src={file.url}
                        alt="msg_img"
                      />
                    ) : (
                      <div className=" text-sm flex justify-center items-center h-full w-full bg-backgroundSecondary  text-textPrimary px-5">
                        <p>No preview available</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {message.content ? (
            <div className="relative flex justify-between">
              {/* The option to delete the message will only open in case of own messages */}
              {isOwnMessage && message?.attachments?.length == 0 ? (
                <button
                  className="self-center relative options-button"
                  onClick={() => setopenOptions(!openOptions)}
                >
                  <EllipsisVerticalIcon className="group-hover:w-4 group-hover:opacity-100 w-0 opacity-0 transition-all ease-in-out duration-100 text-textPrimary" />
                  <div
                    className={classNames(
                      "bg-backgroundTertiary delete-menu z-20 text-left -translate-x-28 -translate-y-4 absolute bottom-0 text-[12px] w-auto rounded-xl shadow-md border-[1px] border-border",
                      openOptions ? "block" : "hidden"
                    )}
                  >
                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        const ok = confirm(
                          "Are you sure you want to delete this message"
                        );
                        if (ok) {
                          deleteChatMessage(message);
                        }
                      }}
                      role="button"
                      className="px-5 py-2 text-danger rounded-sm w-auto inline-flex items-center hover:bg-secondary"
                    >
                      <TrashIcon className="w-6 mr-1" />
                      Delete Message
                    </p>
                  </div>
                </button>
              ) : null}

              <p
                className="text-sm text-textPrimary"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {message.content}
              </p>
            </div>
          ) : null}
          <p
            className={classNames(
              "mt-1.5 self-end text-[10px] inline-flex items-center",
              isOwnMessage ? "text-textPrimary" : "text-textSecondary"
            )}
          >
            {message.attachments?.length > 0 ? (
              <PaperClipIcon className="h-4 w-4 mr-2 " />
            ) : null}
            {moment(message.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}{" "}
            ago
          </p>
        </div>
      </div>
    </>
  );
};

export default MessageItem;
