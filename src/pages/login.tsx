// Importing necessary components and hooks
import { useState } from "react";
import Button from "@components/Button";
import Input from "@components/Input";
import { useAuth } from "@context/AuthContext";
import { Link } from "react-router-dom";

// Component for the Login page
const Login = () => {
  // State to manage input data (username and password)
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  // Accessing the login function from the AuthContext
  const { login } = useAuth();

  // Function to update state when input data changes
  const handleDataChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({
        ...data,
        [name]: e.target.value,
      });
    };

  // Function to handle the login process
  const handleLogin = async () => await login(data);

  return (
    <div className="dark:bg-black/[0.96] bg-[#fefefe] flex justify-center items-center flex-col p-4 sm:h-screen h-[100vh] w-screen">
      <div className="sm:max-w-screen-sm w-full p-4 flex justify-center items-center sm:gap-5 gap-4 flex-col  shadow-md rounded-2xl  border border-border">
        <h1 className="text-2xl m-4 text-textPrimary font-medium">
          Sign In to your Account
        </h1>
        {/* Input for entering the username */}
        <Input
          placeholder="Enter the username..."
          value={data.username}
          onChange={handleDataChange("username")}
        />
        {/* Input for entering the password */}
        <Input
          placeholder="Enter the password..."
          type="password"
          value={data.password}
          onChange={handleDataChange("password")}
        />
        {/* Button to initiate the login process */}
        <Button
          disabled={Object.values(data).some((val) => !val)}
          fullWidth
          onClick={handleLogin}
        >
          Login
        </Button>
        {/* Link to the registration page */}
        <small className="text-textSecondary">
          Don&apos;t have an account?{" "}
          <Link className="text-primary hover:underline" to="/register">
            Register
          </Link>
        </small>
      </div>
    </div>
  );
};

export default Login;
