import { createAsyncThunk } from "@reduxjs/toolkit";

export const initializeMedia = createAsyncThunk(
  "media/initializeMedia",
  async (_, { rejectWithValue }) => {
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        return { stream }; // return the media stream on success
      } catch (error: any) {
        if (error.name === "NotAllowedError") {
          return rejectWithValue(
            "Permission to access camera/microphone was denied."
          );
        } else if (error.name === "NotFoundError") {
          return rejectWithValue("No media devices found.");
        } else if (error.name === "NotReadableError") {
          return rejectWithValue(
            "Camera or microphone is already being used by another service"
          );
        } else {
          return rejectWithValue(
            error instanceof Error
              ? error.message
              : "An unknown error occurred."
          );
        }
      }
    } else {
      return rejectWithValue(
        "Your device or browser does not support media access."
      );
    }
  }
);
