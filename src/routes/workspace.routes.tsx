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
import Profile from "@pages/profile";
import { MediaProvider } from "@context/MediaContext";

const WorkspaceRoutes: React.FC = () => (
  <PrivateRoute>
    <Routes>
      <Route path="/" element={<Workspace />}>
        {/* ChatContext is only required for chat routes */}

        <Route
          path="/chat/*"
          element={
            <ChatProvider>
              <ChatRoutes />
            </ChatProvider>
          }
        />

        {/* Stream-related routes */}
        <Route path="/stream" element={<Video />} />
        <Route path="/stream/*" element={<StreamRoutes />} />

        {/* Other routes */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </PrivateRoute>
);

const StreamRoutes = () => {
  return (
    <MediaProvider>
      <Routes>
        <Route path="/room/join/:roomId" element={<RequestToJoinRoom />} />
        <Route
          path="/room/:roomId"
          element={
            <RoomProvider>
              <Room />
            </RoomProvider>
          }
        />
      </Routes>
    </MediaProvider>
  );
};

export default WorkspaceRoutes;
