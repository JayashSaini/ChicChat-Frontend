import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import SecondaryButton from "@components/SecondaryButton";
import { SparklesCore } from "@components/ui/spark";
import JoinRoomModel from "@components/video/JoinRoomModel";

import { useSidebar } from "@context/index";
import { requestHandler } from "@utils/index";
import { createRoom } from "@api/index";

const Video = () => {
  const [openJoinRoom, setOpenJoinRoom] = useState(false); // State to control Join Room Modal
  const [createRoomLoader, setCreateRoomLoader] = useState(false); // State to manage loader for room creation

  const { theme } = useSidebar(); // Get the current theme (light or dark)
  const navigate = useNavigate(); // Hook to navigate to other pages

  // Handler for creating a new room
  const onCreateRoomHandler = () => {
    requestHandler(
      async () => await createRoom(), // API request to create a room
      setCreateRoomLoader, // Loader management while waiting for the API response
      ({ data }) => {
        // Success handler - navigate to the created room
        navigate(`/workspace/video/room/${data.room.roomId}`);
      },
      (e) => toast.error(e) // Error handler - show error message if the request fails
    );
  };

  return (
    <>
      {/* Join Room Modal */}
      <JoinRoomModel
        open={openJoinRoom}
        onClose={() => {
          setOpenJoinRoom(false); // Close the Join Room Modal
        }}
      />

      {/* Main Content Container */}
      <div className="md:h-screen h-[calc(100vh-56px)] w-full relative bg-background flex flex-col items-center justify-center">
        {/* Main Heading */}
        <h1 className="sm:text-7xl select-none text-6xl lg:text-9xl font-bold text-center text-textPrimary relative z-10">
          ChatStream
        </h1>

        {/* Visual Effect Container */}
        <div className="md:w-[40rem] w-[35rem] md:h-40 h-30 relative mt-6">
          {/* Gradient Effects for Visual Design */}
          <>
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent dark:via-indigo-500 via-[#20e2f0] to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent dark:via-indigo-500 via-[#5977ff] to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent dark:via-sky-500 via-[#1389d8] to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent dark:via-sky-500 via-[#1519f7] to-transparent h-px w-1/4" />
          </>

          {/* Sparkles Effect for the Core Component */}
          <SparklesCore
            minSize={0.4}
            maxSize={1}
            particleDensity={500} // Controls how many sparkles are shown
            className="w-full h-full"
            particleColor={theme === "dark" ? "#FFFFFF" : "#121212"} // Adjusts color based on the theme
          />

          {/* Radial Gradient Mask to prevent sharp edges of the visual */}
          <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>

        {/* Button Section for Joining or Creating Room */}
        <div className="absolute md:top-32 top-20 flex flex-col sm:flex-row gap-4 items-center justify-center mt-10">
          {/* Button for Joining Room */}
          <SecondaryButton
            onClick={() => setOpenJoinRoom(true)} // Opens the Join Room modal
            fullWidth={false}
          >
            Join Room
          </SecondaryButton>

          {/* Button for Creating Room */}
          <SecondaryButton
            onClick={onCreateRoomHandler} // Triggers room creation process
            fullWidth={false}
            isLoading={createRoomLoader} // Shows a loading state when room is being created
          >
            Create Room
          </SecondaryButton>
        </div>
      </div>
    </>
  );
};

export default Video;
