import React, { useEffect, useRef } from "react";
import { HiHandRaised, RiMicOffFill } from "@assets/icons";

interface ParticipantTileProps {
  username: string;
  avatar: string;
  isAudioOn: boolean;
  isVideoOn: boolean;
  stream?: MediaStream | null;
  isMine?: boolean;
  emojiReaction?: string | null;
  isHandRaised?: boolean;
}

const ParticipantTile: React.FC<ParticipantTileProps> = ({
  username,
  avatar,
  isAudioOn,
  isVideoOn,
  stream,
  isMine = false,
  emojiReaction = null,
  isHandRaised = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="w-full h-full  relative group rounded-xl overflow-hidden ">
      {/* Audio Indicator */}
      {!isAudioOn && (
        <div className="absolute top-5 right-5 text-white text-xl z-20">
          <RiMicOffFill />
        </div>
      )}

      {/* Emoji Reaction */}
      {emojiReaction && (
        <div className="absolute bottom-4 right-4 text-white text-xl z-20">
          {emojiReaction}
        </div>
      )}

      {/* Emoji Reaction */}
      {isHandRaised && (
        <div className="absolute top-4 left-4 text-white text-xl z-20">
          <HiHandRaised />
        </div>
      )}

      {/* Username */}
      <div className="absolute bottom-5 left-5 text-base font-semibold text-white select-none z-20">
        {username}
      </div>

      {/* Video or Avatar */}
      <div className="w-full h-full bg-backgroundSecondary flex justify-center items-center overflow-hidden ">
        <video
          ref={videoRef}
          autoPlay
          muted={isMine ? true : !isAudioOn}
          className={`w-full ${isVideoOn ? "block" : "hidden"} rounded-md`}
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

{
  /* Pin Toggle */
}
//  <div
//  className="absolute top-5 left-5 text-2xl text-textPrimary cursor-pointer z-10"
//  onClick={togglePin}
// >
//  {isPin ? (
//    <RiPushpin2Fill />
//  ) : (
//    <RiPushpin2Line className="group-hover:opacity-100 opacity-0 ease-linear duration-100" />
//  )}
// </div>

export default ParticipantTile;
