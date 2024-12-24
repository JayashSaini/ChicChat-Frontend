import React, { useEffect, useRef, useState } from "react";
import { useMedia } from "@context/MediaContext";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { useSocket } from "@context/SocketContext";
import { toast } from "sonner";
import { UserInterface } from "@interfaces/user";
import Button from "@components/Button";
import UserTile from "@components/stream/UserTile";

const RequestToJoinRoom: React.FC = () => {
  // State Management
  const [joinRoomLoader, setJoinRoomLoader] = useState<boolean>(false);

  // Media context hooks
  const {
    stream,
    videoError,
    audioError,
    mediaSupported,
    permissionDenied,
    toggleVideo,
    toggleAudio,
    isAudioOn,
    isVideoOn,
  } = useMedia();

  // Auth and socket context hooks
  const { user } = useAuth();
  const { socket } = useSocket();

  // Routing and parameters
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Handlers for socket events
  const handleRoomError = (error: { message: string }) => {
    toast.error(error.message || "An error occurred while joining the room.");
  };

  const roomJoinApprovedHandler = ({ roomId }: { roomId: string }) => {
    setJoinRoomLoader(false);
    toast.success("You have successfully joined the room!");

    navigate("/workspace/stream/room/" + roomId);
  };

  const roomJoinRejectedHandler = ({ message }: { message: string }) => {
    setJoinRoomLoader(false);

    navigate("/workspace/stream");
    toast.info(message);
  };

  // Joining Room Logic
  const joinRoom = async (roomId: string, user: UserInterface) => {
    if (!socket) return;

    setJoinRoomLoader(true);
    socket.emit("adminJoinRequestEvent", { roomId, user, socketId: socket.id });
  };

  // Effect for initializing socket listeners and media permissions
  useEffect(() => {
    if (!socket) return;

    // Socket event listeners
    socket.on("room:error", handleRoomError);
    socket.on("room:join:approved", roomJoinApprovedHandler);
    socket.on("room:join:rejected", roomJoinRejectedHandler);

    return () => {
      socket.off("room:join:rejected", roomJoinRejectedHandler);
      socket.off("room:join:approved", roomJoinApprovedHandler);
      socket.off("room:error", handleRoomError);
    };
  }, [socket]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-backgroundSecondary text-textPrimary px-4">
      <div className="relative w-full max-w-3xl rounded-lg">
        {/* Video Container */}
        <div className="max-w-screen-md w-full h-[500px] bg-backgroundTertiary rounded-lg overflow-hidden flex items-center justify-center">
          {videoError || !mediaSupported ? (
            <div className="text-center text-xl text-error h-full flex items-center justify-center">
              {videoError || "Media access not supported on your device"}
            </div>
          ) : (
            <UserTile
              avatar={user!?.avatar?.url}
              isAudioOn={isAudioOn}
              isVideoOn={isVideoOn}
              stream={stream}
              togglePin={() => {}}
              username={user!?.username}
              isPin={false}
            />
          )}
        </div>

        {/* Admin Response loader */}
        {joinRoomLoader && (
          <div className="w-full h-1 bg-gray-200 relative overflow-hidden mt-2">
            <div className="absolute w-1/3 h-full bg-blue-500 animate-loader"></div>
          </div>
        )}

        {/* Media Access Notification */}
        {permissionDenied && (
          <div className="p-4 bg-red-600 text-white rounded-md mt-4">
            <p className="text-lg">
              Please allow media access to use video and audio features. Go to
              your browser settings to enable access for this site.
            </p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <Button
            onClick={toggleVideo}
            severity={isVideoOn ? "secondary" : "danger"}
            disabled={!!videoError || !mediaSupported || permissionDenied}
            size="small"
          >
            {isVideoOn ? "Disable Camera" : "Enable Camera"}
          </Button>

          <Button
            onClick={toggleAudio}
            severity={isAudioOn ? "secondary" : "danger"}
            disabled={audioError || !mediaSupported || permissionDenied}
            size="small"
          >
            {isAudioOn ? `Mute Mic` : "Unmute Mic"}
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

export default RequestToJoinRoom;
