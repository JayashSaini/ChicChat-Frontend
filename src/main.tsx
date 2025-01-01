import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "@context/SliderContext.tsx";
import { Toaster } from "sonner";
import { store } from "@redux/store.ts";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <SidebarProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </SidebarProvider>
    </AuthProvider>
    <Toaster
      position="bottom-right"
      duration={2000}
      toastOptions={{
        className: "custom-toast",
      }}
    />
  </BrowserRouter>
);
