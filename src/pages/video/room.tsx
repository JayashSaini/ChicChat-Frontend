/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

import { getRoomById } from "@api/index";
import { requestHandler } from "@utils/index";
import { Room as RoomInterface } from "@interfaces/stream";
import { useAuth, useRoom, useSocket } from "@context/index";
import Loader from "@components/Loader";
import Participants from "@components/video/Participants";
import People from "@components/video/People";
import ChatBox from "@components/video/Chatbox";
import ToolTip from "@components/ui/tooltip";
import ConfirmationModal from "@components/ConfirmationModel";
import {
  RiPhoneFill,
  RiVideoOnLine,
  RiVideoOffLine,
  RiMicLine,
  RiMicOffLine,
  LuScreenShare,
  HiOutlineHandRaised,
  HiHandRaised,
  BsThreeDotsVertical,
  MdOutlinePeopleAlt,
  BsChatLeftText,
} from "@assets/icons";
import ReactionPicker from "@components/ui/reactionPicker";
import { UserInterface } from "@interfaces/user";

const Room = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state for user joining requests
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false); // Modal visibility state for people list
  const [isChatBoxModalOpen, setIsChatBoxModalOpen] = useState(false); // Modal visibility state for chatbox

  const [isHandRaised, setIsHandRaised] = useState(false); // State to manage hand raise
  const [joiningRequestUser, setJoiningRequestUser] =
    useState<UserInterface | null>(null); // User waiting for approval

  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const { setRoomHandler, setParticipantsHandler, mediaState } = useRoom();
  const { user } = useAuth();
  const { socket } = useSocket();

  const fetchRoomDetails = (roomId: string) => {
    requestHandler(
      async () => await getRoomById(roomId),
      setIsLoading,
      (res: any) => {
        const {
          room,
          participants,
        }: { room: RoomInterface; participants: UserInterface[] } = res.data;
        if (!room.isActive) {
          toast.error("This room is no longer active.");
          navigate("/workspace/video");
        } else {
          setRoomHandler(room);
          setParticipantsHandler(participants);
        }
      },
      (e: string) => {
        toast.error(e);
        navigate("/workspace/video");
      }
    );
  };

  // Handle confirmation of new user joining (admin approval)
  const handleConfirm = () => {
    socket?.emit("admin:approve-user", {
      roomId,
      user: joiningRequestUser,
    });
    setIsModalOpen(false); // Close modal after confirming
    setJoiningRequestUser(null); // Reset the joining user
  };

  // Handle rejection of new user joining (admin rejection)
  const handleClose = () => {
    socket?.emit("admin:reject-user", {
      userId: joiningRequestUser?._id,
    });
    setIsModalOpen(false); // Close modal after rejection
    setJoiningRequestUser(null); // Reset the joining user
  };

  // Handle room joining request from a user
  const handleRoomJoiningRequest = ({ user }: { user: UserInterface }) => {
    setJoiningRequestUser(user); // Set the user requesting to join
    setIsModalOpen(true); // Open the confirmation modal
  };

  useEffect(() => {
    if (roomId) fetchRoomDetails(roomId);
  }, [roomId]);

  // Setup socket events on component mount and clean up on unmount
  useEffect(() => {
    if (!socket) return;

    socket.on("admin:user-join-request", handleRoomJoiningRequest); // Listen for join requests

    // Cleanup socket event listener on unmount
    return () => {
      socket.off("admin:user-join-request", handleRoomJoiningRequest);
    };
  }, [socket]);

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
      {/* Confirmation modal for join request */}
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title="Join Request Confirmation"
          message={`${joiningRequestUser?.username} has requested to join this room. Do you want to allow them to join?`}
        />
      )}
    </div>
  );
};

export default Room;
