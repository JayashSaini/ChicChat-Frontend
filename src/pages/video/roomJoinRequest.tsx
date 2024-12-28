import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket, useAuth } from "@context/index";
import { toast } from "sonner";
import { UserInterface } from "@interfaces/user";
import Button from "@components/Button";
import ParticipantTile from "@components/video/ParticipantTile";
import { useRoom } from "@context/index";

const RoomJoinRequest: React.FC = () => {
  // State to manage the loading state while waiting for room join approval
  const [joinRoomLoader, setJoinRoomLoader] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Media context hooks for stream and media features
  const { mediaStream, mediaState } = useRoom();

  // Auth and socket context hooks for user info and socket connection
  const { user } = useAuth();
  const { socket } = useSocket();

  // Retrieve roomId from URL parameters and setup navigate for routing
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Handle socket events for room join errors
  const handleRoomError = (error: { message: string }) => {
    toast.error(error.message || "An error occurred while joining the room.");

    navigate("/workspace/video");
  };

  // Handle successful room join approval
  const roomJoinApprovedHandler = ({ roomId }: { roomId: string }) => {
    setJoinRoomLoader(false);
    toast.success("You have successfully joined the room!");

    // Navigate to the room after successful join
    navigate("/workspace/video/room/" + roomId);
  };

  // Handle room join rejection, display a message and navigate away
  const roomJoinRejectedHandler = ({ message }: { message: string }) => {
    setJoinRoomLoader(false);
    toast.info(message);

    navigate("/workspace/video");
  };

  // Function to emit room join request to the server
  const joinRoom = async (roomId: string, user: UserInterface) => {
    if (!socket) return;

    setJoinRoomLoader(true);
    socket.emit("admin:join-request", { roomId, user, socketId: socket.id });

    const id = setTimeout(() => {
      toast.info(
        "Admin is taking longer than expected. Please try again later."
      );
      navigate("/workspace/video");
    }, 10000);

    // Store timeoutId in state
    setTimeoutId(id);
  };

  // Effect to setup socket listeners and clean up on unmount
  useEffect(() => {
    if (!socket) return;

    // Socket event listeners for room join approval, rejection, and error handling
    socket.on("room:error", handleRoomError);
    socket.on("room:join:approved", roomJoinApprovedHandler);
    socket.on("room:join:rejected", roomJoinRejectedHandler);

    // Cleanup event listeners on component unmount
    return () => {
      socket.off("room:join:rejected", roomJoinRejectedHandler);
      socket.off("room:join:approved", roomJoinApprovedHandler);
      socket.off("room:error", handleRoomError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // Effect to clean up timeout when component unmounts or when timeoutId changes
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Cleanup timeout on unmount or change
      }
    };
  }, [timeoutId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-backgroundSecondary text-textPrimary px-4">
      <div className="relative w-full max-w-3xl rounded-lg">
        {/* Video Container */}
        <div className="max-w-screen-md w-full h-[500px] bg-backgroundTertiary rounded-lg overflow-hidden flex items-center justify-center">
          {mediaState.error ? (
            <div className="text-center text-xl text-error h-full flex items-center justify-center">
              {mediaState.error || "Media access not supported on your device"}
            </div>
          ) : (
            user &&
            user?.avatar && (
              <ParticipantTile
                avatar={user?.avatar?.url}
                isAudioOn={mediaState.audioEnabled}
                isVideoOn={mediaState.videoEnabled}
                stream={mediaStream}
                username={user?.username}
              />
            )
          )}
        </div>

        {/* Admin Response Loader */}
        {joinRoomLoader && (
          <div className="w-full h-1 bg-gray-200 relative overflow-hidden mt-2">
            <div className="absolute w-1/3 h-full bg-blue-500 animate-loader"></div>
          </div>
        )}

        {/* Control Buttons for video and audio */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <Button
            onClick={mediaState.toggleVideo}
            severity={mediaState.videoEnabled ? "secondary" : "danger"}
            disabled={mediaState.error ? true : false}
            size="small"
          >
            {mediaState.videoEnabled ? "Disable Camera" : "Enable Camera"}
          </Button>

          <Button
            onClick={mediaState.toggleAudio}
            severity={mediaState.audioEnabled ? "secondary" : "danger"}
            disabled={mediaState.error ? true : false}
            size="small"
          >
            {mediaState.audioEnabled ? `Mute Mic` : "Unmute Mic"}
          </Button>

          <Button
            onClick={() => joinRoom(roomId!, user!)}
            disabled={joinRoomLoader}
            size="small"
          >
            {joinRoomLoader ? "Waiting..." : "Request to Join"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomJoinRequest;
