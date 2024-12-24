import React from "react";
import { classNames } from "../utils"; // Utility function for combining class names
import { LuLoader2 } from "react-icons/lu"; // Loader icon from react-icons

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    fullWidth?: boolean; // If true, button will take full width
    severity?: "primary" | "secondary" | "danger"; // Defines the button style
    size?: "base" | "small"; // Defines the size of the button
    isLoading?: boolean; // If true, shows a loading spinner instead of button text
  }
> = ({
  fullWidth, // Optional prop for full-width button
  severity = "primary", // Default to primary severity
  size = "base", // Default to base size
  isLoading = false, // Default to not loading
  ...props // Spread remaining props for additional button attributes
}) => {
  return (
    <button
      {...props} // Spread all other button props (e.g., onClick)
      className={classNames(
        // Base styles for button (rounded, centered text, shadow, etc.)
        "rounded-md inline-flex justify-center items-center text-center text-buttonText focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 shadow-sm ease-in-out duration-150",

        // Conditional width if fullWidth is true
        fullWidth ? "w-full" : "py-2",

        // Conditional styles based on severity
        severity === "secondary"
          ? "bg-transparent  disabled:bg-[#ffc107]/60 border dark:border-[#fefefe] border-[#121212]  dark:text-[#fefefe] text-[#121212]"
          : severity === "danger"
            ? "bg-danger hover:bg-danger/80 disabled:bg-danger/50 text-white border border-danger"
            : "bg-buttonBg hover:bg-[#ffc107]/80 disabled:bg-[#ffc107]/60",

        // Conditional styles based on size
        size === "small" ? "text-sm px-3 py-1.5" : "text-base px-4 py-3",

        // Allow custom additional classes via props.className
        props.className || ""
      )}
      // Disable the button if it's loading
      disabled={isLoading}
    >
      {/* Show a loading spinner if the button is loading */}
      {isLoading ? (
        <LuLoader2 size={24} className="animate-spin" />
      ) : (
        // Otherwise, show the button's children (e.g., text)
        props.children
      )}
    </button>
  );
};

export default Button;
