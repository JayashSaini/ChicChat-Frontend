import { createContext, useEffect, useState } from "react";

// Defining the context properties type
interface MediaState {
  error: string | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
  toggleVideo: () => void;
  toggleAudio: () => void;
}

interface MediaContextValue {
  mediaStream: MediaStream | null;
  mediaState: MediaState;
}

// Create context with an initial undefined state
export const MediaContext = createContext<MediaContextValue | undefined>(
  undefined
);

// Media provider component to manage media states and operations
export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);

  // Helper function to toggle tracks and update state
  const toggleTracks = (
    tracks: MediaStreamTrack[],
    setState: (isEnabled: boolean) => void
  ) => {
    if (tracks.length === 0) return; // No tracks to toggle
    const currentEnabledState = tracks[0]?.enabled ?? false;
    tracks.forEach((track) => (track.enabled = !currentEnabledState));
    setState(!currentEnabledState);
  };

  // Toggle video track
  const toggleVideo = () => {
    if (mediaStream) {
      toggleTracks(mediaStream.getVideoTracks(), setVideoEnabled);
    }
  };

  // Toggle audio track
  const toggleAudio = () => {
    if (mediaStream) {
      toggleTracks(mediaStream.getAudioTracks(), setAudioEnabled);
    }
  };

  const initializeMedia = async () => {
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMediaStream(stream);
        setError(null);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      }
    } else {
      setError("Your device or browser does not support media access.");
    }
  };

  // Effect to initialize media stream on component mount
  useEffect(() => {
    // Initialize media stream when component mounts
    initializeMedia();

    // Cleanup function to stop the media stream on unmount
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount and unmount

  // Provide context to children components
  return (
    <MediaContext.Provider
      value={{
        mediaStream,
        mediaState: {
          error,
          audioEnabled,
          videoEnabled,
          toggleVideo,
          toggleAudio,
        },
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};
