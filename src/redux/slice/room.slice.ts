import { ParticipantInterface, Room } from "@interfaces/stream";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RoomState {
  room: Room | undefined;
  participants: ParticipantInterface[];
  emojiReaction?: string | null;
  isHandRaised?: boolean;
}

const initialState: RoomState = {
  room: undefined,
  participants: [],
  emojiReaction: null,
  isHandRaised: false,
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
    resetEmoji(state) {
      state.emojiReaction = null;
    },
    setEmojiReaction(state, action: PayloadAction<string | null>) {
      state.emojiReaction = action.payload;
    },
    setIsHandRaised(state, action: PayloadAction<boolean>) {
      state.isHandRaised = action.payload;
    },
  },
});

export const {
  setRoom,
  setParticipants,
  addParticipant,
  removeParticipant,
  setEmojiReaction,
  resetEmoji,
  setIsHandRaised,
} = roomSlice.actions;

// Reducer export
export default roomSlice.reducer;
