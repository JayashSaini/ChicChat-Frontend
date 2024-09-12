import { SparklesCore } from "@components/ui/spark";
import { useSidebar } from "@context/SliderContext";
import { motion } from "framer-motion";

const Video = () => {
  const { theme } = useSidebar(); // Get the current theme (light or dark)

  const onClickHandler = () => {};

  return (
    <div className="h-screen w-full relative bg-background flex flex-col items-center justify-center  rounded-md">
      <h1 className="sm:text-7xl select-none text-6xl lg:text-9xl font-bold text-center text-textPrimary relative z-20">
        ChatStream
      </h1>
      <div className="md:w-[40rem] w-[35rem] md:h-40 h-30 relative">
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
      <div className="absolute top-8 right-10">
        <motion.button
          className="inline-flex h-12 items-center animate-shimmer justify-center rounded-md border border-border dark:bg-[linear-gradient(110deg,#111111,45%,#2a2a2a,55%,#111111)] bg-[linear-gradient(110deg,#f5f5f5,45%,#e0e0e0,55%,#f5f5f5)]
 bg-[length:200%_100%] px-8 py-6 font-medium text-textPrimary transition-transform transform hover:scale-105 focus:outline-none  shadow-md"
          onClick={onClickHandler}
        >
          Join Room
        </motion.button>
      </div>
    </div>
  );
};

export default Video;
