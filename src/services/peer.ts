class PeerService {
  private socket: any;
  private localStream: MediaStream | null;
  private addPeerHandler: (socketId: string, peer: RTCPeerConnection) => void;
  private removePeerHandler: (socketId: string) => void;
  private addPeerStreamHandler: (socketId: string, stream: MediaStream) => void;
  private setRemoteStreamHandler: (stream: MediaStream) => void;
  private peers: { socketId: string; RTCPeerConnection: RTCPeerConnection }[];

  constructor({
    socket,
    localStream,
    peers,
    addPeerHandler,
    removePeerHandler,
    addPeerStreamHandler,
    setRemoteStreamHandler,
  }: {
    socket: any;
    localStream: MediaStream | null;
    peers: { socketId: string; RTCPeerConnection: RTCPeerConnection }[];
    addPeerHandler: (socketId: string, peer: RTCPeerConnection) => void;
    removePeerHandler: (socketId: string) => void;
    setRemoteStreamHandler: (stream: MediaStream) => void;
    addPeerStreamHandler: (socketId: string, stream: MediaStream) => void;
  }) {
    this.socket = socket;
    this.localStream = localStream;
    this.peers = peers;
    this.addPeerHandler = addPeerHandler;
    this.removePeerHandler = removePeerHandler;
    this.addPeerStreamHandler = addPeerStreamHandler;
    this.setRemoteStreamHandler = setRemoteStreamHandler;
  }

  createPeerConnection(socketId: string): RTCPeerConnection {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit("ice-candidate", event.candidate, socketId);
      }
    };

    peer.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (remoteStream) {
        this.setRemoteStreamHandler(remoteStream);
        this.addPeerStreamHandler(socketId, remoteStream);
      }
    };

    peer.oniceconnectionstatechange = () => {
      if (
        peer.iceConnectionState === "disconnected" ||
        peer.iceConnectionState === "failed"
      ) {
        this.closePeerConnection(socketId);
      }
    };

    this.addPeerHandler(socketId, peer);
    return peer;
  }

  async getOffer(
    socketId: string
  ): Promise<RTCSessionDescriptionInit | undefined> {
    try {
      const peer = this.createPeerConnection(socketId);

      if (!this.localStream) {
        throw new Error("Local stream is not available");
      }

      this.localStream.getTracks().forEach((track) => {
        peer.addTrack(track, this.localStream!);
      });

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
      this.closePeerConnection(socketId);
      return undefined;
    }
  }

  async getAnswer(
    socketId: string,
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit | undefined> {
    try {
      const peer = this.createPeerConnection(socketId);
      await peer.setRemoteDescription(offer);

      if (!this.localStream) {
        throw new Error("Local stream is not available");
      }

      this.localStream.getTracks().forEach((track) => {
        peer.addTrack(track, this.localStream!);
      });

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error("Error creating answer:", error);
      this.closePeerConnection(socketId);
      return undefined;
    }
  }

  async setLocalDescription(
    socketId: string,
    description: RTCSessionDescriptionInit
  ): Promise<void> {
    try {
      const peer = this.peers.find((peer) => peer.socketId === socketId);
      if (!peer) {
        throw new Error("Peer not found");
      }

      if (peer.RTCPeerConnection.signalingState === "stable") {
        console.warn("Connection already in stable state");
        return;
      }

      await peer.RTCPeerConnection.setRemoteDescription(description);
    } catch (error) {
      console.error("Error setting remote description:", error);
      this.closePeerConnection(socketId);
    }
  }

  async handleNewICECandidate(
    socketId: string,
    candidate: RTCIceCandidateInit
  ): Promise<void> {
    try {
      const peer = this.peers.find((peer) => peer.socketId === socketId);
      if (!peer) {
        throw new Error("Peer not found");
      }

      await peer.RTCPeerConnection.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error("Error handling ICE candidate:", error);
    }
  }

  closePeerConnection(socketId: string) {
    const peer = this.peers.find((peer) => peer.socketId === socketId);
    if (peer) {
      peer.RTCPeerConnection.close();
      this.removePeerHandler(socketId);
    }
  }

  closeAllConnections() {
    this.peers.forEach((peer) => {
      this.closePeerConnection(peer.socketId);
    });
  }
}

export default PeerService;
