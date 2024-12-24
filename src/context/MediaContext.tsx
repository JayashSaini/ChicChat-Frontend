import React, { createContext, useState, useContext, useEffect } from "react";

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
  peers: {
    socketId: string;
    RTCPeerConnection: RTCPeerConnection;
  }[];
  peerMediaStream: {
    socketId: string;
    MediaStream: MediaStream;
  }[];
  closeAllConnections: () => void;
  removePeerHandler: (socketId: string) => void;
  addPeerHandler: (socketId: string, peer: RTCPeerConnection) => void;
  addPeerStreamHandler: (socketId: string, stream: MediaStream) => void;

  // for testing
  remoteStream: MediaStream | null;
  setRemoteStreamHandler: (stream: MediaStream) => void;
};

const MediaContext = createContext<MediaContextProps | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<boolean>(false);
  const [mediaSupported, setMediaSupported] = useState<boolean>(true);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(false);
  // For Peers Media
  const [peers, setPeers] = useState<
    {
      socketId: string;
      RTCPeerConnection: RTCPeerConnection;
    }[]
  >([]);
  // const PeerMedia: { [key: string]: MediaStream } = {};
  const [peerMediaStream, setPeerMediaStream] = useState<
    {
      socketId: string;
      MediaStream: MediaStream;
    }[]
  >([]);

  // just for testing
  const setRemoteStreamHandler = (stream: MediaStream) => {
    setRemoteStream(stream);
  };

  const getMedia = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

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
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled; // Toggle the current state of the track
      });
      setIsVideoOn((prevState) => !prevState); // Update the state based on the previous state
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled; // Toggle the current state of the track
      });
      setIsAudioOn((prevState) => !prevState); // Update the state based on the previous state
    }
  };

  const addPeerHandler = (socketId: string, peer: RTCPeerConnection) => {
    setPeers((prevPeers) => {
      // Check if the peer already exists
      const existingPeer = prevPeers.find((p) => p.socketId === socketId);
      if (existingPeer) {
        console.warn(`Peer with socketId ${socketId} already exists.`);
        return prevPeers; // Return the unchanged array if already exists
      }
      // Add new peer
      return [...prevPeers, { socketId, RTCPeerConnection: peer }];
    });
  };

  const removePeerHandler = (socketId: string) => {
    setPeers((prevPeers) => {
      // Filter out the peer with the given socketId
      return prevPeers.filter((peer) => peer.socketId !== socketId);
    });
  };

  const addPeerStreamHandler = (socketId: string, stream: MediaStream) => {
    setPeerMediaStream((prevStreams) => {
      const existingPeerStream = prevStreams.find(
        (peerStream) => peerStream.socketId === socketId
      );

      if (existingPeerStream) {
        // Update the existing MediaStream for the socketId
        return prevStreams.map((peerStream) =>
          peerStream.socketId === socketId
            ? { ...peerStream, MediaStream: stream }
            : peerStream
        );
      }
      // Add a new MediaStream entry for the socketId
      return [...prevStreams, { socketId, MediaStream: stream }];
    });
  };

  // const closePeerConnection = (socketId: string) => {
  //   setPeers((prevPeers) => {
  //     const peer = prevPeers.find((peer) => peer.socketId === socketId);
  //     if (peer) {
  //       peer.RTCPeerConnection.close();
  //     }
  //     // Remove the peer from the list
  //     return prevPeers.filter((peer) => peer.socketId !== socketId);
  //   });
  // };

  const closeAllConnections = () => {
    // Close all active peer connections
    setPeers((prevPeers) => {
      prevPeers.forEach((peer) => {
        peer.RTCPeerConnection.close();
      });
      return []; // Clear all peers
    });

    setPeerMediaStream([]); // Clear all peer media streams
  };

  useEffect(() => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      if (videoTracks.length > 0) {
        setIsVideoOn(videoTracks[0].enabled); // Set based on track's state
      }
      if (audioTracks.length > 0) {
        setIsAudioOn(audioTracks[0].enabled); // Set based on track's state
      }
    }
  }, [stream]);

  useEffect(() => {
    getMedia();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      closeAllConnections(); // Ensure all peer connections are closed
    };
  }, []);

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
        peers,
        addPeerHandler,
        removePeerHandler,
        closeAllConnections,
        peerMediaStream,
        addPeerStreamHandler,
        remoteStream,
        setRemoteStreamHandler,
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
