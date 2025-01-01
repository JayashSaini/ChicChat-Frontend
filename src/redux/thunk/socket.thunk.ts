import { setSocket } from "@redux/slice/socket.slice";
import { AppDispatch, RootState } from "@redux/store";
import { LocalStorage } from "@utils/index";
import socketio, { Socket } from "socket.io-client";

// Function to establish a socket connection
const getSocket = () => {
  const token = LocalStorage.get("token");
  return socketio(import.meta.env.VITE_SERVER_URI, {
    withCredentials: true,
    auth: { token },
  });
};

// Thunk to initialize the socket connection
export const initializeSocket = () => (dispatch: AppDispatch) => {
  const newSocket: Socket = getSocket();
  dispatch(setSocket(newSocket));

  // Handle socket disconnection on cleanup
  newSocket.on("disconnect", () => {
    dispatch(setSocket(null));
  });
};

// Thunk to disconnect the socket
export const disconnectSocket =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    const { socket } = getState().socket;
    if (socket) {
      socket.disconnect();
      dispatch(setSocket(null));
    }
  };
