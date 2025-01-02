import {
  ParticipantInterface,
  Room,
  RoomMessageItem,
} from "@interfaces/stream";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RoomState {
  room: Room | undefined;
  participants: ParticipantInterface[];
  emojiReaction?: string | null;
  isHandRaised?: boolean;
  roomMessages?: RoomMessageItem[];
  isParticipantTyping?: boolean;
}

const initialState: RoomState = {
  room: undefined,
  participants: [],
  emojiReaction: null,
  isHandRaised: false,
  roomMessages: [],
  isParticipantTyping: false,
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
    addRoomMessage(state, action: PayloadAction<RoomMessageItem>) {
      state?.roomMessages?.push(action.payload);
    },
    setIsParticipantTyping(state, action: PayloadAction<boolean>) {
      state.isParticipantTyping = action.payload;
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
  addRoomMessage,
  setIsParticipantTyping,
} = roomSlice.actions;

// Reducer export
export default roomSlice.reducer;
