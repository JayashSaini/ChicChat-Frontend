import React, { useState } from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { VscSmiley } from "react-icons/vsc";
import { toast } from "sonner";
import { styled, TooltipProps } from "@mui/material";

const ReactionPicker: React.FC = () => {
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const emojis = ["😊", "❤️", "🎉", "👍", "😢"];

  // Handle emoji click
  const handleReactionClick = (emoji: string) => {
    setSelectedReaction(emoji);
    setIsPickerVisible(false); // Close the picker after selection
    toast("send to all", {
      duration: 4000,
      icon: <>{emoji}</>,
    });

    // Trigger confetti animation for the selected emoji
  };

  // Handle tooltip close when clicking outside
  const handleTooltipClose = () => {
    setIsPickerVisible(false);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div style={{ display: "inline-block", position: "relative" }}>
        {/* Tooltip with emoji picker */}
        <CustomTooltip
          open={isPickerVisible}
          onOpen={() => setIsPickerVisible(true)}
          onClose={handleTooltipClose}
          title={
            <Box
              sx={{
                display: "flex",
                gap: 1,
                padding: 1,
                backgroundColor: "#171717",
                borderRadius: 10,
                boxShadow: 3,
              }}
            >
              {emojis.map((emoji) => (
                <IconButton
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  size="small"
                  sx={{
                    fontSize: "1.5rem",
                    color: "#ffffff", // Ensure proper color contrast
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.2)", // Add hover effect
                    },
                  }}
                >
                  <span style={{ fontSize: "1.4rem", color: "inherit" }}>
                    {emoji}
                  </span>
                </IconButton>
              ))}
            </Box>
          }
          placement="top"
          arrow
        >
          {/* Emoji button to toggle the picker */}
          <IconButton
            onClick={() => setIsPickerVisible((prev) => !prev)}
            size="large"
            sx={{ fontSize: "1.5rem" }}
          >
            <VscSmiley className="text-textPrimary" />
          </IconButton>
        </CustomTooltip>
      </div>
    </ClickAwayListener>
  );
};

// Custom Tooltip for improved styling
const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "transparent",
    border: "none",
  },
}));

export default ReactionPicker;
