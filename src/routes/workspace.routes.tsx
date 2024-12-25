import React from "react";
import { Route, Routes } from "react-router-dom";
import Workspace from "@layout/workspace.layout";
import PrivateRoute from "@components/PrivateRoute";
import ChatRoutes from "./chat.routes";
import NotFound from "@components/NotFound";

import Settings from "@pages/settings";
import Profile from "@pages/profile";
import Video from "@pages/video/video";
import RoomRoutes from "./room.routes";

const WorkspaceRoutes: React.FC = () => (
  // Wrap all routes with PrivateRoute for authentication protection
  <PrivateRoute>
    <Routes>
      <Route path="/" element={<Workspace />}>
        {/* ChatContext is only required for chat-related routes */}
        <Route path="/chat/*" element={<ChatRoutes />} />

        <Route path="/video" element={<Video />} />

        <Route path="/video/room/*" element={<RoomRoutes />} />

        {/* Other user-specific routes */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />

        {/* Catch-all route for undefined paths, showing the NotFound component */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </PrivateRoute>
);

export default WorkspaceRoutes;
