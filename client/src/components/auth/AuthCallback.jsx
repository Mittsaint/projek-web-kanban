import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleLogin } = useAuth(); // We will add this function to AuthContext

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Call a function from context to store token and user data
      handleGoogleLogin(token);
      // Navigate to the main page after success
      navigate("/");
    } else {
      // If there is no token, there may be an error, redirect to login
      navigate("/login");
    }
  }, [searchParams, navigate, handleGoogleLogin]);

  return (
    <div className="flex-grow flex items-center justify-center w-full bg-gray-900">
      <p className="text-white text-xl">
        Authenticating with Google, please wait...
      </p>
    </div>
  );
};

export default AuthCallback;
