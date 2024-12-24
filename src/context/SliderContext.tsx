import React, { useState, createContext, useEffect } from "react";

// Interface to define the properties available in the SidebarContext
interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
  theme: "dark" | "light";
  toggleTheme: () => void;
  isMobileScreen: boolean; // New property to track if it's a mobile screen
}

// Create the SidebarContext with an undefined default value
export const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

// SidebarProvider component to manage sidebar state and theme
export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
  initialTheme = "dark", // Default theme is dark
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
  initialTheme?: "dark" | "light";
}) => {
  // State to manage the open/close state of the sidebar
  const [openState, setOpenState] = useState(false);
  // State to manage the theme (dark or light)
  const [theme, setTheme] = useState<"dark" | "light">(initialTheme);
  // State to track whether the screen is mobile-sized or not
  const [isMobileScreen, setIsMobileScreen] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  // Determine which `open` and `setOpen` values to use, prioritizing passed props over internal state
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  // Handle screen size changes to update `isMobileScreen`
  const handleResize = () => {
    setIsMobileScreen(window.matchMedia("(max-width: 768px)").matches);
  };

  // Set up an effect to listen for window resizing events and clean up after the component unmounts
  useEffect(() => {
    // Add event listener for screen size changes
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to toggle between dark and light themes
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"; // Toggle theme
    setTheme(newTheme); // Update state with the new theme
    localStorage.setItem("theme", newTheme); // Store the theme in localStorage
    document.documentElement.className = newTheme; // Apply the theme to the document
  };

  // Load theme from localStorage or system preference on component mount
  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme: any = localStorage.getItem("theme") || "system";

    // If the saved theme is 'system', use the system's color scheme preference
    if (savedTheme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const newTheme = prefersDark ? "dark" : "light"; // Determine system preference
      setTheme(newTheme); // Set the theme state
      document.documentElement.className = newTheme; // Apply the theme to the document
      localStorage.setItem("theme", newTheme); // Store the theme in localStorage
    } else {
      setTheme(savedTheme); // Set theme from localStorage
      document.documentElement.className = savedTheme; // Apply the saved theme to the document
      localStorage.setItem("theme", savedTheme); // Store the theme in localStorage
    }
  }, []);

  // Return the SidebarContext.Provider with the necessary values
  return (
    <SidebarContext.Provider
      value={{ open, setOpen, animate, theme, toggleTheme, isMobileScreen }}
    >
      {children} {/* Render the children components */}
    </SidebarContext.Provider>
  );
};
