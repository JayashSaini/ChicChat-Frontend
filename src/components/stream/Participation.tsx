import { useState } from "react";
import UserTile from "./UserTile";

const Participation = () => {
  const [participation, setParticipation] = useState(() =>
    [
      {
        avatar:
          "https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg",
        isAudioOn: false,
        isVideoOn: false,
        stream: false,
        username: "jayash",
        isPin: false,
      },
      {
        avatar:
          "https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg",
        isAudioOn: true,
        isVideoOn: false,
        stream: false,
        username: "tushar",
        isPin: false,
      },
      {
        avatar:
          "https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg",
        isAudioOn: false,
        isVideoOn: false,
        stream: false,
        username: "uday",
        isPin: false,
      },
      {
        avatar:
          "https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg",
        isAudioOn: false,
        isVideoOn: false,
        stream: false,
        username: "uday",
        isPin: false,
      },
    ].map((user) => ({
      ...user,
      background: getRandomTileColor(), // Assign random color to each user
    }))
  );

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
      className={`w-full h-full bg-backgroundTertiary rounded-xl gap-4 p-4 grid overflow-auto custom-scrollbar  ${
        participation.length > 1 ? "grid-cols-2" : "grid-cols-1"
      }`}
      style={{
        gridAutoRows: "minmax(350px, auto)", // Ensures flexible row height
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", // Ensures dynamic column layout
      }}
    >
      {participation.map((user, i) => (
        <UserTile
          avatar={user.avatar}
          background={user.background} // Use pre-assigned color
          isAudioOn={user.isAudioOn}
          isVideoOn={user.isVideoOn}
          stream={user.stream}
          togglePin={() => togglePin(i)}
          username={user.username}
          key={i}
          isPin={user.isPin}
        />
      ))}
    </div>
  );
};

// Function to get a random tile color
function getRandomTileColor() {
  const colors = [
    "#3AABEA", // Light Blue
    "#096EE4", // Dark Blue
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default Participation;
