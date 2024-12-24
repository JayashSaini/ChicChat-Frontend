import React from "react";
import { classNames } from "../utils";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return (
    <input
      {...props}
      className={classNames(
        "block w-full rounded-md border border-border py-3 px-4 bg-transparent text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-[#ffc1079f]",
        props.className || ""
      )}
    />
  );
};

export default Input;
