import React from "react";
import { classNames } from "../utils";
import { LuLoader2 } from "react-icons/lu";

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    fullWidth?: boolean;
    severity?: "primary" | "secondary" | "danger";
    size?: "base" | "small";
    isLoading?: boolean;
  }
> = ({
  fullWidth,
  severity = "primary",
  size = "base",
  isLoading = false,
  ...props
}) => {
  return (
    <button
      {...props}
      className={classNames(
        "rounded-md inline-flex justify-center items-center text-center text-buttonText focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 shadow-sm ease-in-out duration-150",
        fullWidth ? "w-full" : "py-2",
        severity === "secondary"
          ? "bg-transparent  disabled:bg-[#ffc107]/60 border dark:border-[#fefefe] border-[#121212]  dark:text-[#fefefe] text-[#121212]"
          : severity === "danger"
          ? "bg-danger hover:bg-danger/80 disabled:bg-danger/50 text-white border border-danger"
          : "bg-buttonBg hover:bg-[#ffc107]/80 disabled:bg-[#ffc107]/60",
        size === "small" ? "text-sm px-3 py-1.5" : "text-base px-4 py-3",
        props.className || ""
      )}
      disabled={isLoading}
    >
      {isLoading ? (
        <LuLoader2 size={24} className="animate-spin" />
      ) : (
        props.children
      )}
    </button>
  );
};

export default Button;
