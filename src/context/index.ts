// Importing necessary hooks and context from React and other context files
import { useContext } from "react";
import { AuthContext } from "./AuthContext"; // Context for authentication
import { ChatContext } from "./ChatContext"; // Context for chat-related data
import { SidebarContext } from "./SliderContext"; // Context for sidebar state management

// Custom hook to access the authentication context
export const useAuth = () => {
  // useContext is used to consume the AuthContext value
  return useContext(AuthContext);
};

// Custom hook to access the chat context
export const useChat = () => useContext(ChatContext);

// Custom hook to access the sidebar context
export const useSidebar = () => {
  // Retrieving the SidebarContext value
  const context = useContext(SidebarContext);

  // If the context is undefined, it means the hook is being used outside of a SidebarProvider
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  // Returning the sidebar context value if valid
  return context;
};
