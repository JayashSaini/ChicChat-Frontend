import * as React from "react";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

const ToolTip: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <Tooltip title={title} placement="right" TransitionComponent={Zoom}>
      <div>{children}</div>
    </Tooltip>
  );
};

export default ToolTip;
