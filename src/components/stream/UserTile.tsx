import React, { useEffect, useRef } from "react";
import { RiPushpin2Fill, RiPushpin2Line, RiMicOffFill } from "@assets/icons";

const UserTile: React.FC<{
  username: string;
  avatar: string;
  isAudioOn: boolean;
  isVideoOn: boolean;
  stream: MediaStream | null;
  togglePin: () => void;
  isPin: boolean;
}> = ({ username, avatar, isAudioOn, isVideoOn, togglePin, stream, isPin }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null); // Create a ref for the video element

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream; // Set the video element's source
    }
  }, [stream]); // Run this effect whenever the stream changes

  return (
    <div className="relative w-full h-full group rounded-xl  overflow-hidden">
      {/* Pin Toggle */}
      <div
        className="absolute top-5 left-5 text-2xl text-textPrimary cursor-pointer z-10"
        onClick={togglePin}
      >
        {isPin ? (
          <RiPushpin2Fill />
        ) : (
          <RiPushpin2Line className="group-hover:opacity-100 opacity-0 ease-linear duration-100" />
        )}
      </div>

      {/* Audio Indicator */}
      <div className="absolute top-5 right-5 text-[#fff] text-xl z-10">
        {!isAudioOn && <RiMicOffFill />}
      </div>

      {/* Username Display */}
      <div className=" z-10 absolute bottom-5 left-5 text-base font-semibold text-[#fff] select-none">
        {username}
      </div>

      {/* Video or Avatar Display */}
      <div className="w-full h-full bg-backgroundSecondary flex justify-center items-center overflow-hidden">
        <video
          ref={videoRef} // Attach the ref to the video element
          autoPlay
          muted={isAudioOn ? false : true}
          className={`w-full ${isVideoOn ? "block" : "hidden"}`} // Show or hide video based on `isVideoOn`
        ></video>
        {!isVideoOn && (
          <div className="bg-[#096fe4bb] absolute flex items-center justify-center w-full h-full">
            <img
              className="rounded-full w-[80px] h-[80px] object-cover select-none"
              src={avatar}
              alt={username}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTile;
