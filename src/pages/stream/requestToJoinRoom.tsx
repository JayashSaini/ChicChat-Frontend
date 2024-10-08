import React, { useEffect, useRef } from "react";
import { useMedia } from "@context/MediaContext";
import { useRoom } from "@context/RoomContext";
import { useParams } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

const RequestToJoinRoom: React.FC = () => {
  const {
    stream,
    getMedia,
    videoError,
    audioError,
    mediaSupported,
    permissionDenied,
    toggleVideo,
    toggleAudio,
    isAudioOn,
    isVideoOn,
  } = useMedia();
  const { joinRoom, joinRoomLoader } = useRoom();
  const { roomId } = useParams();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null); // Create a ref for the video element

  const handleJoinRoom = () => {
    joinRoom(roomId!, user!);
  };

  // Use useEffect to set the srcObject
  useEffect(() => {
    getMedia(); // Call getMedia to initiate media access
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); // Stop the tracks on cleanup
      }
    };
  }, []); // Only run once when the component mounts

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream; // Set the video element's source
    }
  }, [stream]); // Run this effect when the stream changes

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
            <video
              ref={videoRef} // Attach the ref to the video element
              autoPlay
              muted
              className="w-full h-full object-cover"
            ></video>
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
          <button
            onClick={toggleVideo}
            className={`text-sm w-[180px] py-2 rounded-full transition duration-300 ease-in-out ${
              isVideoOn ? "bg-red-500 text-white" : "bg-[#ffc107cc] text-black"
            } hover:bg-opacity-90`}
            disabled={!!videoError || !mediaSupported || permissionDenied}
          >
            {isVideoOn ? "Turn Off Video" : "Turn On Video"}
          </button>

          <button
            onClick={toggleAudio}
            className={`text-sm w-[180px] py-2 rounded-full transition duration-300 ease-in-out ${
              isAudioOn ? "bg-red-500 text-white" : "bg-[#ffc107cc] text-black"
            } hover:bg-opacity-90`}
            disabled={audioError || !mediaSupported || permissionDenied}
          >
            {isAudioOn ? "Turn Off Audio" : "Turn On Audio"}
          </button>

          <button
            className="text-sm w-[180px] py-2 rounded-full transition duration-300 ease-in-out bg-sky-600 text-white"
            onClick={handleJoinRoom}
            disabled={joinRoomLoader}
          >
            {joinRoomLoader ? "Waiting..." : "Request to Join"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestToJoinRoom;
