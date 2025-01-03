/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

import { getRoomById } from "@api/index";
import { requestHandler } from "@utils/index";
import { Room as RoomInterface } from "@interfaces/stream";
import { useAuth } from "@context/index";
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
  MdOutlinePeopleAlt,
  BsChatLeftText,
} from "@assets/icons";
import ReactionPicker from "@components/ui/reactionPicker";
import { UserInterface } from "@interfaces/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import {
  addRoomMessage,
  setIsParticipantTyping,
  setParticipants,
  setRoom,
  setRoomChatIsEnabled,
} from "@redux/slice/room.slice";
import { toggleAudio, toggleVideo } from "@redux/slice/media.slice";
import {
  handleAnswer,
  handleIceCandidate,
  handleUserJoined,
  handleUserLeave,
  offer,
  setParticipantReactionHandler,
  setParticipantsHandRaised,
  toggleHandRaisedHandler,
  toggleScreenSharingThunk,
  updateParticipantMedia,
} from "@redux/thunk/room.thunk";
import { initializeMedia } from "@redux/thunk/media.thunk";
import { LuScreenShareOff } from "react-icons/lu";

import MenuDropdown from "@components/video/MenuDropdown";

const Room = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state for user joining requests
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false); // Modal visibility state for people list
  const [isChatBoxModalOpen, setIsChatBoxModalOpen] = useState(false); // Modal visibility state for chatbox
  const [joiningRequestUser, setJoiningRequestUser] =
    useState<UserInterface | null>(null); // User waiting for approval

  // Hooks for route and state management
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const { socket } = useSelector((state: RootState) => state.socket);
  const { isHandRaised, participants, room } = useSelector(
    (state: RootState) => state.room
  );
  const { mediaState, mediaStream, isScreenSharing } = useSelector(
    (state: RootState) => state.media
  );
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // Fetch room details by roomId.
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
          dispatch(setRoom(room));
          dispatch(
            setParticipants(
              participants.map((user) => ({
                _id: user?._id.toString(),
                user: user,
                isPin: false,
                stream: null,
                mediaState: {
                  audioEnabled: false,
                  videoEnabled: false,
                },
                emojiReaction: null,
              }))
            )
          );
          // Notify Other User that new user joined
          console.log("notification");
          socket?.emit("participant:join:notify", room?.roomId, user);
        }
      },
      (e: string) => {
        toast.error(e);
        navigate("/workspace/video");
      }
    );
  };

  // Handle confirmation of new user joining (admin approval).
  const handleConfirm = () => {
    socket?.emit("admin:approve-user", {
      roomId,
      user: joiningRequestUser,
    });

    setIsModalOpen(false); // Close modal after confirming
    setJoiningRequestUser(null); // Reset the joining user
  };

  //  Handle rejection of new user joining (admin rejection).
  const handleClose = () => {
    socket?.emit("admin:reject-user", {
      userId: joiningRequestUser?._id,
    });

    setIsModalOpen(false); // Close modal after rejection
    setJoiningRequestUser(null); // Reset the joining user
  };

  // Handle room joining request from a user.
  const handleRoomJoiningRequest = ({ user }: { user: UserInterface }) => {
    setJoiningRequestUser(user); // Set the user requesting to join
    setIsModalOpen(true); // Open the confirmation modal
  };

  // Fetch room details whenever the roomId changes.
  useEffect(() => {
    if (roomId) fetchRoomDetails(roomId);
  }, [roomId]);

  // Update media state on the server whenever mediaState changes.
  useEffect(() => {
    socket?.emit("user:media-update", roomId, user?._id.toString(), {
      audioEnabled: mediaState.audioEnabled,
      videoEnabled: mediaState.videoEnabled,
    });
  }, [roomId, mediaState, user, socket]);

  //  Set up socket events and clean up on component unmount.
  useEffect(() => {
    if (!socket) return;

    //  Handle page unload and clean up resources.
    const handleUnload = () => {
      socket.emit("leave-room", {
        roomId: roomId,
        user: user,
      });
      toast.info("You are leaving the room. Please rejoin if needed.");
      navigate("/workspace/video");
    };

    // Listen for join requests
    socket.on("admin:user-join-request", handleRoomJoiningRequest);
    socket.on(
      "user:joined",
      (credentials: { user: UserInterface; socketId: string }) => {
        const myUserId: string = user?._id?.toString() || " ";
        dispatch(handleUserJoined({ ...credentials, myUserId }));
      }
    );
    socket.on("user:leave", (d) => dispatch(handleUserLeave(d)));
    socket.on("offer", (offerData, socketId, credentials) => {
      const myUserId: string = user?._id.toString() || " ";
      dispatch(
        offer({ offer: offerData, socketId, credentials, myUserId: myUserId })
      );
    });
    socket.on("answer", (answer, socketId, { userId, mediaState }) =>
      dispatch(handleAnswer({ answer, from: socketId, userId, mediaState }))
    );
    socket.on("ice-candidate", (candidate, socketId) =>
      dispatch(handleIceCandidate({ candidate, from: socketId }))
    );
    socket.on("participant:media-update", (userId, mediaState) =>
      dispatch(updateParticipantMedia({ userId, mediaState }))
    );
    socket.on("participant:emoji:reaction", (data) => {
      dispatch(setParticipantReactionHandler(data));
    });
    socket.on("participant:hand:raised", (data) => {
      dispatch(setParticipantsHandRaised(data));
    });
    socket.on("user:kicked", () => {
      toast.info("You have been kicked from the room.");
      navigate("/workspace/video");
    });
    socket.on("participants:received-message", (message) => {
      dispatch(
        addRoomMessage({
          isOwnMessage: false,
          username: message.username,
          content: message.content,
          createdAt: message.createdAt,
        })
      );
    });
    socket.on("participants:typing", () => {
      dispatch(setIsParticipantTyping(true));
    });

    socket.on("participants:stop-typing", () => {
      console.log("participants:stop-typing ");
      dispatch(setIsParticipantTyping(false));
    });
    socket.on("chat:toggle", (data) => {
      dispatch(setRoomChatIsEnabled(data.isChatEnabled));
    });

    // Add event listeners for beforeunload and unload
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("unload", handleUnload);

    // Cleanup on unmount
    return () => {
      socket.off("admin:user-join-request", handleRoomJoiningRequest);
      socket.off("user:joined");
      socket.off("user:leave");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("participant:media-update");
      socket.off("participant:emoji:reaction");
      socket.off("participant:hand:raised");
      socket.off("user:kicked");
      socket.off("participants:received-message");
      socket.off("participants:typing");
      socket.off("participants:stop-typing");
      socket.off("chat:toggle");

      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("unload", handleUnload);

      if (roomId) {
        socket.emit("leave-room", {
          roomId: roomId,
          user: user,
        });
      }
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!mediaStream) {
      dispatch(initializeMedia());
    }
  }, [mediaStream]);

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
            <div
              role="button"
              onClick={() => {
                if (isScreenSharing) {
                  dispatch(toggleScreenSharingThunk());
                } else dispatch(toggleVideo());
              }}
            >
              {mediaState.videoEnabled ? <RiVideoOnLine /> : <RiVideoOffLine />}
            </div>
            <div
              role="button"
              onClick={() => {
                dispatch(toggleAudio());
              }}
            >
              {mediaState.audioEnabled ? <RiMicLine /> : <RiMicOffLine />}
            </div>
            <div
              role="button"
              onClick={() => {
                if (participants && participants.length == 0) {
                  toast.error(
                    "Cannot share screen when no other users are connected."
                  );
                  return;
                }
                dispatch(toggleScreenSharingThunk());
              }}
            >
              {participants && participants.length == 0 ? (
                <LuScreenShareOff />
              ) : (
                <LuScreenShare />
              )}
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
            <div
              role="button"
              onClick={() =>
                dispatch(toggleHandRaisedHandler({ userId: user?._id || " " }))
              }
            >
              {isHandRaised ? <HiHandRaised /> : <HiOutlineHandRaised />}
            </div>

            {/* Reaction picker */}
            <div role="button">
              <ReactionPicker />
            </div>

            {/* More options button */}
            <div role="button" className="relative  overflow-visible">
              <MenuDropdown />
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
              className={`text-2xl `}
              role="button"
              onClick={() => {
                if (room?.isChatEnable == false) {
                  toast.error("Chat is disabled by the admin.");
                  return;
                }
                if (participants.length == 0) {
                  toast.error("No other users are connected.");
                  return;
                }
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
