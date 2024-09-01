import * as React from "react";
import Tooltip from "@mui/material/Tooltip";

const ToolTip: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <Tooltip title={title} placement="right">
      <div className="m-auto">{children}</div>
    </Tooltip>
  );
};

export default ToolTip;
