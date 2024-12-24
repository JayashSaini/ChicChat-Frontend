// Import necessary components and hooks
import { useState } from "react";
import Button from "@components/Button";
import Input from "@components/Input";
import { useAuth } from "@context/index";
import { Link } from "react-router-dom";

// Component for user registration
const Register = () => {
  // State to manage user registration data (email, username, password)
  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
  });

  // Access the register function from the authentication context
  const { register } = useAuth();

  // Handle data change for input fields
  // The handleDataChange function updates the corresponding field in the data state
  const handleDataChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({
        ...data,
        [name]: e.target.value, // Update specific field in data state
      });
    };

  // Handle user registration by calling the register function from context
  const handleRegister = async () => await register(data);

  return (
    // Register form UI container
    <div className="dark:bg-black/[0.96] bg-[#fefefe] flex justify-center items-center flex-col p-4 sm:h-screen h-[100vh] w-screen">
      <div className="sm:max-w-screen-sm w-full p-4 flex justify-center items-center sm:gap-5 gap-4 flex-col shadow-md rounded-2xl border border-border">
        <h1 className="text-2xl m-4 text-textPrimary font-medium">
          Sign Up And Get Started
        </h1>

        {/* Input fields for email, username, and password */}
        <Input
          placeholder="Enter the email..."
          type="email"
          value={data.email}
          onChange={handleDataChange("email")} // Update email in state
        />
        <Input
          placeholder="Enter the username..."
          value={data.username}
          onChange={handleDataChange("username")} // Update username in state
        />
        <Input
          placeholder="Enter the password..."
          type="password"
          value={data.password}
          onChange={handleDataChange("password")} // Update password in state
        />

        {/* Register button */}
        <Button
          fullWidth
          disabled={Object.values(data).some((val) => !val)} // Disable if any field is empty
          onClick={handleRegister} // Trigger registration on click
        >
          Sign up
        </Button>

        {/* Login link for users who already have an account */}
        <small className="text-textSecondary">
          Already have an account?{" "}
          <Link
            className="text-primary hover:underline"
            to="/login" // Redirect to login page
          >
            Login
          </Link>
        </small>
      </div>
    </div>
  );
};

export default Register;
