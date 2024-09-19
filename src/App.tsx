import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import PublicRoute from "./components/PublicRoute";
import WorkspaceRoutesWrapper from "@routes/workspace.routes";
import NotFound from "@components/NotFound";

const App = () => {
  return (
    <Routes>
      {/* Root route: redirect based on authentication */}
      <Route path="/" index element={<Home />} />

      {/* Public login route */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Public register route */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Private workspace route */}
      <Route path="/workspace/*" element={<WorkspaceRoutesWrapper />} />

      {/* Global 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
