import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import NotFound from "@components/NotFound";
import ErrorBoundary from "@components/ErrorBoundary";
import { MediaProvider } from "@context/MediaContext";

// Lazy load components for chat sidebar and chat window
const RoomJoinRequest = React.lazy(
  () => import("@pages/video/roomJoinRequest")
);

const RoomRoutes: React.FC = () => {
  return (
    <MediaProvider>
      <Routes>
        {/* Route for requesting admin to join the room */}
        <Route
          path="/join/:roomId"
          element={
            <ErrorBoundary
              fallback={<div>🥲 Error occur in Room Join Request Page.</div>}
            >
              <Suspense fallback={<div>Loading Room Data...</div>}>
                <RoomJoinRequest />
              </Suspense>
            </ErrorBoundary>
          }
        />

        {/* Route to handle any undefined paths, showing the NotFound component */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MediaProvider>
  );
};

export default RoomRoutes;
