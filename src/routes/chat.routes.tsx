import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ChatLayout from "@layout/chat.layout";
import { useSidebar } from "@context/SliderContext";
import NotFound from "@components/NotFound";
import ErrorBoundary from "@components/ErrorBoundary";
import Loader from "@components/Loader";
const ChatSidebar = React.lazy(() => import("@components/chat/ChatSidebar"));
const ChatWindow = React.lazy(() => import("@pages/chatWindow"));

const ChatRoutes: React.FC = () => {
  const { isMobileScreen } = useSidebar();

  return (
    <Routes>
      <Route path="/" element={<ChatLayout />}>
        {/* Index route should only trigger when user is on exact '/workspace/chat/' */}
        <Route
          path="/"
          element={
            isMobileScreen ? (
              <ErrorBoundary
                fallback={<div>🥲 Error occur in Chat Sidebar.</div>}
              >
                <Suspense fallback={<Loader />}>
                  <ChatSidebar />
                </Suspense>
              </ErrorBoundary>
            ) : (
              <Navigate to="/workspace/chat/messages" />
            )
          }
        />
        {/* Messages route */}
        <Route
          path="/messages"
          element={
            <ErrorBoundary fallback={<div>🥲 Error occur in Chat Window.</div>}>
              <Suspense fallback={<div>Loading Chat Window...</div>}>
                <ChatWindow />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default ChatRoutes;
