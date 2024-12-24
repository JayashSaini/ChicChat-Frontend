import React, { useEffect, useRef, useState } from "react";
import UserTile from "./UserTile";
import { useMedia } from "@context/MediaContext";
import { useAuth } from "@context/AuthContext";
import { ParticipantInterface } from "@interfaces/stream";

const Participation: React.FC<{}> = ({}) => {
  const { stream, isAudioOn, isVideoOn, remoteStream } = useMedia();
  const { user } = useAuth();

  const [participation, setParticipation] = useState<ParticipantInterface[]>(
    []
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (videoRef.current && remoteStream) {
      if ("srcObject" in videoRef.current) {
        videoRef.current.srcObject = remoteStream;
      } else {
        // Handle older browsers, though rarely needed
        console.error("Your browser does not support srcObject.");
      }
    }
  }, [remoteStream]);

  const togglePin = (index: number) => {
    // Update the isPin value and then rearrange the list
    setParticipation((prevState) => {
      const updatedList = prevState.map((user, i) =>
        i === index ? { ...user, isPin: !user.isPin } : user
      );

      // Move pinned users to the top after updating isPin
      const pinnedUsers = updatedList.filter((user) => user.isPin);
      const unpinnedUsers = updatedList.filter((user) => !user.isPin);

      return [...pinnedUsers, ...unpinnedUsers];
    });
  };

  return (
    <div
      className={`w-full h-full bg-backgroundTertiary rounded-xl  gap-4 p-4 grid overflow-auto custom-scrollbar  ${
        participation.length > 1 ? "grid-cols-2" : "grid-cols-1"
      }`}
      style={{
        gridAutoRows: "minmax(350px, auto)", // Ensures flexible row height
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", // Ensures dynamic column layout
      }}
    >
      {/* Render UserTile component for the current user if both user and stream are available */}
      {user && stream && (
        <UserTile
          avatar={user.avatar?.url}
          isAudioOn={isAudioOn}
          isVideoOn={isVideoOn}
          stream={stream}
          togglePin={() => {}}
          username={user.username}
          isPin={true}
        />
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        controls={false}
        muted
        style={{ width: "300px", height: "auto", background: "black" }}
      />

      {/* {user && peerMediaStream.length > 0 && (
        <UserTile
          avatar={user.avatar?.url}
          isAudioOn={isAudioOn}
          isVideoOn={isVideoOn}
          stream={peerMediaStream[0].MediaStream}
          togglePin={() => {}}
          username={user.username}
          isPin={true}
        />
      )} */}
    </div>
  );
};

export default Participation;
