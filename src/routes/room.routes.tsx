import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import NotFound from "@components/NotFound";
import ErrorBoundary from "@components/ErrorBoundary";
import Room from "@pages/video/room";
import Loader from "@components/Loader";

// Lazy load components for chat sidebar and chat window
const RoomJoinRequest = React.lazy(
  () => import("@pages/video/roomJoinRequest")
);

const RoomRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Route for requesting admin to join the room */}
      <Route
        path="/join/:roomId"
        element={
          <ErrorBoundary
            fallback={<div>🥲 Error occur in Room Join Request Page.</div>}
          >
            <Suspense fallback={<Loader />}>
              <RoomJoinRequest />
            </Suspense>
          </ErrorBoundary>
        }
      />

      <Route
        path="/:roomId"
        element={
          <ErrorBoundary
            fallback={<div>🥲 Error occur in Room Join Request Page.</div>}
          >
            <Suspense fallback={<Loader />}>
              <Room />
            </Suspense>
          </ErrorBoundary>
        }
      />

      {/* Route to handle any undefined paths, showing the NotFound component */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoomRoutes;
