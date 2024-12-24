import React from "react";
import { Route, Routes } from "react-router-dom";
import Workspace from "@layout/workspace.layout";
import PrivateRoute from "@components/PrivateRoute";
import ChatRoutes from "./chat.routes";
import NotFound from "@components/NotFound";
import { ChatProvider } from "@context/ChatContext";

import Settings from "@pages/settings";
import Profile from "@pages/profile";

const WorkspaceRoutes: React.FC = () => (
  // Wrap all routes with PrivateRoute for authentication protection
  <PrivateRoute>
    <Routes>
      <Route path="/" element={<Workspace />}>
        {/* ChatContext is only required for chat-related routes */}
        <Route
          path="/chat/*"
          element={
            // Provide ChatContext to chat-related routes (like ChatSidebar and ChatWindow)
            <ChatProvider>
              <ChatRoutes />
            </ChatProvider>
          }
        />

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
