// src/components/layout/SidebarAdmin.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// --- Reusable SVG Icons for Admin ---
// A dedicated Icon component to keep the JSX clean and maintainable.
const Icon = ({ name, className }) => {
  const icons = {
    // Icon for the main admin dashboard
    dashboard: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M10 14v-4m4 4v-4m-4-2h4"
      />
    ),
    // Icon for user management
    users: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.265-.5-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.265.5-1.857m0 0a5.002 5.002 0 019 0m0 0a5 5 0 00-9 0m2-11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    ),
    // Icon for permissions or security settings
    permissions: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z"
      />
    ),
    // Icon for the logout action
    logout: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
      />
    ),
    // Icon for expanding/collapsing the sidebar
    chevron: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
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
      strokeWidth={1.5} // Adjusted stroke for a slightly finer look
    >
      {icons[name]}
    </svg>
  );
};

// --- Reusable Navigation Link ---
// This component handles the active state and styles for both expanded and collapsed modes.
const SidebarNavLink = ({ to, icon, children, isExpanded }) => (
  <NavLink
    to={to}
    end // Use 'end' to match the exact path for the Dashboard
    className={({ isActive }) =>
      `flex items-center h-12 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
        isActive ? "bg-blue-600 text-white font-semibold" : ""
      } ${isExpanded ? "px-4" : "px-3 justify-center"}`
    }
  >
    <Icon name={icon} className="h-6 w-6 flex-shrink-0" />
    <span
      className={`ml-4 text-sm font-medium transition-opacity duration-200 ${
        !isExpanded ? "opacity-0 w-0" : "opacity-100"
      }`}
    >
      {children}
    </span>
  </NavLink>
);

const SidebarAdmin = () => {
  const { logout } = useAuth();
  // State to control if the sidebar is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(false);

  // Navigation items for the admin panel
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: "dashboard" },
    { name: "Global Management Board", path: "/admin/boards", icon: "users" },
    { name: "Permissions", path: "/admin/permissions", icon: "permissions" },
  ];

  return (
    <aside
      className={`bg-gray-800 text-white flex flex-col p-3 transition-all duration-300 ease-in-out h-screen fixed top-0 left-0 z-50 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* Header with Title and Toggle Button */}
      <div
        className={`flex items-center h-12 ${
          isExpanded ? "justify-between" : "justify-center"
        }`}
      >
        <span
          className={`font-bold text-xl overflow-hidden transition-all duration-200 ${
            isExpanded ? "w-auto opacity-100 ml-2" : "w-0 opacity-0"
          }`}
        >
          Admin Panel
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-gray-700"
          aria-label="Toggle sidebar"
        >
          <Icon
            name="chevron"
            className={`h-6 w-6 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-2 mt-6">
        {navItems.map((item) => (
          <SidebarNavLink
            key={item.name}
            to={item.path}
            icon={item.icon}
            isExpanded={isExpanded}
          >
            {item.name}
          </SidebarNavLink>
        ))}
      </nav>

      {/* Footer with Logout Button */}
      <div className="mt-auto">
        <button
          onClick={logout}
          className={`flex items-center w-full h-12 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
            isExpanded ? "px-4" : "px-3 justify-center"
          }`}
        >
          <Icon name="logout" className="h-6 w-6 flex-shrink-0" />
          <span
            className={`ml-4 text-sm font-medium transition-opacity duration-200 ${
              !isExpanded ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
