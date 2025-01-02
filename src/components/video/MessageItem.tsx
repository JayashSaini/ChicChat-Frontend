import moment from "moment";
import { classNames } from "../../utils";
import { RoomMessageItem } from "@interfaces/stream";

const MessageItem: React.FC<{
  message: RoomMessageItem;
}> = ({ message }) => {
  return (
    <div
      className={classNames(
        "w-full h-auto flex gap-3 max-w-lg", // Base styles for all messages
        message.isOwnMessage ? "justify-end" : "justify-start" // Align to right or left
      )}
    >
      {/* Message box */}
      <div
        className={classNames(
          "p-4 rounded-2xl flex flex-col group",
          message.isOwnMessage
            ? "rounded-br-none dark:bg-[#ffc10738] bg-[#ffc1076e]" // Styling for own messages
            : "rounded-bl-none dark:bg-[#333333] bg-[#e7e6e6]" // Styling for other messages
        )}
      >
        {/* Show username for other participants */}
        {!message.isOwnMessage && (
          <p
            className={classNames(
              "text-xs font-semibold mb-2",
              ["text-[#167F76]", "text-danger"][message.username.length % 2]
            )}
          >
            {message.username}
          </p>
        )}
        {/* Message content */}
        {message.content && (
          <div className="relative flex justify-between">
            <p
              className="text-sm text-textPrimary"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {message.content}
            </p>
          </div>
        )}
        {/* Timestamp */}
        <p
          className={classNames(
            "mt-1.5 self-end text-[10px] inline-flex items-center",
            message.isOwnMessage ? "text-textPrimary" : "text-textSecondary"
          )}
        >
          {moment(message.createdAt).add("TIME_ZONE", "hours").fromNow(true)}{" "}
          ago
        </p>
      </div>
    </div>
  );
};

export default MessageItem;
