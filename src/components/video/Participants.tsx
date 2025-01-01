import React, { useEffect, useState } from "react";
import ParticipantTile from "./ParticipantTile";
import { useAuth } from "@context/index";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

const Participants: React.FC = () => {
  const { mediaStream, mediaState } = useSelector(
    (state: RootState) => state.media
  );
  const { participants, emojiReaction } = useSelector(
    (state: RootState) => state.room
  );
  const { user } = useAuth();
  const [gridClass, setGridClass] = useState<
    "tile-1" | "tile-2" | "tile-3" | "tile-4"
  >("tile-1");

  useEffect(() => {
    // Adjust grid layout based on the number of participants
    if (participants.length == 0) {
      setGridClass("tile-1");
    } else if (participants.length == 1) {
      setGridClass("tile-2");
    } else if (participants.length == 2 || participants.length == 3) {
      setGridClass("tile-3");
    } else {
      setGridClass("tile-4");
    }
    console.log("participants check : ", participants);
    // Remove the grid layout class when the participants list changes
  }, [participants]);

  return (
    <div
      className={`w-full h-full bg-backgroundTertiary  participants rounded-xl p-4 overflow-auto custom-scrollbar `}
    >
      {user && (
        <div className={`${gridClass} rounded-xl`}>
          <ParticipantTile
            avatar={user?.avatar?.url}
            isAudioOn={mediaState.audioEnabled}
            isVideoOn={mediaState.videoEnabled}
            stream={mediaStream}
            username={user?.username}
            isMine={true}
            emojiReaction={emojiReaction}
          />
        </div>
      )}
      {/* Participants Tile component for the current user if both user and stream are available */}
      {participants &&
        participants.map((participant, idx) => (
          <div key={idx} className={`${gridClass} rounded-xl`}>
            <ParticipantTile
              avatar={participant?.user?.avatar?.url}
              stream={participant?.stream}
              username={participant?.user?.username}
              isAudioOn={participant?.mediaState.audioEnabled}
              isVideoOn={participant?.mediaState.videoEnabled}
              emojiReaction={participant?.emojiReaction}
              isHandRaised={participant?.isHandRaised}
            />
          </div>
        ))}
    </div>
  );
};

// const togglePin = (index: number) => {
//   // Update the isPin value and then rearrange the list
//   setParticipation((prevState) => {
//     const updatedList = prevState.map((user, i) =>
//       i === index ? { ...user, isPin: !user.isPin } : user
//     );

//     // Move pinned users to the top after updating isPin
//     const pinnedUsers = updatedList.filter((user) => user.isPin);
//     const unpinnedUsers = updatedList.filter((user) => !user.isPin);

//     return [...pinnedUsers, ...unpinnedUsers];
//   });
// };

export default Participants;
