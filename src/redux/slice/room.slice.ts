import { ParticipantInterface, Room } from "@interfaces/stream";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RoomState {
  room: Room | undefined;
  participants: ParticipantInterface[];
  peerConnections: Record<string, RTCPeerConnection>;
  candidateQueue: Record<string, RTCIceCandidate[]>;
}

const initialState: RoomState = {
  room: undefined,
  participants: [],
  peerConnections: {},
  candidateQueue: {},
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom(state, action: PayloadAction<Room>) {
      state.room = action.payload;
    },
    setParticipants(state, action: PayloadAction<ParticipantInterface[]>) {
      state.participants = action.payload;
    },
    addParticipant(state, action: PayloadAction<ParticipantInterface>) {
      state.participants.push(action.payload);
    },
    removeParticipant(state, action: PayloadAction<string>) {
      state.participants = state.participants.filter(
        (p) => p._id !== action.payload
      );
    },

    setPeerConnections(
      state,
      action: PayloadAction<Record<string, RTCPeerConnection>>
    ) {
      state.peerConnections = action.payload;
    },
    setCandidateQueue(
      state,
      action: PayloadAction<Record<string, RTCIceCandidate[]>>
    ) {
      state.candidateQueue = action.payload;
    },
    addCandidate(
      state,
      action: PayloadAction<{ socketId: string; candidate: RTCIceCandidate }>
    ) {
      const { socketId, candidate } = action.payload;
      if (!state.candidateQueue[socketId]) {
        state.candidateQueue[socketId] = [];
      }
      state.candidateQueue[socketId].push(candidate);
    },
    removeCandidate(state, action: PayloadAction<{ socketId: string }>) {
      const { socketId } = action.payload;
      delete state.candidateQueue[socketId];
    },
    addPeerConnection(
      state,
      action: PayloadAction<{
        socketId: string;
        peerConnection: RTCPeerConnection;
      }>
    ) {
      const { socketId, peerConnection } = action.payload;
      state.peerConnections[socketId] = peerConnection;
    },
    removePeerConnection(state, action: PayloadAction<{ socketId: string }>) {
      const { socketId } = action.payload;
      delete state.peerConnections[socketId];
    },
  },
});

export const {
  setRoom,
  setParticipants,
  addParticipant,
  removeParticipant,
  setPeerConnections,
  setCandidateQueue,
  addCandidate,
  removeCandidate,
  addPeerConnection,
  removePeerConnection,
} = roomSlice.actions;

// Reducer export
export default roomSlice.reducer;
