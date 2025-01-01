import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

// Define the shape of the socket state in Redux
export interface SocketState {
  isConnected: boolean;
  socket: Socket | null;
}

const initialState: SocketState = {
  isConnected: false,
  socket: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setConnectionStatus(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setSocket(state, action: PayloadAction<Socket | null>) {
      // Type cast to 'any' to avoid immutability error with readonly properties
      state.socket = action.payload as any; // or state.socket = action.payload!;
    },
  },
});

export const { setConnectionStatus, setSocket } = socketSlice.actions;

export default socketSlice.reducer;
