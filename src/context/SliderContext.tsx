import React, { useState, createContext, useContext, useEffect } from "react";

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
  theme: "dark" | "light";
  toggleTheme: () => void;
  isMobileScreen: boolean; // New property
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
  initialTheme = "dark",
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
  initialTheme?: "dark" | "light";
}) => {
  const [openState, setOpenState] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(initialTheme);
  const [isMobileScreen, setIsMobileScreen] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  // Handle screen size changes
  const handleResize = () => {
    setIsMobileScreen(window.matchMedia("(max-width: 768px)").matches);
  };

  useEffect(() => {
    // Add event listener for screen size changes
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Theme Handler
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className = newTheme;
  };

  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme: any = localStorage.getItem("theme") || "system";
    if (savedTheme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const newTheme = prefersDark ? "dark" : "light";
      setTheme(newTheme);
      document.documentElement.className = newTheme;
      localStorage.setItem("theme", newTheme);
    } else {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
      localStorage.setItem("theme", savedTheme);
    }
  }, []);

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, animate, theme, toggleTheme, isMobileScreen }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
