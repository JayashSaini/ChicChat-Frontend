import React, { Suspense } from "react";
import ErrorBoundary from "@components/ErrorBoundary";
import { useSidebar } from "@context/SliderContext";
import { Outlet } from "react-router-dom";
import Loader from "@components/Loader";
const ChatSideBar = React.lazy(() => import("@components/chat/ChatSidebar"));

const Chat = () => {
  const { isMobileScreen } = useSidebar();
  return (
    <div className="bg-background w-full md:h-screen h-[calc(100vh-56px)] flex">
      {!isMobileScreen && (
        <ErrorBoundary fallback={<div>🥲 Error occur in Chat Sidebar.</div>}>
          <Suspense fallback={<Loader />}>
            <ChatSideBar />
          </Suspense>
        </ErrorBoundary>
      )}
      <Outlet />
    </div>
  );
};

export default Chat;
