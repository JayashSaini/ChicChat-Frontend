import SecondaryButton from "@components/SecondaryButton";
import { SparklesCore } from "@components/ui/spark";
import JoinRoomModel from "@components/stream/JoinRoomModel";
import { useSidebar } from "@context/SliderContext";
import { useState } from "react";
import { toast } from "sonner";
import { requestHandler } from "@utils/index";
import { createRoom } from "@api/index";
import { useNavigate } from "react-router-dom";

const Video = () => {
  const [openJoinRoom, setOpenJoinRoom] = useState(false);
  const [createRoomLoader,setCreateRoomLoader] = useState(false);

  const { theme } = useSidebar(); // Get the current theme (light or dark)
  const navigate = useNavigate();

  const onCreateRoomHandler = () => {
    requestHandler(
      async () => await createRoom(),
      setCreateRoomLoader,
      ({ data }) => {
        navigate(`/workspace/stream/room/${data.room.roomId}`);
      },
      (e) => toast.error(e)
    );
  };

  return (
    <>
      <JoinRoomModel
        open={openJoinRoom}
        onClose={() => {
          setOpenJoinRoom(false);
        }}
      />
      <div className="md:h-screen h-[calc(100vh-56px)] w-full relative bg-background flex flex-col items-center justify-center">
        <h1 className="sm:text-7xl select-none text-6xl lg:text-9xl font-bold text-center text-textPrimary relative z-10">
          ChatStream
        </h1>

        <div className="md:w-[40rem] w-[35rem] md:h-40 h-30 relative mt-6">
          {/* Gradients */}
          <>
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent dark:via-indigo-500 via-[#20e2f0] to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent dark:via-indigo-500 via-[#5977ff] to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent dark:via-sky-500 via-[#1389d8] to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent dark:via-sky-500 via-[#1519f7] to-transparent h-px w-1/4" />
          </>

          {/* Core component */}
          <SparklesCore
            minSize={0.4}
            maxSize={1}
            particleDensity={500}
            className="w-full h-full"
            particleColor={theme === "dark" ? "#FFFFFF" : "#121212"}
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>

        {/* Buttons Section */}
        <div className="absolute md:top-32 top-20 flex flex-col sm:flex-row gap-4 items-center justify-center mt-10">
          <SecondaryButton
            onClick={() =>
              setOpenJoinRoom(true)
            }
            fullWidth={false}
          >
            Join Room
          </SecondaryButton>

          <SecondaryButton
            onClick={onCreateRoomHandler}
            fullWidth={false}
            isLoading={createRoomLoader}
          >
            Create Room
          </SecondaryButton>
        </div>
      </div>
    </>
  );
};

export default Video;
