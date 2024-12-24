import React, { Suspense } from "react";
import ErrorBoundary from "@components/ErrorBoundary";
import { useSidebar } from "@context/index";
import { Outlet } from "react-router-dom";
import Loader from "@components/Loader";

const ChatSideBar = React.lazy(() => import("@components/chat/ChatSidebar"));

const Chat = () => {
  const { isMobileScreen } = useSidebar();

  return (
    <div className="bg-background w-full md:h-screen h-[calc(100vh-56px)] flex">
      {!isMobileScreen && (
        <ErrorBoundary
          fallback={
            <div className="text-center text-lg text-gray-500">
              🥲 Something went wrong with the Chat Sidebar. Please try again
              later.
            </div>
          }
        >
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
