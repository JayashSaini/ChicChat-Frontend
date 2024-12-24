import { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@components/layout/slidebar";
import {
  IconArrowLeft,
  IconVideo,
  IconMessage,
  IconSettings,
} from "@tabler/icons-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { cn, LocalStorage, checkTokenExpiry } from "@utils/index";
import logoIcon from "@assets/logoicon.svg";
import logo from "@assets/logo.svg";
import logoDark from "@assets/logodark.svg";
import { useAuth } from "@context/AuthContext";
import Avatar from "@mui/material/Avatar";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { useSidebar } from "@context/SliderContext";

export const getLinks = (logout: any) => [
  {
    label: "Chat",
    href: "/workspace/chat",
    icon: <IconMessage className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Video",
    href: "/workspace/stream",
    icon: <IconVideo className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Settings",
    href: "/workspace/settings",
    icon: <IconSettings className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Logout",
    href: "#",
    icon: <IconArrowLeft className="h-5 w-5 flex-shrink-0" />,
    onClick: async () => {
      await logout();
    },
  },
];

function Workspace() {
  const token: string | null = LocalStorage.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const isTokenExpired = checkTokenExpiry(token);

      if (isTokenExpired) {
        navigate("/refresh-token/" + token);
      }
    }
  }, [token]);

  const { logout } = useAuth();

  const links = getLinks(logout);

  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useSidebar();

  const { user } = useAuth();

  return (
    <div
      className={cn(
        "w-full  rounded-md flex flex-col md:flex-row flex-1 overflow-hidden"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-backgroundTertiary">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-2  w-full">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="w-full  flex flex-col items-center justify-center">
            <SidebarLink
              link={{
                label: "theme",
                href: "#",
                icon: (
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
                ),
                onClick: () => {
                  toggleTheme();
                },
              }}
            />
            <SidebarLink
              link={{
                label: "Profile",
                href: "/workspace/profile",
                icon: (
                  <Avatar
                    src={
                      user?.avatar?.url ||
                      "https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg"
                    } // Placeholder image
                    className="h-5 w-5 flex-shrink-0 rounded-full"
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="w-full md:h-screen h-[calc(100vh-56px)] overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export const LogoIcon = () => {
  return (
    <Link to="/workspace/chat" className="relative z-20">
      <img
        src={logoIcon}
        alt="Logo Icon"
        style={{ width: "55px", height: "55px" }} // Inline styles to enforce size
        className="w-[55px] h-[55px] max-w-none select-none" // Tailwind CSS utility classes
      />
    </Link>
  );
};

export const Logo: React.FC<{
  theme: "dark" | "light";
}> = ({ theme }) => {
  return (
    <Link
      to="/workspace/chat"
      className="font-normal flex space-x-2 items-center py-1 relative z-20 select-none"
    >
      <img
        src={theme == "light" ? logoDark : logo}
        alt="Logo"
        className="w-[110px] "
      />
    </Link>
  );
};

export default Workspace;
