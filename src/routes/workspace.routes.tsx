import React from "react";
import { Route, Routes } from "react-router-dom";
import Workspace from "@layout/workspace.layout";
import PrivateRoute from "@components/PrivateRoute";
import ChatRoutes from "./chat.routes";
import NotFound from "@components/NotFound";
import { ChatProvider } from "@context/ChatContext";
import Video from "@pages/stream/stream";
import Settings from "@pages/settings";
import Room from "@pages/stream/room";
import { RoomProvider } from "@context/RoomContext";
import RequestToJoinRoom from "@pages/stream/requestToJoinRoom";

const WorkspaceRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Workspace />}>
      <Route path="/chat/*" element={<ChatRoutes />} />

      <Route path="/stream" element={<Video />} />
      <Route path="/stream/room/:roomId" element={<Room />} />
      <Route path="/stream/room/join/:roomId" element={<RequestToJoinRoom />} />
      <Route path="/settings" element={<Settings />} />

      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

const WorkspaceRoutesWrapper: React.FC = () => (
  <PrivateRoute>
    <ChatProvider>
      <RoomProvider>
        <WorkspaceRoutes />
      </RoomProvider>
    </ChatProvider>
  </PrivateRoute>
);

export default WorkspaceRoutesWrapper;
