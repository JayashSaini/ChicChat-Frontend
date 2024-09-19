// class PeerService {
//   private peer: RTCPeerConnection | null = null;
//   private localStream: MediaStream | null = null; // Store local media stream (audio/video)

//   // Initialize the peer connection and configure ICE servers
//   initializePeerConnection(): void {
//     if (!this.peer) {
//       this.peer = new RTCPeerConnection({
//         iceServers: [
//           {
//             urls: [
//               "stun:stun.l.google.com:19302",
//               "stun:global.stun.twilio.com:3478",
//             ],
//           },
//         ],
//       });

//       // Set up ICE handling
//       this.peer.onicecandidate = (event: RTCPeerConnectionIceEvent): void => {
//         if (event.candidate) {
//           console.log("New ICE candidate", event.candidate);
//           // Send the candidate to the remote peer via signaling server
//           this.sendCandidateToServer(event.candidate);
//         }
//       };

//       // Set up track handling (e.g., receiving remote media stream)
//       this.peer.ontrack = (event: RTCTrackEvent): void => {
//         const remoteStream = event.streams[0];
//         console.log("Remote stream received", remoteStream);
//         // Attach remote stream to the video/audio element in the UI
//         this.attachRemoteStreamToUI(remoteStream);
//       };
//     }
//   }

//   // Add the local media stream to the peer connection and UI
//   async addLocalStream(stream: MediaStream): Promise<void> {
//     this.localStream = stream;

//     // Ensure peer connection is initialized
//     if (!this.peer) {
//       this.initializePeerConnection();
//     }

//     // Add local media tracks (audio/video) to the peer connection
//     stream.getTracks().forEach((track: MediaStreamTrack) => {
//       this.peer!.addTrack(track, stream); // Add track to the peer connection
//     });

//     // Attach the local stream to a local video element (e.g., in the UI)
//     this.attachLocalStreamToUI(stream);
//   }

//   // Generate and send an offer
//   async createOffer(): Promise<RTCSessionDescriptionInit | undefined> {
//     try {
//       if (!this.peer) this.initializePeerConnection();
//       const offer = await this.peer!.createOffer();
//       await this.peer!.setLocalDescription(offer);
//       return offer;
//     } catch (error) {
//       console.error("Error creating offer:", error);
//     }
//   }

//   // Set remote offer and create an answer
//   async handleRemoteOffer(
//     offer: RTCSessionDescriptionInit
//   ): Promise<RTCSessionDescriptionInit | undefined> {
//     try {
//       if (!this.peer) this.initializePeerConnection();
//       await this.peer!.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await this.peer!.createAnswer();
//       await this.peer!.setLocalDescription(answer);
//       return answer;
//     } catch (error) {
//       console.error("Error handling remote offer:", error);
//     }
//   }

//   // Set the remote answer once received
//   async handleRemoteAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
//     try {
//       if (this.peer) {
//         await this.peer!.setRemoteDescription(
//           new RTCSessionDescription(answer)
//         );
//       }
//     } catch (error) {
//       console.error("Error handling remote answer:", error);
//     }
//   }

//   // Close the peer connection (cleanup)
//   closeConnection(): void {
//     if (this.peer) {
//       this.peer.close();
//       this.peer = null;
//     }
//     this.localStream = null;
//   }

//   // Send ICE candidate to the server for signaling
//   sendCandidateToServer(candidate: RTCIceCandidate | null): void {
//     if (candidate) {
//       // Logic to send the ICE candidate to the signaling server
//       console.log("Sending candidate to server:", candidate);
//     }
//   }

//   // Attach remote stream to the UI (e.g., a video element)
//   attachRemoteStreamToUI(stream: MediaStream): void {
//     const remoteVideoElement = document.getElementById(
//       "remoteVideo"
//     ) as HTMLVideoElement;
//     if (remoteVideoElement) {
//       remoteVideoElement.srcObject = stream;
//     }
//   }

//   // Attach local stream to the UI (e.g., a video element for preview)
//   attachLocalStreamToUI(stream: MediaStream): void {
//     const localVideoElement = document.getElementById(
//       "localVideo"
//     ) as HTMLVideoElement;
//     if (localVideoElement) {
//       localVideoElement.srcObject = stream;
//     }
//   }
// }

// export default new PeerService();
