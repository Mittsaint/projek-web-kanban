import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from "../../hooks/useNotification";

// --- Reusable SVG Icons ---
const Icon = ({ name, className }) => {
  const icons = {
    bell: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
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

const NotificationPopover = ({ notifications, onClose }) => (
  <div
    className="absolute bottom-full mb-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-20"
    onClick={(e) => {
      e.stopPropagation();
    }}
  >
    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
      <h4 className="font-semibold text-white">Notifications</h4>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white text-sm"
      >
        Close
      </button>
    </div>
    <div className="max-h-80 overflow-y-auto">
      {notifications.length > 0 ? (
        notifications.map((notif) => (
          <div
            key={notif._id}
            className="p-3 border-b border-gray-700/50 hover:bg-gray-700"
          >
            <p className="text-sm text-gray-300">{notif.text}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(notif.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="p-4 text-sm text-gray-400">No new notifications.</p>
      )}
    </div>
  </div>
);

const NotificationBell = ({ isExpanded }) => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen && unreadCount > 0) {
      markAsRead();
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={handleToggle}
        className={`relative flex items-center w-full h-12 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
          isExpanded ? "px-4" : "px-3 justify-center"
        }`}
      >
        <Icon name="bell" className="h-6 w-6 flex-shrink-0" />
        <span
          className={`ml-4 text-sm font-medium transition-opacity duration-200 ${
            !isExpanded ? "opacity-0 w-0" : "opacity-100"
          }`}
        >
          Notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-800"></span>
        )}
      </button>
      {isOpen && (
        <NotificationPopover
          notifications={notifications}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
