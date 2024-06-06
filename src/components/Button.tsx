import React from "react";
import { classNames } from "../utils";

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    fullWidth?: boolean;
    severity?: "primary" | "secondary" | "danger";
    size?: "base" | "small";
  }
> = ({ fullWidth, severity = "primary", size = "base", ...props }) => {
  return (
    <>
      <button
        {...props}
        className={classNames(
          "rounded-2xl inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm ease-in-out duration-150",
          fullWidth ? "w-full" : "py-2",
          severity === "secondary"
            ? "bg-[#3f4238] hover:bg-[#3f4238]/80 disabled:bg-[#3f4238]/50 outline outline-[1px] outline-zinc-400"
            : severity === "danger"
            ? "bg-[#be3144] hover:bg-[#be3144]/80 disabled:bg-[#be3144]/50"
            : "bg-[#167F76] hover:bg-[#167F76]/80 disabled:bg-[#167F76]/50",
          size === "small" ? "text-sm px-3 py-1.5" : "text-base px-4 py-3",
          props.className || ""
        )}
      >
        {props.children}
      </button>
    </>
  );
};

export default Button;
