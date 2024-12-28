import React, { createContext, useEffect, useState } from "react";
import { Room } from "@interfaces/stream";
import { useSocket } from ".";
import { UserInterface } from "@interfaces/user";
import { toast } from "sonner";

interface MediaState {
  error: string | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
  toggleVideo: () => void;
  toggleAudio: () => void;
}

// Create a context to manage authentication-related data and functions
const RoomContext = createContext<{
  room: Room | undefined;
  participants: UserInterface[];
  mediaStream: MediaStream | null;
  mediaState: MediaState;
  setRoomHandler: (room: Room) => void;
  setParticipantsHandler: (participants: UserInterface[]) => void;
}>({
  room: undefined,
  participants: [],
  mediaStream: null,
  mediaState: {
    error: null,
    audioEnabled: false,
    videoEnabled: false,
    toggleVideo: () => {},
    toggleAudio: () => {},
  },
  setRoomHandler: () => {},
  setParticipantsHandler: () => {},
});

// Create a component that provides Room authentication-related data and functions
const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [participants, setParticipants] = useState<UserInterface[]>([]);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);

  const { socket } = useSocket();

  const setRoomHandler = (room: Room) => {
    setRoom(room);
    console.log("room : ", room);
  };
  const setParticipantsHandler = (participants: UserInterface[]) => {
    setParticipants(participants);
  };

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

  // socket event handlers
  const handleUserJoined = ({ user }: { user: UserInterface }) => {
    setParticipants((prev) => {
      // check user is already exits
      if (prev.some((p) => p._id === user._id)) return prev;
      return [...prev, user];
    });
    toast.info(`${user.username} joined room`);
  };

  const handleUserLeave = ({ userId }: { userId: string }) => {
    setParticipants((prev) => {
      const array = prev.filter((p) => {
        if (p._id == userId) {
          toast.info(`${p.username} leaved room`);
        }
        return p._id !== userId;
      });
      return array;
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("user:joined", handleUserJoined);
    socket.on("user:leave", handleUserLeave);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("user:leave", handleUserLeave);
    };
  }, [socket]);

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

  return (
    <RoomContext.Provider
      value={{
        room,
        participants,
        mediaStream,
        mediaState: {
          error,
          audioEnabled,
          videoEnabled,
          toggleVideo,
          toggleAudio,
        },
        setRoomHandler,
        setParticipantsHandler,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { RoomContext, RoomProvider };
