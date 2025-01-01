// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import mediaReducer from "./slice/media.slice";
import roomReducer from "./slice/room.slice";
import socketReducer from "./slice/socket.slice";

export const store = configureStore({
  reducer: {
    media: mediaReducer,
    room: roomReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "socket/setSocket",
          "media/initializeMedia/fulfilled",
          "room/addPeerConnection",
          "room/setParticipants",
        ], // Ignore action for setSocket
        ignoredPaths: [
          "socket.socket",
          "media.mediaStream",
          "room.peerConnections",
          "payload.peerConnection",
          "payload.0.stream",
          "room.participants.0.stream",
        ], // Ignore path for socket in state
      },
    }),
});

// Type for the entire state of the Redux store
export type RootState = ReturnType<typeof store.getState>;

// Type for the dispatch function
export type AppDispatch = typeof store.dispatch;
