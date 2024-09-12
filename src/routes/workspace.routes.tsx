import React from "react";
import { Route, Routes } from "react-router-dom";
import Workspace from "@layout/workspace.layout";
import PrivateRoute from "@components/PrivateRoute";
import ChatRoutes from "./chat.routes";
import NotFound from "@components/NotFound";
import { ChatProvider } from "@context/ChatContext";
import Video from "@pages/video";
import Settings from "@pages/settings";

const WorkspaceRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Workspace />}>
      <Route index={true} path="/chat/*" element={<ChatRoutes />} />

      <Route path="/video" element={<Video />} />
      <Route path="/settings" element={<Settings />} />

      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

const WorkspaceRoutesWrapper: React.FC = () => (
  <PrivateRoute>
    <ChatProvider>
      <WorkspaceRoutes />
    </ChatProvider>
  </PrivateRoute>
);

export default WorkspaceRoutesWrapper;
