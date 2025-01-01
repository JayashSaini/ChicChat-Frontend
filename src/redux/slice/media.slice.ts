import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initializeMedia } from "../thunk/media.thunk"; // import the async thunk

interface MediaState {
  error: string | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

export interface MediaContext {
  mediaStream: MediaStream | null;
  mediaState: MediaState;
  isScreenSharing?: boolean;
}

const initialState: MediaContext = {
  mediaStream: null,
  mediaState: {
    error: null,
    audioEnabled: false,
    videoEnabled: false,
  },
  isScreenSharing: false,
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    // Toggle video track
    toggleVideo(state) {
      if (state.mediaStream) {
        const videoTracks = state.mediaStream.getVideoTracks();
        if (videoTracks.length > 0) {
          const currentEnabledState = videoTracks[0]?.enabled ?? false;
          videoTracks.forEach(
            (track) => (track.enabled = !currentEnabledState)
          );
          state.mediaState.videoEnabled = !currentEnabledState;
        }
      }
    },

    // Toggle audio track
    toggleAudio(state) {
      if (state.mediaStream) {
        const audioTracks = state.mediaStream.getAudioTracks();
        if (audioTracks.length > 0) {
          const currentEnabledState = audioTracks[0]?.enabled ?? false;
          audioTracks.forEach(
            (track) => (track.enabled = !currentEnabledState)
          );
          state.mediaState.audioEnabled = !currentEnabledState;
        }
      }
    },

    // Set media stream (initial setup)
    setMediaStream(state, action: PayloadAction<MediaStream>) {
      state.mediaStream = action.payload;
    },
    setMediaStreamVideoTracks(
      state,
      action: PayloadAction<MediaStreamTrack[]>
    ) {
      if (action.payload.length > 0) {
        const currentAudioTrack = state?.mediaStream?.getAudioTracks()[0]; // Get the current audio track
        const newVideoTrack = action.payload[0]; // The new video track from action

        // Create an array of tracks, filtering out undefined values
        const tracks: MediaStreamTrack[] = [newVideoTrack];

        // Only add the audio track if it exists
        if (currentAudioTrack) {
          tracks.push(currentAudioTrack);
        }

        // Create a new MediaStream with the valid tracks
        const newMediaStream = new MediaStream(tracks);

        // Store the updated MediaStream in the state
        state.mediaStream = newMediaStream;
      }
    },

    // Set error state
    setError(state, action: PayloadAction<string | null>) {
      state.mediaState.error = action.payload;
    },

    toggleScreenSharing(state) {
      state.isScreenSharing = !state.isScreenSharing;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeMedia.pending, (state) => {
        state.mediaState.error = null; // clear any previous error
      })
      .addCase(initializeMedia.fulfilled, (state, action) => {
        state.mediaStream = action.payload.stream;
        state.mediaState.error = null;
        state.mediaState.audioEnabled = true; // Set audio to enabled after successful stream
        state.mediaState.videoEnabled = true; // Set video to enabled after successful stream
      })
      .addCase(initializeMedia.rejected, (state, action) => {
        state.mediaState.error = action.payload as string;
      });
  },
});

// Actions export
export const {
  toggleVideo,
  toggleAudio,
  setMediaStream,
  setError,
  toggleScreenSharing,
  setMediaStreamVideoTracks,
} = mediaSlice.actions;

// Reducer export
export default mediaSlice.reducer;
