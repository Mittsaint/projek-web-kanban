import React, { useRef, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ProfilePopover from "../popover/ProfilePopover";
import NotificationBell from "./NotificationBell";
import CreateBoardModal from "../modals/CreateBoardModal";

// --- Reusable SVG Icons ---
const Icon = ({ name, className }) => {
  const icons = {
    logo: (
      <path d="M15.59,2.25L15.59,2.25c-1.9-1.9-5.06-1.9-6.96,0l-4.04,4.04c-1.9,1.9-1.9,5.06,0,6.96l0,0c1.9,1.9,5.06,1.9,6.96,0l4.04-4.04C17.5,7.31,17.5,4.15,15.59,2.25z M8.41,11.59c-0.78,0.78-2.05,0.78-2.83,0l0,0c-0.78-0.78-0.78-2.05,0-2.83l4.04-4.04c0.78-0.78,2.05-0.78,2.83,0l0,0c0.78,0.78,0.78,2.05,0,2.83L8.41,11.59z" />
    ),
    home: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"
      />
    ),
    projects: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
      />
    ),
    // New icon for Activity Log
    activity: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 12h.007v.008H3.75V12zm4.125 0h.007v.008h-.007V12zm4.125 0h.007v.008h-.007V12zm4.125 0h.007v.008h-.007V12zm-12 5.25h.007v.008H3.75v-.008zm4.125 0h.007v.008h-.007v-.008zm4.125 0h.007v.008h-.007v-.008zm4.125 0h.007v.008h-.007v-.008zm-12-10.5h.007v.008H3.75V6.75zm4.125 0h.007v.008h-.007V6.75zm4.125 0h.007v.008h-.007V6.75zm4.125 0h.007v.008h-.007V6.75z"
      />
    ),
    // New icon for Archived
    archive: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4"
      />
    ),
    plus: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    ),
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
      strokeWidth={2}
    >
      {icons[name]}
    </svg>
  );
};

const SidebarNavLink = ({ to, icon, children, isExpanded }) => (
  <NavLink
    to={to}
    end
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

// 1. Receive isExpanded and setIsExpanded as props
const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // 2. Remove the local state for expansion, it's now managed by App.jsx
  // const [isExpanded, setIsExpanded] = useState(false);

  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfilePopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBoardCreated = () => {
    navigate(0);
  };

  const navItems = [
    { name: "Home", path: "/", icon: "home" },
    { name: "Projects", path: "/projects", icon: "projects" },
    { name: "Activity", path: "/activity", icon: "activity" }, // New Item
    { name: "Archived", path: "/archived", icon: "archive" }, // New Item
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white flex flex-col p-3 transition-all duration-300 ease-in-out z-50 ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center h-12 ${
            isExpanded ? "justify-between" : "justify-center"
          }`}
        >
          <div
            className={`flex items-center overflow-hidden transition-all duration-200 ${
              isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            <Icon
              name="logo"
              className="h-8 w-8 text-white flex-shrink-0"
              fill="currentColor"
            />
            <span className="font-bold text-xl ml-2">Boardly</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <Icon
              name="chevron"
              className={`h-6 w-6 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Create Button */}
        <div className="my-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={`flex items-center w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors ${
              isExpanded ? "px-4" : "px-3 justify-center"
            }`}
          >
            <Icon name="plus" className="h-6 w-6 flex-shrink-0" />
            <span
              className={`ml-4 text-sm font-medium transition-opacity duration-200 ${
                !isExpanded ? "opacity-0 w-0" : "opacity-100"
              }`}
            >
              Create
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow space-y-2">
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

        {/* Footer */}
        <div className="mt-auto space-y-2">
          <NotificationBell isExpanded={isExpanded} />{" "}
          {/* This component will now handle its own popover */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfilePopoverOpen((prev) => !prev)}
              className={`flex items-center w-full h-12 rounded-lg hover:bg-gray-700 transition-colors ${
                isExpanded ? "px-4" : "px-3 justify-center"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white flex-shrink-0">
                {user?.name?.charAt(0)}
              </div>
              <span
                className={`ml-4 text-sm font-medium transition-opacity duration-200 ${
                  !isExpanded ? "opacity-0 w-0" : "opacity-100"
                }`}
              >
                {user?.name}
              </span>
            </button>
            {isProfilePopoverOpen && (
              <ProfilePopover onClose={() => setIsProfilePopoverOpen(false)} />
            )}
          </div>
        </div>
      </aside>
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onBoardCreated={handleBoardCreated}
      />
    </>
  );
};

export default Sidebar;
