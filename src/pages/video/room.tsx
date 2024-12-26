/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

import { getRoomById } from "@api/index";
import { requestHandler } from "@utils/index";
import { Room as RoomInterface } from "@interfaces/stream";
import { useAuth, useMedia, useRoom, useSocket } from "@context/index";
import Loader from "@components/Loader";
import Participants from "@components/video/Participants";
import People from "@components/video/People";
import ChatBox from "@components/video/Chatbox";
import ToolTip from "@components/ui/tooltip";
import {
  RiMicLine,
  RiMicOffLine,
  RiPhoneFill,
  RiVideoOffLine,
  RiVideoOnLine,
} from "react-icons/ri";
import { LuScreenShare } from "react-icons/lu";
import { HiHandRaised, HiOutlineHandRaised } from "react-icons/hi2";
import ReactionPicker from "@components/ui/reactionPicker";
import { BsChatLeftText, BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlinePeopleAlt } from "react-icons/md";

const Room = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false); // Modal visibility state for people list
  const [isChatBoxModalOpen, setIsChatBoxModalOpen] = useState(false); // Modal visibility state for chatbox

  const [isHandRaised, setIsHandRaised] = useState(false); // State to manage hand raise

  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const { setRoomHandler } = useRoom();
  const { mediaState } = useMedia();
  const { user } = useAuth();
  const { socket } = useSocket();

  const fetchRoomDetails = (roomId: string) => {
    requestHandler(
      async () => await getRoomById(roomId),
      setIsLoading,
      (res: any) => {
        const { room }: { room: RoomInterface } = res.data;
        if (!room.isActive) {
          toast.error("This room is no longer active.");
          navigate("/workspace/video");
        } else setRoomHandler(room);
      },
      (e: string) => {
        toast.error(e);
        navigate("/workspace/video");
      }
    );
  };

  useEffect(() => {
    if (roomId) fetchRoomDetails(roomId);
  }, [roomId]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full md:h-screen h-[calc(100vh-56px)] bg-background py-8 px-6 flex flex-col gap-5">
      {/* Top Control Panel */}
      <div className="w-full h-[90%] flex gap-4 overflow-hidden">
        <Participants /> {/* Local user's participation component */}
        {/* People modal */}
        {isPeopleModalOpen && !isChatBoxModalOpen && (
          <People
            isOpen={isPeopleModalOpen}
            onClose={() => setIsPeopleModalOpen(false)}
          />
        )}
        {/* Chatbox modal */}
        {isChatBoxModalOpen && !isPeopleModalOpen && (
          <ChatBox
            isOpen={isChatBoxModalOpen}
            onClose={() => setIsChatBoxModalOpen(false)}
          />
        )}
      </div>
      {/* Bottom control panel */}
      <div className="w-full h-[10%] bg-backgroundTertiary rounded-xl select-none">
        <div className="w-full h-full flex items-center justify-around px-4">
          {/* Room ID display and copy functionality */}
          <div className="w-[20%]">
            <div
              className="inline-block text-textPrimary text-base select-text cursor-pointer"
              onClick={() => {
                navigator.clipboard
                  .writeText(roomId!)
                  .then(() => toast.success("Room Id successfully copied!"));
              }}
            >
              <ToolTip title="click to copy" placement="top">
                {roomId ? roomId.match(/.{1,4}/g)?.join(" ") : ""}
              </ToolTip>
            </div>
          </div>

          {/* Control buttons (Video, Audio, Share, etc.) */}
          <div className="w-[60%] flex gap-2 items-center justify-evenly text-textPrimary text-2xl">
            <div role="button" onClick={mediaState.toggleVideo}>
              {mediaState.videoEnabled ? <RiVideoOnLine /> : <RiVideoOffLine />}
            </div>
            <div role="button" onClick={mediaState.toggleAudio}>
              {mediaState.audioEnabled ? <RiMicLine /> : <RiMicOffLine />}
            </div>
            <div role="button">
              <LuScreenShare />
            </div>
            {/* Leave room button */}
            <button
              type="button"
              className="focus:outline-none bg-red-500 focus:ring-0 border-0 font-medium rounded-full px-12 py-[10px]"
              onClick={() => {
                socket?.emit("leave-room", {
                  roomId,
                  user: user,
                });
                navigate("/workspace/video");
              }}
            >
              <RiPhoneFill className="text-white" />
            </button>

            {/* Hand raise button */}
            <div role="button" onClick={() => setIsHandRaised(!isHandRaised)}>
              {isHandRaised ? <HiHandRaised /> : <HiOutlineHandRaised />}
            </div>

            {/* Reaction picker */}
            <div role="button">
              <ReactionPicker />
            </div>

            {/* More options button */}
            <div role="button">
              <BsThreeDotsVertical />
            </div>
          </div>

          {/* Chat and People buttons */}
          <div className="w-[20%] flex gap-8 items-center justify-end text-textPrimary text-2xl">
            <div
              role="button"
              onClick={() => {
                setIsChatBoxModalOpen(false);
                setIsPeopleModalOpen(!isPeopleModalOpen);
              }}
            >
              <MdOutlinePeopleAlt />
            </div>
            <div
              className="text-2xl"
              role="button"
              onClick={() => {
                setIsPeopleModalOpen(false);
                setIsChatBoxModalOpen(!isChatBoxModalOpen);
              }}
            >
              <BsChatLeftText />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
