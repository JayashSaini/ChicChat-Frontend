import { cn } from "@utils/index"; // Utility function to combine class names
import React from "react";
import { AnimatePresence, motion } from "framer-motion"; // For animations
import { IconMenu2, IconX } from "@tabler/icons-react"; // Sidebar toggle icons
import { LinkProps, NavLink } from "react-router-dom"; // Link-related components
import { SidebarProvider } from "@context/SliderContext"; // Sidebar context
import { getLinks, Logo } from "@layout/workspace.layout"; // Links and Logo components
import { useAuth, useSidebar } from "@context/index"; // Custom hooks for authentication and sidebar
import ToolTip from "@components/ui/tooltip"; // Tooltip component for button descriptions
import WbSunnyIcon from "@mui/icons-material/WbSunny"; // Light theme icon
import NightsStayIcon from "@mui/icons-material/NightsStay"; // Dark theme icon

// Define the structure of a sidebar link
interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  onClick?: () => void; // Optional onClick handler
}

// Sidebar component that wraps children and provides context
export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode; // The children to render inside the sidebar
  open?: boolean; // Whether the sidebar is open
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>; // Function to toggle sidebar state
  animate?: boolean; // Whether to animate sidebar opening/closing
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

// Sidebar body that conditionally renders desktop and mobile sidebars
export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <div>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </div>
  );
};

// Desktop version of the sidebar with motion for animations
export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  return (
    <motion.div
      className={cn(
        "h-full bg-backgroundTertiary py-4 hidden md:flex md:flex-col flex-shrink-0", // Sidebar base styles
        className // Custom classes passed as props
      )}
      animate={{ width: "60px" }} // Animate width for desktop
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Mobile version of the sidebar with toggle and animations
export const MobileSidebar = ({
  className,

  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar(); // Sidebar state from context
  const { logout } = useAuth(); // Logout function from auth context
  const links = getLinks(logout); // Get sidebar links (includes logout)

  const { theme, toggleTheme } = useSidebar(); // Theme state and toggle function from context

  return (
    <div
      className={cn(
        "bg-backgroundTertiary h-10 px-4 py-7 flex flex-row md:hidden items-center justify-between w-full"
      )}
      {...props}
    >
      <div className="flex justify-between items-center z-20 w-full">
        <Logo theme={theme} /> {/* Logo */}
        <IconMenu2
          className="text-textPrimary"
          onClick={() => setOpen(!open)}
        />{" "}
        {/* Menu toggle icon */}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed h-full w-full inset-0 custom-main-bg p-10 z-[100] flex flex-col justify-between",
              className
            )}
          >
            {/* Close button */}
            <div
              className="absolute right-10 top-10 z-50 text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <IconX className="text-textPrimary" />
            </div>

            {/* Logo in the mobile sidebar */}
            <Logo theme={theme} />

            {/* Links list */}
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <div className="flex flex-col gap-2">
                {links.map((link, idx) =>
                  link?.onClick ? (
                    <div
                      key={idx}
                      className="flex items-center text-textPrimary justify-start gap-2 group/sidebar py-2 cursor-pointer"
                      onClick={link.onClick}
                      role="button"
                    >
                      <ToolTip title={link.label}>{link.icon}</ToolTip>
                      {link.label}
                    </div>
                  ) : (
                    <NavLink
                      to={link.href}
                      key={idx}
                      className="flex items-center text-textPrimary justify-start gap-2 group/sidebar py-2"
                      onClick={() => open && setOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </NavLink>
                  )
                )}
              </div>
            </div>

            {/* Theme toggle and profile link */}
            <div>
              <div
                className="flex items-center text-textPrimary justify-start gap-4 font-semibold group/sidebar py-2"
                onClick={toggleTheme}
              >
                <div className="bg-backgroundSecondary p-2 rounded-full">
                  {theme === "light" ? (
                    <NightsStayIcon
                      className="text-blue-500"
                      fontSize="small"
                    />
                  ) : (
                    <WbSunnyIcon className="text-primary" fontSize="small" />
                  )}
                </div>
              </div>
              <NavLink
                to="/workspace/profile"
                className="flex items-center text-textPrimary justify-start gap-4 font-semibold group/sidebar py-2"
                onClick={() => open && setOpen(false)}
              >
                <img
                  src="https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg"
                  className="flex-shrink-0 rounded-full"
                  width={35}
                  height={35}
                  alt="Avatar"
                />
                Profile
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// SidebarLink component for individual links
export const SidebarLink = ({
  link,

  ...props
}: {
  link: Links; // Sidebar link structure

  props?: LinkProps; // LinkProps for NavLink
}) => {
  const { open, setOpen } = useSidebar(); // Sidebar state from context
  return link?.onClick ? (
    <div
      className="m-auto flex items-center text-textPrimary justify-start gap-2 group/sidebar py-2 cursor-pointer"
      onClick={link.onClick}
      role="button"
    >
      <ToolTip title={link.label}>{link.icon}</ToolTip>
    </div>
  ) : (
    <NavLink
      to={link.href}
      className={({ isActive }) =>
        `m-auto flex items-center justify-start group/sidebar py-2 ${
          isActive ? "text-primary" : "text-textPrimary"
        }`
      }
      {...props}
      onClick={() => open && setOpen(false)} // Close sidebar after clicking
    >
      <ToolTip title={link.label}>{link.icon}</ToolTip>
    </NavLink>
  );
};
