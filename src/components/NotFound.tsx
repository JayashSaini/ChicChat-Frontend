import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button"; // Import custom Button component

const NotFound: React.FC = () => {
  const navigate = useNavigate(); // Hook to handle navigation

  return (
    <div className="bg-background w-full h-screen flex flex-col items-center justify-center text-center">
      {/* Display the 404 error */}
      <h1 className="text-4xl text-textPrimary font-bold mb-4">404</h1>

      {/* Message indicating the page is not found */}
      <p className="text-lg text-textSecondary mb-6">
        Page not found | This page isn't designed yet
      </p>

      {/* Button to navigate back to the home page */}
      <Button onClick={() => navigate("/workspace/chat")} size="base">
        Go Back to Home
      </Button>
    </div>
  );
};

export default NotFound;
