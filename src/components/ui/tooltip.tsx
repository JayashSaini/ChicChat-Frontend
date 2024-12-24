import * as React from "react";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import {} from "@mui/material/Tooltip";

const ToolTip: React.FC<{
  title: string;
  children: React.ReactNode;
  placement?:
    | "right"
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "top-end"
    | "top-start"
    | "top";
}> = ({ title, children, placement = "right" }) => {
  return (
    <Tooltip title={title} placement={placement} TransitionComponent={Zoom}>
      <div>{children}</div>
    </Tooltip>
  );
};

export default ToolTip;
