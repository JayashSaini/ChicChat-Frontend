import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-background w-full h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl text-textPrimary  font-bold mb-4">404</h1>
      <p className="text-lg text-textSecondary mb-6">
        Page not found | This page isn't designed yet
      </p>
      <Button onClick={() => navigate("/workspace/chat")} size="base">
        Go Back to Home
      </Button>
    </div>
  );
};

export default NotFound;
