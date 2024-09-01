import { Logo } from "../Layout";
import { useState } from "react";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import ToolTip from "@components/ui/tooltip";
import { useSidebar } from "@context/SliderContext";

const chat = () => {
  const [localSearchQuery, setLocalSearchQuery] = useState(""); // For local search functionality
  const { theme } = useSidebar();
  return (
    <div className="bg-background w-full h-screen">
      {" "}
      <div className="w-1/3 h-full bg-backgroundSecondary relative  overflow-y-auto border-r-[1px]  border-r-border">
        <div className="z-10 w-full sticky top-0  py-4 px-4 flex justify-between items-center gap-4">
          <div className="w-full">
            <div className="mb-3 flex justify-between items-center">
              <Logo theme={theme} />
              <ToolTip title="Add User">
                {" "}
                <AddCommentOutlinedIcon className="text-textSecondary cursor-pointer sm:text-lg text-sm" />
              </ToolTip>
            </div>

            <input
              placeholder="Search user or group..."
              className=" text-[15px] bg-backgroundTertiary block w-full rounded-[5px] border border-border py-2 px-3  text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-[1px] focus:ring-primary"
              value={localSearchQuery}
              onChange={(e) =>
                setLocalSearchQuery(e.target.value.toLowerCase())
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default chat;
