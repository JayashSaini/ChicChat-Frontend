import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket, useAuth } from "@context/index";
import { toast } from "sonner";
import { UserInterface } from "@interfaces/user";
import Button from "@components/Button";
import UserTile from "@components/video/ParticipantTile";
import { useMedia } from "@context/index";

const RoomJoinRequest: React.FC = () => {
  // State to manage the loading state while waiting for room join approval
  const [joinRoomLoader, setJoinRoomLoader] = useState<boolean>(false);

  // Media context hooks for stream and media features
  const { stream, media } = useMedia();

  // Auth and socket context hooks for user info and socket connection
  const { user } = useAuth();
  const { socket } = useSocket();

  // Retrieve roomId from URL parameters and setup navigate for routing
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Handle socket events for room join errors
  const handleRoomError = (error: { message: string }) => {
    toast.error(error.message || "An error occurred while joining the room.");
  };

  // Handle successful room join approval
  const roomJoinApprovedHandler = ({ roomId }: { roomId: string }) => {
    setJoinRoomLoader(false);
    toast.success("You have successfully joined the room!");

    // Navigate to the room after successful join
    navigate("/workspace/stream/room/" + roomId);
  };

  // Handle room join rejection, display a message and navigate away
  const roomJoinRejectedHandler = ({ message }: { message: string }) => {
    setJoinRoomLoader(false);
    navigate("/workspace/stream");
    toast.info(message);
  };

  // Function to emit room join request to the server
  const joinRoom = async (roomId: string, user: UserInterface) => {
    if (!socket) return;

    setJoinRoomLoader(true);
    socket.emit("adminJoinRequestEvent", { roomId, user, socketId: socket.id });
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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-backgroundSecondary text-textPrimary px-4">
      <div className="relative w-full max-w-3xl rounded-lg">
        {/* Video Container */}
        <div className="max-w-screen-md w-full h-[500px] bg-backgroundTertiary rounded-lg overflow-hidden flex items-center justify-center">
          {media.mediaError ? (
            <div className="text-center text-xl text-error h-full flex items-center justify-center">
              {media.mediaError || "Media access not supported on your device"}
            </div>
          ) : (
            user &&
            user?.avatar && (
              <UserTile
                avatar={user?.avatar?.url}
                isAudioOn={media.isAudioOn}
                isVideoOn={media.isVideoOn}
                stream={stream}
                togglePin={() => {}}
                username={user?.username}
                isPin={false}
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
            onClick={media.toggleVideo}
            severity={media.isVideoOn ? "secondary" : "danger"}
            disabled={media.mediaError ? true : false}
            size="small"
          >
            {media.isVideoOn ? "Disable Camera" : "Enable Camera"}
          </Button>

          <Button
            onClick={media.toggleAudio}
            severity={media.isAudioOn ? "secondary" : "danger"}
            disabled={media.mediaError ? true : false}
            size="small"
          >
            {media.isAudioOn ? `Mute Mic` : "Unmute Mic"}
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
