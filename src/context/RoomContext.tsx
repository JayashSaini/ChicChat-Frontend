import React, { createContext, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useSocket } from "./SocketContext";

// Sockets Events

// Create a context to manage authentication-related data and functions
const RoomContext = createContext<{}>({});

// Create a hook to access the RoomContext
const useRoom = () => useContext(RoomContext);

// Create a component that provides Room authentication-related data and functions
const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { socket } = useSocket();

  const handleRoomError = (error: { message: string }) => {
    return toast.error(
      error.message || "An error occurred while joining the room."
    );
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("room:error", handleRoomError);

    return () => {
      socket.off("room:error", handleRoomError);
    };
  }, [socket]);

  return <RoomContext.Provider value={{}}>{children}</RoomContext.Provider>;
};

// Export the context, provider component, and custom hook
export { RoomContext, RoomProvider, useRoom };
