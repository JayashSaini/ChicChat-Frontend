import React from "react";
import { RiPushpin2Fill, RiPushpin2Line, RiMicOffFill } from "react-icons/ri";

const UserTile: React.FC<{
  background: string;
  username: string;
  avatar: string;
  isAudioOn: boolean;
  isVideoOn: boolean;
  stream: boolean;
  togglePin: () => void;
  isPin: boolean;
}> = ({
  background,
  username,
  avatar,
  isAudioOn,
  isVideoOn,
  togglePin,
  stream,
  isPin,
}) => {
  return (
    <div
      className="relative w-full h-full group rounded-md"
      style={{ backgroundColor: background }} // Apply background color here
    >
      <div
        className="absolute top-5 left-5 text-[25px] text-[#262626] cursor-pointer z-10"
        onClick={togglePin}
      >
        {isPin ? (
          <RiPushpin2Fill />
        ) : (
          <RiPushpin2Line className="group-hover:opacity-100 opacity-0 ease-linear duration-100" />
        )}
      </div>
      <div className="absolute top-5 right-5 text-[25px] text-[#fff] ">
        {!isAudioOn && <RiMicOffFill />}
      </div>
      <div className="absolute bottom-5 left-5 text-base font-semibold text-[#fff] select-none">
        {username}
      </div>
      {isVideoOn ? (
        <></>
      ) : (
        <div className="relative flex items-center justify-center w-full h-full">
          <img
            className="rounded-full w-[80px] h-[80px] object-cover select-none"
            src={avatar}
            alt={username}
          />
        </div>
      )}
    </div>
  );
};

export default UserTile;
