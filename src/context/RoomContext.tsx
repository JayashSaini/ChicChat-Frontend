import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSocket } from "./SocketContext";
import { UserInterface } from "@interfaces/user";
import { useNavigate } from "react-router-dom";

// Sockets Events

// Create a context to manage authentication-related data and functions
const RoomContext = createContext<{
  joinRoomLoader: boolean;
  joinRoom: (roomId: string, user: UserInterface) => void;
}>({
  joinRoomLoader: false,
  joinRoom: () => {},
});

// Create a hook to access the RoomContext
const useRoom = () => useContext(RoomContext);

// Create a component that provides Room authentication-related data and functions
const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [joinRoomLoader, setJoinRoomLoader] = useState<boolean>(false);

  const { socket } = useSocket();
  const navigate = useNavigate();

  const handleRoomError = (error: { message: string }) => {
    return toast.error(
      error.message || "An error occurred while joining the room."
    );
  };

  const joinRoom = async (roomId: string, user: UserInterface) => {
    if (!socket) return;
    setJoinRoomLoader(true);
    await socket.emit("adminJoinRequestEvent", { roomId, user });
  };

  const roomJoinApprovedHandler = ({ roomId }: { roomId: string }) => {
    setJoinRoomLoader(false);
    toast.success("You have successfully joined the room!");
    navigate("/workspace/stream/room/" + roomId);
  };

  const roomJoinRejectedHandler = ({ message }: { message: string }) => {
    setJoinRoomLoader(false);
    navigate("/workspace/stream");
    toast.info(message);
  };

  const userJoinedHandler = ({ username }: { username: string }) => {
    console.log("running userJoinedHandler", username);
    toast.info(username + "joined the room!");
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("room:error", handleRoomError);
    socket.on("room:join:approved", roomJoinApprovedHandler);
    socket.on("room:join:rejected", roomJoinRejectedHandler);
    socket.on("user:joined", userJoinedHandler);

    return () => {
      socket.off("room:error", handleRoomError);
      socket.off("room:join:rejected", roomJoinRejectedHandler);
      socket.off("room:join:approved", roomJoinApprovedHandler);
      socket.off("user:joined", userJoinedHandler);
    };
  }, [socket]);

  return (
    <RoomContext.Provider value={{ joinRoom, joinRoomLoader }}>
      {children}
    </RoomContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { RoomContext, RoomProvider, useRoom };
