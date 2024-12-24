import React from "react";
import { LuLoader2 } from "react-icons/lu";
import { motion, HTMLMotionProps } from "framer-motion";

interface SecondaryButtonProps extends HTMLMotionProps<"button"> {
  fullWidth?: boolean;
  isLoading?: boolean;
  severity?: "primary" | "secondary";
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  fullWidth = true,
  isLoading = false,
  severity = "primary",
  children,
  ...props
}) => {
  return (
    <motion.button
      {...props}
      whileHover={isLoading ? {} : { scale: 1.05 }} // Only apply hover animation if not loading
      className={`inline-flex items-center justify-center rounded-md border dark:border-[#202020] border-[#e0e0e0] 
        transition-transform transform focus:outline-none  px-16 py-3 font-medium text-textPrimary
        ${isLoading ? "cursor-not-allowed opacity-70" : ""}
        ${
          severity == "primary"
            ? "dark:bg-[linear-gradient(110deg,#111111,33%,#2a2a2a,55%,#111111)] bg-[linear-gradient(110deg,#f5f5f5,33%,#e0e0e0,55%,#f5f5f5)]"
            : ""
        } 
        ${fullWidth ? "w-full" : "md:w-auto w-[260px]"}
        bg-[length:200%_100%] hover:animate-shimmer`}
      disabled={isLoading} // Handle the disabled state
      aria-busy={isLoading} // Accessibility
    >
      {isLoading ? <LuLoader2 size={24} className="animate-spin" /> : children}
    </motion.button>
  );
};

export default SecondaryButton;
