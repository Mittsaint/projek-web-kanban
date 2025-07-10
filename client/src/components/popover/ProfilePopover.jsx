// src/components/popover/ProfilePopover.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// --- Reusable SVG Icons ---
const Icon = ({ name, className }) => {
    const icons = {
        user: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
        logout: <path strokeLinecap="round" strokeLinejoin="round"d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />,
        settings: <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.11a12.004 12.004 0 015.093 0c.55.103 1.02.568 1.11 1.11l.09 1.42a12.005 12.005 0 014.945 4.545l1.09.63c.5.29.832.826.832 1.414v2.922c0 .587-.332 1.124-.832 1.414l-1.09.63a12.005 12.005 0 01-4.945 4.545l-.09 1.42c-.09.542-.56 1.007-1.11 1.11a12.004 12.004 0 01-5.093 0c-.55-.103-1.02-.568-1.11-1.11l-.09-1.42a12.005 12.005 0 01-4.945-4.545l-1.09-.63a1.5 1.5 0 01-.832-1.414v-2.922c0-.587.332-1.124.832-1.414l1.09-.63A12.005 12.005 0 019.253 5.36l.09-1.42z" />,
        help: <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />,
        gift: <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />,
        team: <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.375 3.375 0 015.908 0M9 11.25v2.25" />,
        chevron: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />,
        // --- IKON BARU DITAMBAHKAN ---
        contact: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
        github: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75a9.75 9.75 0 100-19.5 9.75 9.75 0 000 19.5zm0-16.5a.375.375 0 00-.375.375v3.375c0 .207.168.375.375.375h1.5a.375.375 0 00.375-.375V5.625a.375.375 0 00-.375-.375h-1.5zM12 12.75a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75zm-3.75 3a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 00-.75-.75zm7.5 0a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 00-.75-.75z" />
    };
    return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icons[name]}</svg>;
};

// ... (Komponen MenuItem tetap sama)
const MenuItem = ({ to, icon, children, hasArrow = false, onClick, isExternal = false }) => {
    const commonProps = {
        onClick,
        className: "flex items-center justify-between p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
    };

    if (isExternal) {
        return (
            <a href={to} target="_blank" rel="noopener noreferrer" {...commonProps}>
                <div className="flex items-center">
                    <Icon name={icon} className="h-6 w-6 mr-4" />
                    <span className="text-sm font-medium">{children}</span>
                </div>
                {hasArrow && <Icon name="chevron" className="h-5 w-5 text-gray-500" />}
            </a>
        );
    }

    return (
        <Link to={to} {...commonProps}>
            <div className="flex items-center">
                <Icon name={icon} className="h-6 w-6 mr-4" />
                <span className="text-sm font-medium">{children}</span>
            </div>
            {hasArrow && <Icon name="chevron" className="h-5 w-5 text-gray-500" />}
        </Link>
    );
};


const ProfilePopover = ({ onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        onClose();
    };

    return (
        <div className="absolute bottom-full mb-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-20" onClick={(e) => e.stopPropagation()}>
            {/* Bagian Akun */}
            <div className="p-2">
                <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase">Account</div>
                <Link to="/profile" onClick={onClose} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700">
                    <div className="flex items-center">
                        <img className="w-10 h-10 rounded-full object-cover" src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} alt={user.name} />
                        <div className="ml-3">
                            <p className="font-semibold text-white text-sm">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                    </div>
                    <Icon name="chevron" className="h-5 w-5 text-gray-500" />
                </Link>
            </div>
            
            {/* Bagian Umum */}
            <div className="p-2 border-t border-gray-700/50">
                <MenuItem to="/profile" icon="settings" onClick={onClose}>Settings</MenuItem>
                <MenuItem to="/help" icon="help" onClick={onClose} hasArrow>Help and resources</MenuItem>
                <MenuItem to="/whats-new" icon="gift" onClick={onClose}>What's new</MenuItem>
                {/* --- MENU ITEM BARU DITAMBAHKAN --- */}
                <MenuItem to="/contact-support" icon="contact" onClick={onClose} hasArrow>Contact Support</MenuItem>
            </div>

            {/* --- BAGIAN BARU DITAMBAHKAN --- */}
            <div className="p-2 border-t border-gray-700/50">
                <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase">Developer</div>
                <MenuItem 
                    to="https://github.com/your-username/boardly-repo" // <-- GANTI DENGAN URL REPO ANDA
                    icon="github" 
                    onClick={onClose}
                    isExternal={true} // Tandai sebagai tautan eksternal
                    hasArrow
                >
                    GitHub Repository
                </MenuItem>
            </div>

            {/* Bagian Logout */}
            <div className="p-2 border-t border-gray-700/50">
                <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors">
                    <Icon name="logout" className="h-6 w-6 mr-4" />
                    <span className="text-sm font-medium">Log out</span>
                </button>
            </div>
        </div>
    );
};

export default ProfilePopover;