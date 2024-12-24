import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSocket } from "./SocketContext";
import { Room } from "@interfaces/stream";
import PeerService from "../services/peer";
import { useMedia } from "./MediaContext";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

// Sockets Events

// Create a context to manage authentication-related data and functions
const RoomContext = createContext<{
  room: Room | undefined;
  setRoomHandler: (room: Room) => void;
}>({
  room: undefined,
  setRoomHandler: () => {},
});

// Create a hook to access the RoomContext
const useRoom = () => useContext(RoomContext);

// Create a component that provides Room authentication-related data and functions
const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [room, setRoom] = useState<Room | undefined>(undefined);

  const { socket } = useSocket();
  const { user } = useAuth();
  const {
    stream,
    peers,
    addPeerHandler,
    removePeerHandler,
    addPeerStreamHandler,
    setRemoteStreamHandler,
  } = useMedia();

  const navigate = useNavigate();

  const Peer = new PeerService({
    socket,
    localStream: stream,
    peers,
    addPeerHandler,
    removePeerHandler,
    addPeerStreamHandler,
    setRemoteStreamHandler,
  });

  const setRoomHandler = (room: Room) => {
    setRoom(room);
  };

  const userJoinedHandler = ({
    username,
    userId,
  }: {
    username: string;
    userId: string;
  }) => {
    toast.info(username + "joined the room!");

    // Peer.getOffer(userId).then((offer) => {
    //   socket!.emit("offer", { offer, userId: userId });
    // });
  };

  useEffect(() => {
    if (room && room.participants.length > 0 && socket) {
      room.participants.forEach((participantId) => {
        if (participantId !== user?._id) {
          // Create and send an offer
          Peer.getOffer(participantId).then((offer) => {
            socket.emit("offer", { offer, userId: participantId });
          });
        }
      });
    }
  }, [room, socket]);

  const leaveRoomHandler = () => {
    if (room && socket) {
      // Or emit synchronously
      socket.emit("leave-room", {
        roomId: room.roomId,
        user: user,
      });
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("user:joined", userJoinedHandler);

    // Handle incoming offer
    socket.on("offer", async (offer, senderSocketId) => {
      const answer = await Peer.getAnswer(senderSocketId, offer);
      socket.emit("answer", { answer, senderSocketId: senderSocketId });
    });

    // Handle incoming answer
    socket.on("answer", async (answer, senderSocketId) => {
      await Peer.setLocalDescription(senderSocketId, answer);
    });

    // Handle incoming ICE candidates
    socket.on("ice-candidate", async (candidate, senderId) => {
      await Peer.handleNewICECandidate(senderId, candidate);
    });

    socket.on("user:leave", (data) => {
      toast.info(data.username + " left the room!");
    });

    socket.on("admin:leave", () => {
      toast("Admin left the room!", {
        duration: 5000,
        important: true,
        description: "Room will close in a few seconds.",
      });
      setRoom(undefined);
      navigate("/workspace/stream");
    });

    // Listen for page unload or component unmount
    window.addEventListener("beforeunload", leaveRoomHandler);

    return () => {
      // Clean up socket listeners
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user:joined", userJoinedHandler);
      socket.off("admin:leave");
      socket.off("user:leave");

      leaveRoomHandler(); // Call on component unmount
      window.removeEventListener("beforeunload", leaveRoomHandler);
    };
  }, [socket, room, user]);

  return (
    <RoomContext.Provider
      value={{
        room,
        setRoomHandler,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { RoomContext, RoomProvider, useRoom };
