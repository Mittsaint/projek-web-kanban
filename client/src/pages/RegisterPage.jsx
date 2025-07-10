// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService"; // Using the actual service

// --- Reusable SVG Icons ---
const Icon = ({ name, className }) => {
  const icons = {
    logo: (
      <path d="M15.59,2.25L15.59,2.25c-1.9-1.9-5.06-1.9-6.96,0l-4.04,4.04c-1.9,1.9-1.9,5.06,0,6.96l0,0c1.9,1.9,5.06,1.9,6.96,0l4.04-4.04C17.5,7.31,17.5,4.15,15.59,2.25z M8.41,11.59c-0.78,0.78-2.05,0.78-2.83,0l0,0c-0.78-0.78-0.78-2.05,0-2.83l4.04-4.04c0.78-0.78,2.05-0.78,2.83,0l0,0c0.78,0.78,0.78,2.05,0,2.83L8.41,11.59z" />
    ),
    user: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    ),
    email: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    ),
    password: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    ),
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      {icons[name]}
    </svg>
  );
};

// --- Reusable Form Input Component ---
const FormInput = ({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  iconName,
}) => (
  <div>
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon name={iconName} className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={name}
        required
        className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow duration-200"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

const GoogleIcon = () => (
  <svg
    className="h-5 w-5 mr-3"
    aria-hidden="true"
    focusable="false"
    data-prefix="fab"
    data-icon="google"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 488 512"
  >
    <path
      fill="currentColor"
      d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 265.4c0-44.5 10.3-85.3 28.1-122.4l-7.9-32.5-32.5-7.9C10.3 64.5 0 110.3 0 161.4 0 248.4 67.2 320 150 320c26.3 0 50.3-6.8 71.2-18.4l2.2-1.3 32.5 7.9 7.9 32.5c44.5 18.2 90.3 28.1 137.6 28.1 141.2 0 244-110.3 244-248.4 0-44.5-10.3-85.3-28.1-122.4l-7.9-32.5-32.5-7.9C430.3 64.5 488 110.3 488 161.4c0 44.5-10.3 85.3-28.1 122.4zM150 192c-26.3 0-50.3 6.8-71.2 18.4l-2.2 1.3-32.5-7.9-7.9-32.5C64.5 130.3 110.3 0 244 0c133.7 0 244 110.3 244 248.4 0 44.5-10.3 85.3-28.1 122.4l7.9 32.5 32.5 7.9C430.3 447.5 488 391.7 488 320c0-132.8-108.8-240-244-240-103.9 0-192.5 67.2-226.5 158.6l2.2 1.3 32.5 7.9 7.9 32.5C100.3 185.2 124.3 192 150 192z"
    ></path>
  </svg>
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      await authService.register(payload);

      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred during registration.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const width = 600,
      height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    // Pastikan URL ini benar dan menggunakan environment variable jika ada
    const url = `${
      import.meta.env.VITE_APP_API_URL || "http://localhost:5000"
    }/api/auth/google`;

    // Gunakan window.open untuk membuat popup
    window.open(
      url,
      "googleLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Pane (Branding) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-tr from-blue-800 to-indigo-500 text-white p-12">
        <div className="max-w-md text-center">
          <svg
            className="mx-auto h-16 w-16 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <Icon name="logo" />
          </svg>
          <h1 className="mt-6 text-4xl font-bold tracking-tight">
            Join Boardly Today
          </h1>
          <p className="mt-4 text-lg text-blue-200">
            Start organizing your life and work. Create an account to unlock
            your team's full potential.
          </p>
        </div>
      </div>

      {/* Right Pane (Registration) */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Create a new account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-8">
            {/* Google Auth Button */}
            <div>
              <button
                onClick={handleGoogleAuth}
                className="flex w-full justify-center items-center gap-2 rounded-md bg-white px-3 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="relative mt-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or create an account with
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-6 mt-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm font-medium text-red-800">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="rounded-md bg-green-50 p-4 text-sm font-medium text-green-800">
                  {successMessage}
                </div>
              )}

              <FormInput
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                iconName="user"
              />
              <FormInput
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                iconName="email"
              />
              <FormInput
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                iconName="password"
              />
              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                iconName="password"
              />

              <div>
                <button
                  type="submit"
                  disabled={isLoading || successMessage}
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
