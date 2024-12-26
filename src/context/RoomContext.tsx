import React, { createContext, useState } from "react";
import { Room } from "@interfaces/stream";

// Sockets Events

// Create a context to manage authentication-related data and functions
const RoomContext = createContext<{
  room: Room | undefined;
  setRoomHandler: (room: Room) => void;
}>({
  room: undefined,
  setRoomHandler: () => {},
});

// Create a component that provides Room authentication-related data and functions
const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [room, setRoom] = useState<Room | undefined>(undefined);

  const setRoomHandler = (room: Room) => {
    setRoom(room);
  };

  return (
    <RoomContext.Provider
      value={{
        room,
        setRoomHandler,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { RoomContext, RoomProvider };
