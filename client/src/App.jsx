import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner"; // Import Toaster dari sonner
import { useAuth } from "./hooks/useAuth";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";

// Import Layout
import Sidebar from "./components/layout/Sidebar";
import SidebarAdmin from "./components/layout/SidebarAdmin";

// Import Pages
import HomePage from "./pages/homepage/HomePage.jsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BoardDetailPage from "./pages/BoardPage";
import AdminPage from "./pages/admin/AdminPage.jsx";
import UserProfilePage from "./pages/profile/ProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage";
import ArchivedPage from "./pages/ArchivedPage";
import ActivityPage from "./pages/ActivityPage";
import ProjectsPage from "./pages/ProjectsPage";
import BoardManagementPage from "./pages/admin/BoardManagementPage";
import PermissionsPage from "./pages/admin/PermissionPage.jsx";
import HelpPage from "./pages/HelpPage";
import WhatsNewPage from "./pages/WhatsNewPage";
import ContactSupportPage from "./pages/ContactSupportPage";
import ProfilePage from "./pages/profile/ProfilePage";

// Import Route Protectors
import ProtectedRoute from "./components/common/ProtectedRoute";
import ProtectedRouteAdmin from "./components/common/ProtectedRouteAdmin";
import AuthCallback from "./components/auth/AuthCallback.jsx";

function App() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Jika pengguna sudah terotentikasi dan saat ini berada di halaman login atau register...
    if (
      isAuthenticated &&
      ["/login", "/register"].includes(location.pathname)
    ) {
      // ...maka arahkan mereka ke halaman utama.
      console.log("User is authenticated. Navigating to homepage.");
      navigate("/");
    }
  }, [isAuthenticated, navigate, location]);

  const [isExpanded, setIsExpanded] = useState(false); // Dipakai oleh dua sidebar

  // Padding konten disesuaikan dengan lebar sidebar
  const mainContentPadding = isAuthenticated
    ? isExpanded
      ? "pl-64"
      : "pl-20"
    : "pl-0";

  return (
    <>
      <NotificationProvider>
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          {isAuthenticated &&
            (isAdminRoute ? (
              <SidebarAdmin
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
              />
            ) : (
              <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            ))}

          <main
            className={`flex-grow transition-all duration-300 ${mainContentPadding} overflow-y-auto`}
          >
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/contact-support" element={<ContactSupportPage />} />

              {/* --- Standard Protected Routes --- */}
              <Route element={<ProtectedRoute />}>
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/activity" element={<ActivityPage />} />
                <Route path="/board/:boardId" element={<BoardDetailPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/archived" element={<ArchivedPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/whats-new" element={<WhatsNewPage />} />
                <Route path="/settings/:tab?" element={<ProfilePage />} />
              </Route>

              {/* --- Admin Protected Routes --- */}
              <Route element={<ProtectedRouteAdmin />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/boards" element={<BoardManagementPage />} />
                <Route
                  path="/admin/permissions"
                  element={<PermissionsPage />}
                />
              </Route>

              {/* --- Not Found Route --- */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>

        {/* Toaster harus berada di dalam NotificationProvider tetapi di luar struktur utama */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={true}
          duration={4000}
        />
      </NotificationProvider>
    </>
  );
}

export default App;
