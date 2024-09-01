import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext.tsx";
import { SidebarProvider } from "@context/SliderContext.tsx";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </SidebarProvider>
      </AuthProvider>
      <Toaster
        position="bottom-right"
        duration={2000}
        closeButton={true}
        theme="system"
      />
    </BrowserRouter>
  </React.StrictMode>
);
