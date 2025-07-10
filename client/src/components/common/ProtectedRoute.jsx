import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom"; // 1. Import Outlet
import { useAuth } from "../../hooks/useAuth";

/**
 * A wrapper component that checks for user authentication.
 * If the user is not authenticated, it redirects them to the login page.
 * Otherwise, it renders the matched child route via the <Outlet /> component.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if authenticated.
 */
const ProtectedRoute = () => { // Removed 'children' from props as it's not used
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show a loading state while the auth context is initializing.
  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // If not authenticated after checking, redirect to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If authenticated, render the matched child route component (e.g., ProjectsPage)
  return <Outlet />;
};

export default ProtectedRoute;
