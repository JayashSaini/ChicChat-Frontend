import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ChatLayout from "@layout/chat.layout";
import { ChatProvider } from "@context/ChatContext";
import { useSidebar } from "@context/index";

import NotFound from "@components/NotFound";
import ErrorBoundary from "@components/ErrorBoundary";
import Loader from "@components/Loader";

// Lazy load components for chat sidebar and chat window
const ChatSidebar = React.lazy(() => import("@components/chat/ChatSidebar"));
const ChatWindow = React.lazy(() => import("@pages/chatWindow"));

const ChatRoutes: React.FC = () => {
  // Use the sidebar context to determine if the screen is mobile-sized
  const { isMobileScreen } = useSidebar();

  return (
    // Provide ChatContext to chat-related routes (like ChatSidebar and ChatWindow)
    <ChatProvider>
      <Routes>
        <Route path="/" element={<ChatLayout />}>
          {/* Index route should only trigger when user is on exact '/workspace/chat/' */}
          <Route
            path="/"
            element={
              isMobileScreen ? (
                // Show ChatSidebar on mobile screens within an ErrorBoundary
                <ErrorBoundary
                  fallback={<div>🥲 Error occur in Chat Sidebar.</div>}
                >
                  <Suspense fallback={<Loader />}>
                    <ChatSidebar />
                  </Suspense>
                </ErrorBoundary>
              ) : (
                // Redirect to '/workspace/chat/messages' if not on mobile screen
                <Navigate to="/workspace/chat/messages" />
              )
            }
          />
          {/* Route for displaying chat messages */}
          <Route
            path="/messages"
            element={
              <ErrorBoundary
                fallback={<div>🥲 Error occur in Chat Window.</div>}
              >
                <Suspense fallback={<div>Loading Chat Window...</div>}>
                  <ChatWindow />
                </Suspense>
              </ErrorBoundary>
            }
          />
          {/* Route to handle any undefined paths, showing the NotFound component */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ChatProvider>
  );
};

export default ChatRoutes;
