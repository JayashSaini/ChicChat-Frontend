import { cn } from "@utils/index";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { LinkProps, NavLink } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@context/SliderContext";
import { getLinks, Logo } from "@layout/workspace.layout";
import { useAuth } from "@context/AuthContext";
import ToolTip from "@components/ui/tooltip";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  onClick?: () => void;
}

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <div>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </div>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <motion.div
        className={cn(
          "h-full bg-backgroundTertiary  py-4 hidden  md:flex md:flex-col  flex-shrink-0",
          className
        )}
        animate={{
          width: "60px",
        }}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  const { logout } = useAuth();
  const links = getLinks(logout);

  const { theme, toggleTheme } = useSidebar();

  return (
    <>
      <div
        className={cn(
          " bg-backgroundTertiary h-10 px-4 py-7 flex flex-row md:hidden  items-center justify-between w-full"
        )}
        {...props}
      >
        <div className="flex justify-between items-center z-20 w-full">
          <Logo theme={theme} />

          <IconMenu2
            className="text-textPrimary"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 custom-main-bg p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-200"
                onClick={() => setOpen(!open)}
              >
                <IconX className="text-textPrimary" />
              </div>
              <Logo theme={theme} />
              <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col gap-2">
                  {links.map((link, idx) => {
                    return link?.onClick ? (
                      <div
                        key={idx}
                        className="flex items-center text-textPrimary justify-start gap-2  group/sidebar py-2 cursor-pointer"
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
                        onClick={() => {
                          if (open) setOpen(false);
                        }}
                      >
                        {link.icon}
                        {link.label}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
              <div>
                <div
                  className="flex items-center text-textPrimary justify-start gap-4 font-semibold group/sidebar py-2"
                  onClick={() => {
                    toggleTheme();
                  }}
                >
                  <div className=" bg-backgroundSecondary p-2 rounded-full">
                    {theme === "light" ? (
                      <NightsStayIcon
                        className="text-blue-500 "
                        fontSize="small"
                      />
                    ) : (
                      <WbSunnyIcon className="text-primary " fontSize="small" />
                    )}
                  </div>
                </div>
                <NavLink
                  to={"/workspace/profile"}
                  className="flex items-center text-textPrimary justify-start gap-4 font-semibold group/sidebar py-2"
                  onClick={() => {
                    if (open) setOpen(false);
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg" // Placeholder image
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
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, setOpen } = useSidebar();
  return link?.onClick ? (
    <div
      className="m-auto flex items-center text-textPrimary justify-start gap-2  group/sidebar py-2 cursor-pointer"
      onClick={link.onClick}
      role="button"
    >
      <ToolTip title={link.label}>{link.icon}</ToolTip>
    </div>
  ) : (
    <NavLink
      to={link.href}
      className={({ isActive }) =>
        `m-auto flex items-center  justify-start  group/sidebar py-2 ${
          isActive ? "text-primary" : "text-textPrimary"
        }`
      }
      {...props}
      onClick={() => {
        if (open) setOpen(false);
      }}
    >
      <ToolTip title={link.label}>{link.icon}</ToolTip>
    </NavLink>
  );
};
