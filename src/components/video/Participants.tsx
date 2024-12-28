import React, { useEffect, useState } from "react";
import ParticipantTile from "./ParticipantTile";
import { useAuth, useRoom } from "@context/index";

const Participants: React.FC = () => {
  const { mediaStream, mediaState } = useRoom();
  const { user } = useAuth();
  const [gridClass, setGridClass] = useState<
    "tile-1" | "tile-2" | "tile-3" | "tile-4"
  >("tile-1");

  // Construct the participants array dynamically
  const participants =
    user && mediaStream
      ? Array.from({ length: 1 }, () => ({
          avatar: user.avatar?.url,
          isAudioOn: mediaState.audioEnabled,
          isVideoOn: mediaState.videoEnabled,
          stream: mediaStream,
          username: user.username,
        }))
      : [];

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

    // Remove the grid layout class when the participants list changes
  }, [user, participants]);

  return (
    <div
      className={`w-full h-full bg-backgroundTertiary  participants rounded-xl p-4 overflow-auto custom-scrollbar `}
    >
      {/* Participants Tile component for the current user if both user and stream are available */}
      {user && mediaState && (
        <div className={`${gridClass} rounded-xl`}>
          <ParticipantTile
            avatar={user.avatar?.url}
            isAudioOn={mediaState.audioEnabled}
            isVideoOn={mediaState.videoEnabled}
            stream={mediaStream}
            username={user.username}
          />
        </div>
      )}
      {participants &&
        participants.map((participant, idx) => (
          <div key={idx} className={`${gridClass} rounded-xl`}>
            <ParticipantTile
              avatar={participant.avatar}
              isAudioOn={participant.isAudioOn}
              isVideoOn={participant.isVideoOn}
              stream={participant.stream}
              username={participant.username}
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
