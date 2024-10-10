import ConfirmationModal from "@components/ConfirmationModel";
import Participation from "@components/stream/Participation";
import { useMedia } from "@context/MediaContext";
import { useSocket } from "@context/SocketContext";
import { UserInterface } from "@interfaces/user";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  RiPhoneFill,
  RiVideoOnLine,
  RiVideoOffLine,
  RiMicLine,
  RiMicOffLine,
} from "react-icons/ri";
import { LuScreenShare } from "react-icons/lu";
import { HiOutlineHandRaised, HiHandRaised } from "react-icons/hi2";
import { VscSmiley } from "react-icons/vsc";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { BsChatLeftText } from "react-icons/bs";
const room = () => {
  const { roomId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const [joiningRequestUser, setJoinedRequestUser] =
    useState<UserInterface | null>(null);

  const { socket } = useSocket();
  const { getMedia, stream } = useMedia();

  const handleConfirm = async () => {
    await socket?.emit("admin:approve-user", {
      roomId,
      userId: joiningRequestUser?._id,
      username: joiningRequestUser?.username,
    });

    setIsModalOpen(false);
  };

  const handleClose = async () => {
    await socket?.emit("admin:reject-user", {
      userId: joiningRequestUser?._id,
    });

    setIsModalOpen(false);
    setJoinedRequestUser(null);
  };

  const handleRoomJoiningRequest = ({ user }: { user: UserInterface }) => {
    setJoinedRequestUser(user);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("admin:user-approve", handleRoomJoiningRequest);

    getMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      socket.off("admin:user-approve", handleRoomJoiningRequest);
    };
  }, [socket]);

  return (
    <>
      <div className="w-full md:h-screen h-[calc(100vh-56px)] bg-background py-8 px-6 flex flex-col gap-5">
        <div className="w-full h-[90%]  flex gap-4">
          <Participation />
          {/* <div className="w-[500px] h-full bg-backgroundTertiary rounded-xl"></div> */}
        </div>
        <div className="w-full h-[10%] bg-backgroundTertiary rounded-xl">
          <div className="w-full h-full flex items-center justify-around px-4">
            <div className="w-[20%] text-textPrimary text-base">
              {roomId ? roomId.match(/.{1,4}/g)?.join(" ") : ""}
            </div>
            <div className="w-[60%] flex gap-2 items-center justify-evenly  text-textPrimary text-2xl">
              <div
                className="cursor-pointer"
                onClick={() => {
                  setIsVideoOn(!isVideoOn);
                }}
              >
                {isVideoOn ? <RiVideoOffLine /> : <RiVideoOnLine />}
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setIsAudioOn(!isAudioOn)}
              >
                {isAudioOn ? <RiMicOffLine /> : <RiMicLine />}
              </div>
              <div className="cursor-pointer">
                <LuScreenShare />
              </div>
              <button
                type="button"
                className="focus:outline-none bg-red-500 focus:ring-0 border-0 font-medium rounded-full px-12 py-[10px]"
                onClick={() => socket?.emit("leave-room", { roomId })}
              >
                <RiPhoneFill />
              </button>

              <div
                className="cursor-pointer"
                onClick={() => setIsHandRaised(!isHandRaised)}
              >
                {isHandRaised ? <HiHandRaised /> : <HiOutlineHandRaised />}
              </div>
              <div className="cursor-pointer">
                <VscSmiley />
              </div>
              <div className="cursor-pointer">
                <BsThreeDotsVertical />
              </div>
            </div>
            <div className="w-[20%] flex gap-8 items-center justify-end  text-textPrimary text-2xl">
              <div className="cursor-pointer">
                <MdOutlinePeopleAlt />
              </div>
              <div className="cursor-pointer text-2xl">
                <BsChatLeftText />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title="Join Request Confirmation"
          message={`${joiningRequestUser?.username} has requested to join this room. Do you want to allow them to join?`}
        />
      )}
    </>
  );
};

export default room;
