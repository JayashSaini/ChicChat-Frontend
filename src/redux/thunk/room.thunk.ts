import { AppDispatch, RootState } from "../store";
import { toast } from "sonner";
import {
  addParticipant,
  removeParticipant,
  RoomState,
  setParticipants,
} from "../slice/room.slice";
import { UserInterface } from "@interfaces/user";
import { MediaContext } from "../slice/media.slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SocketState } from "@redux/slice/socket.slice";
import { MediaState } from "@interfaces/stream";

// Peer Configuration for WebRTC
const configuration: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

// Track peer connections and ICE candidate queues
const peerConnections: Record<string, RTCPeerConnection> = {};
const candidateQueue: Record<string, RTCIceCandidate[]> = {};

export const handleUserJoined =
  ({
    user,
    socketId,
    myUserId,
  }: {
    user: UserInterface;
    socketId: string;
    myUserId: string;
  }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { participants } = getState().room;

    // Avoid adding duplicate users
    if (participants.some((p) => p._id === user._id)) return;

    // Add the user to the participants list
    dispatch(
      addParticipant({
        _id: user._id,
        user: user,
        stream: null,
        isPin: false,
        mediaState: {
          audioEnabled: false,
          videoEnabled: false,
        },
      })
    );
    console.log("handle user joined");

    // Call createOffer
    await dispatch(
      createOffer({ socketId, userId: user._id.toString(), myUserId })
    );

    toast.info(`${user.username} joined room`);
  };

export const handleUserLeave =
  ({ userId }: { userId: string }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { participants } = getState().room;

    const participant = participants.find((p) => p._id === userId);
    if (participant) {
      toast.info(`${participant.user.username} left the room`);
    }

    // Remove the participant
    dispatch(removeParticipant(userId));

    // Close peer connection for the leaving user
    const peerConnection = peerConnections[userId];
    if (peerConnection) {
      peerConnection.close();
      delete peerConnections[userId];
    }
  };

// Thunk for creating an offer
export const createOffer = createAsyncThunk<
  void,
  { socketId: string; userId: string; myUserId: string },
  { state: { room: RoomState; media: MediaContext; socket: SocketState } }
>(
  "room/createOffer",
  async ({ socketId, userId, myUserId }, { dispatch, getState }) => {
    const state = getState();
    const { participants } = state.room;
    const { mediaStream, mediaState } = state.media;
    const { socket } = state.socket;

    const peerConnection = new RTCPeerConnection(configuration);
    peerConnections[socketId] = peerConnection;

    // Media stream handling (replace with actual media stream logic)
    mediaStream
      ?.getTracks()
      .forEach((track) => peerConnection.addTrack(track, mediaStream));

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", event.candidate, socketId, myUserId);
      }
    };

    // Add remote stream when received
    peerConnection.ontrack = (event: RTCTrackEvent) => {
      const remoteStream = event.streams[0];
      dispatch(
        setParticipants(
          participants.map((p) => {
            if (p?._id?.toString() === userId.toString()) {
              return { ...p, stream: remoteStream };
            }
            return p;
          })
        )
      );
    };

    // Process buffered ICE candidates
    if (candidateQueue[socketId]) {
      candidateQueue[socketId].forEach((candidate) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      });
      delete candidateQueue[socketId];
    }

    // Send offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket?.emit("offer", offer, socketId, {
      userId: myUserId,
      mediaState: {
        audioEnabled: mediaState?.audioEnabled,
        videoEnabled: mediaState?.videoEnabled,
      },
    });
  }
);
export const offer = createAsyncThunk<
  void,
  {
    offer: RTCSessionDescriptionInit;
    socketId: string;
    credentials: { userId: string; mediaState: MediaState };
    myUserId: string;
  },
  {
    state: {
      room: RoomState;
      media: MediaContext;
      socket: SocketState;
    };
  }
>(
  "room/createOffer",
  async (
    { offer, socketId, credentials, myUserId },
    { dispatch, getState }
  ) => {
    const state = getState();
    const { mediaStream, mediaState } = state.media;
    const { socket } = state.socket;
    const { participants } = state.room;

    if (!socket) return;

    const peerConnection = new RTCPeerConnection(configuration);
    peerConnections[socketId] = peerConnection;

    // Add local media stream to peer connection
    mediaStream?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, mediaStream);
    });

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate, socketId, myUserId);
      }
    };

    // Add remote stream when received
    peerConnection.ontrack = (event: RTCTrackEvent) => {
      const remoteStream = event.streams[0];

      dispatch(
        setParticipants(
          participants.map((p) => {
            if (p._id?.toString() == credentials.userId.toString()) {
              return {
                ...p,
                stream: remoteStream,
                mediaState: credentials.mediaState,
              };
            }
            return p;
          })
        )
      );
    };

    // Set remote description
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // Process buffered ICE candidates
    if (candidateQueue[socketId]) {
      candidateQueue[socketId].forEach((candidate) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      });
      delete candidateQueue[socketId];
    }

    // Create and send answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, socketId, {
      userId: myUserId,
      mediaState: {
        audioEnabled: mediaState?.audioEnabled,
        videoEnabled: mediaState?.videoEnabled,
      },
    });
  }
);

export const handleAnswer = createAsyncThunk<
  void,
  {
    answer: RTCSessionDescriptionInit;
    from: string;
    userId: string;
    mediaState: {
      audioEnabled: boolean;
      videoEnabled: boolean;
    };
  },
  { state: { room: RoomState } }
>(
  "room/createAnswer",
  async ({ answer, from, userId, mediaState }, { dispatch, getState }) => {
    const state = getState();
    const { participants } = state.room;

    const peerConnection = peerConnections[from];
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );

    console.log("Participants Media State is : ", mediaState, userId);
    // Dispatch media state update
    dispatch(
      setParticipants(
        participants.map((p) => {
          if (p._id?.toString() == userId.toString()) {
            return {
              ...p,
              mediaState: {
                audioEnabled: mediaState?.audioEnabled,
                videoEnabled: mediaState?.videoEnabled,
              },
            };
          }
          return p;
        })
      )
    );
  }
);

export const handleIceCandidate = createAsyncThunk<
  void,
  {
    candidate: RTCIceCandidate;
    from: string;
  },
  { state: { room: RoomState } }
>("room/handleIceCandidate", async ({ candidate, from }) => {
  const peerConnection = peerConnections[from];
  if (peerConnection?.remoteDescription) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } else {
    if (!candidateQueue[from]) {
      //localhost:5173/
      candidateQueue[from] = [];
    }
    candidateQueue[from].push(candidate);
  }
});

export const updateParticipantMedia = createAsyncThunk<
  void,
  {
    userId: string;
    mediaState: MediaState;
  },
  { state: { room: RoomState } }
>(
  "room/updateParticipantMedia",
  async ({ userId, mediaState }, { dispatch, getState }) => {
    const { participants } = getState().room;

    // Dispatch media state update for the participant
    dispatch(
      setParticipants(
        participants.map((p) => {
          if (p._id?.toString() == userId.toString()) {
            return { ...p, mediaState: mediaState };
          }
          return p;
        })
      )
    );
  }
);
