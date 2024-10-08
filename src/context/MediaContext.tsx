import React, { createContext, useState, useEffect, useContext } from "react";

type MediaContextProps = {
  stream: MediaStream | null;
  videoError: string | null;
  audioError: boolean;
  mediaSupported: boolean;
  permissionDenied: boolean;
  getMedia: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  isAudioOn: boolean;
  isVideoOn: boolean;
};

const MediaContext = createContext<MediaContextProps | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<boolean>(false);
  const [mediaSupported, setMediaSupported] = useState<boolean>(true);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);

  const getMedia = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("Media Stream Obtained:", mediaStream);
        setStream(mediaStream);
      } catch (error: any) {
        console.error("Error accessing media devices:", error);
        handleMediaError(error);
      }
    } else {
      setMediaSupported(false);
      setVideoError("Your device or browser does not support media access.");
    }
  };

  const handleMediaError = (error: Error) => {
    if (error.name === "NotFoundError") {
      setVideoError("No camera found");
    } else if (error.name === "NotReadableError") {
      setAudioError(true);
    } else if (
      error.name === "PermissionDeniedError" ||
      error.name === "NotAllowedError"
    ) {
      setPermissionDenied(true);
      setVideoError("Permission to access camera and microphone denied.");
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = !isVideoOn));
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = !isAudioOn));
      setIsAudioOn(!isAudioOn);
    }
  };

  return (
    <MediaContext.Provider
      value={{
        stream,
        videoError,
        audioError,
        mediaSupported,
        permissionDenied,
        getMedia,
        toggleVideo,
        toggleAudio,
        isAudioOn,
        isVideoOn,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
};
