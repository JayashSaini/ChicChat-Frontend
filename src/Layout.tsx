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
    href: "/chat",
    icon: <IconMessage className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Video",
    href: "/chat/video",
    icon: <IconVideo className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Settings",
    href: "/chat/settings",
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

function Layout() {
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

  return (
    <div
      className={cn(
        "w-full h-screen rounded-md flex flex-col md:flex-row flex-1 overflow-hidden"
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
          <div className="m-auto">
            <SidebarLink
              link={{
                label: "theme",
                href: "#",
                icon: (
                  <div className="bg-backgroundSecondary p-2 rounded-full">
                    {theme === "light" ? (
                      <NightsStayIcon className="text-blue-500" />
                    ) : (
                      <WbSunnyIcon className="text-primary" />
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
                href: "/chat/profile",
                icon: (
                  <Avatar
                    src="https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg" // Placeholder image
                    className="h-8 w-8 flex-shrink-0 rounded-full"
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="w-full h-screen overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export const LogoIcon = () => {
  return (
    <Link to="/chat" className="relative z-20">
      <img
        src={logoIcon}
        alt="Logo Icon"
        style={{ width: "55px", height: "55px" }} // Inline styles to enforce size
        className="w-[55px] h-[55px] max-w-none" // Tailwind CSS utility classes
      />
    </Link>
  );
};

export const Logo: React.FC<{
  theme: "dark" | "light";
}> = ({ theme }) => {
  return (
    <Link
      to="/chat"
      className="font-normal flex space-x-2 items-center py-1 relative z-20"
    >
      <img
        src={theme == "light" ? logoDark : logo}
        alt="Logo"
        className="sm:w-[110px] w-[120px]"
      />
    </Link>
  );
};

export default Layout;
