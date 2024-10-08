import ConfirmationModal from "@components/ConfirmationModel";
import { useMedia } from "@context/MediaContext";
import { useSocket } from "@context/SocketContext";
import { UserInterface } from "@interfaces/user";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const room = () => {
  const { roomId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="w-full md:h-screen h-[calc(100vh-56px)] bg-background"></div>
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
