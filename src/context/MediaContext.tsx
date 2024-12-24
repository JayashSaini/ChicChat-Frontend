import { createContext, useEffect, useState } from "react";

// Defining the context properties type
interface MediaContextProps {
  stream: MediaStream | null;
  media: {
    mediaError: string | null;
    isAudioOn: boolean;
    isVideoOn: boolean;
    toggleVideo: () => void;
    toggleAudio: () => void;
  };
}

// Create context with an initial undefined state
export const MediaContext = createContext<MediaContextProps | undefined>(
  undefined
);

// Media provider component to manage media states and operations
export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State variables to store media stream, errors, and toggle states
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(false);

  // Function to toggle video track on/off
  const toggleVideo = () => {
    if (stream) {
      // Toggle each video track's enabled state
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });

      // Update the video state based on the previous state
      setIsVideoOn((prevState) => !prevState);
    }
  };

  // Function to toggle audio track on/off
  const toggleAudio = () => {
    if (stream) {
      // Toggle each audio track's enabled state
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });

      // Update the audio state based on the previous state
      setIsAudioOn((prevState) => !prevState);
    }
  };

  // Function to request media access (video & audio)
  const getMedia = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        // Request access to both video and audio
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // On success, set the stream and reset error
        setStream(mediaStream);
        setMediaError(null);
      } catch (error: any) {
        // On error, set the media error message
        setMediaError(error.message);
      }
    } else {
      // If the browser doesn't support media access
      setMediaError("Your device or browser does not support media access.");
    }
  };

  // Effect to initialize media stream on component mount
  useEffect(() => {
    getMedia(); // Call the function to request media access
  }, []); // Empty dependency array ensures this runs only once

  // Provide context to children components
  return (
    <MediaContext.Provider
      value={{
        stream,
        media: {
          mediaError,
          isAudioOn,
          isVideoOn,
          toggleVideo,
          toggleAudio,
        },
      }}
    >
      {children} {/* Render child components */}
    </MediaContext.Provider>
  );
};
