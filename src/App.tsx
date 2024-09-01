// Importing required modules and components from react-router-dom and other files.
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import ChatPage from "./pages/chat";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { useEffect } from "react";
import Layout from "./Layout";

// Main App component
const App = () => {
  // Extracting 'token' and 'user' from the authentication context
  const { token, user } = useAuth();

  // Set dark mode if the user's system prefers it
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <Routes>
      {/* Redirect to chat if authenticated, otherwise to login */}
      <Route
        path="/"
        element={
          token && user?._id ? (
            <Navigate to="/chat" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Public login route: Accessible by everyone */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Public register route: Accessible by everyone */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Layout route wrapping the chat page */}
      <Route path="/chat" element={<Layout />}>
        <Route
          index
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <div className="w-full h-screen bg-background flex items-center justify-center">
              <p className="text-base text-textPrimary">
                404 Page Not Found | Not Designed yet
              </p>
            </div>
          }
        />
      </Route>

      {/* Wildcard route for undefined paths */}
      <Route
        path="*"
        element={
          <div className="w-full h-screen bg-background flex items-center justify-center">
            <p className="text-base text-textPrimary">
              404 Page Not Found | Not Designed yet
            </p>
          </div>
        }
      />
    </Routes>
  );
};

// Exporting the App component to be used in other parts of the application
export default App;
