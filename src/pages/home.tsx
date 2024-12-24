import { Spotlight } from "@components/ui/spotlight";
import { useAuth } from "@context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SpotlightPreview() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const onClickHandler = () => {
    if (user?._id && token) {
      return navigate("/workspace/chat");
    } else {
      return navigate("/login");
    }
  };
  return (
    <div className="h-screen w-full rounded-md flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0 shadow-lg">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-60">
          ChicChat: <br /> Connect Seamlessly in Real-Time.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Experience flawless real-time chat and video calls, anytime and
          anywhere. Join us now!
        </p>
        <div className="flex justify-center mt-6">
          <motion.button
            className="inline-flex h-12 items-center animate-shimmer justify-center rounded-md border border-neutral-800 bg-[linear-gradient(110deg,#000000,45%,#2a2a2a,55%,#000000)] bg-[length:200%_100%] px-12 py-6 font-medium text-neutral-400 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-50 shadow-md"
            onClick={onClickHandler}
          >
            {user?._id && token ? "Explore Workspace" : "Log In to Continue"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
