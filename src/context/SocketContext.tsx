/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import socketio, { Socket } from "socket.io-client";
import { LocalStorage } from "../utils";

// Function to establish a socket connection with authorization token
const getSocket = () => {
  const token = LocalStorage.get("token"); // Retrieve JWT token
  return socketio(import.meta.env.VITE_SERVER_URI, {
    withCredentials: true,
    auth: { token },
  });
};

// Define the shape of the context value
interface SocketContextType {
  socket: Socket | null;
}

// Create a context to hold the socket instance
const SocketContext = createContext<SocketContextType>({
  socket: null,
});

// Custom hook to access the socket instance from the context
const useSocket = () => useContext(SocketContext);

// SocketProvider component to manage the socket instance and provide it through context
const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to store the socket instance
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
