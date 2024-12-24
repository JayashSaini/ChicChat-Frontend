// Import necessary components and hooks
import { useState } from "react";
import Button from "@components/Button";
import Input from "@components/Input";
import { useAuth } from "@context/AuthContext";
import { Link } from "react-router-dom";

// Component for user registration
const Register = () => {
  // State to manage user registration data
  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
  });

  // Access the register function from the authentication context
  const { register } = useAuth();

  // Handle data change for input fields
  const handleDataChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      // Update the corresponding field in the data state
      setData({
        ...data,
        [name]: e.target.value,
      });
    };

  // Handle user registration
  const handleRegister = async () => await register(data);

  return (
    // Register form UI
    <div className="dark:bg-black/[0.96] bg-[#fefefe] flex justify-center items-center flex-col p-4 sm:h-screen h-[100vh] w-screen ">
      <div className="sm:max-w-screen-sm w-full p-4 flex justify-center items-center sm:gap-5 gap-4 flex-col shadow-md rounded-2xl border border-border">
        <h1 className="text-2xl m-4 text-textPrimary font-medium">
          Sign Up And Get Started
        </h1>
        {/* Input fields for email, username, and password */}
        <Input
          placeholder="Enter the email..."
          type="email"
          value={data.email}
          onChange={handleDataChange("email")}
        />
        <Input
          placeholder="Enter the username..."
          value={data.username}
          onChange={handleDataChange("username")}
        />
        <Input
          placeholder="Enter the password..."
          type="password"
          value={data.password}
          onChange={handleDataChange("password")}
        />
        {/* Register button */}
        <Button
          fullWidth
          disabled={Object.values(data).some((val) => !val)}
          onClick={handleRegister}
        >
          Sign up
        </Button>
        {/* Login link */}
        <small className="text-textSecondary">
          Already have an account?{" "}
          <Link className="text-primary hover:underline" to="/login">
            Login
          </Link>
        </small>
      </div>
    </div>
  );
};

export default Register;
