// src/pages/profilepage/ProfilePage.jsx
import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
import { useTranslation } from 'react-i18next';

// Impor semua komponen halaman pengaturan
import UserProfilePage from './UserProfilePage';
import Security from './SecurityPage';
import Privacy from './PrivacyPage';
import Accessibility from './AccessibilityPage';

// Impor Ikon
import { User, Shield, Lock, Eye, Settings } from 'lucide-react';


// --- Komponen Navigasi Sidebar (diperbarui untuk menggunakan Link) ---
const SettingsSidebar = ({ activeTab }) => {
    const { t } = useTranslation();

   const navItems = [
        { id: 'profile', label: t('sidebar.profile'), icon: User }, 
        { id: 'security', label: t('sidebar.security'), icon: Shield },
        { id: 'privacy', label: t('sidebar.privacy'), icon: Lock },
        { id: 'accessibility', label: t('sidebar.accessibility'), icon: Eye },
    ];

    return (
        <aside className="w-full lg:w-1/4 lg:pr-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                {t('sidebar.settings')}
            </h2>
            <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1">
                {navItems.map(item => (
                    <Link
                        key={item.id}
                        to={`/settings/${item.id}`}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-200 ${
                            activeTab === item.id
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                    >
                        <item.icon className={`mr-3 h-5 w-5 ${activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-500'}`} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

// --- Komponen Halaman Utama ---
const ProfilePage = () => {
    const { user } = useAuth();
    // Mengambil tab aktif dari parameter URL, default ke 'profile'
    const { tab = 'profile' } = useParams();

    // Render konten berdasarkan parameter 'tab' dari URL
    const renderContent = () => {
        switch (tab) {
            case 'profile':
                return <UserProfilePage user={user} />;
            case 'security':
                return <Security user={user} />;
            case 'privacy':
                // userId mungkin diperlukan untuk beberapa aksi di komponen Privacy
                return <Privacy userId={user?.id} />;
            case 'accessibility':
                return <Accessibility />;
            default:
                // Jika URL tab tidak valid, arahkan ke halaman profile
                return <Navigate to="/settings/profile" replace />;
        }
    };

    // Jika pengguna belum login, tampilkan pesan untuk login
    if (!user) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12 bg-gray-100 dark:bg-gray-900 min-h-screen">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                    Please log in to view your settings.
                </h1>
                <Link to="/login" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                    Login
                </Link>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <main className="max-w-7xl mx-auto py-10 lg:py-16 px-4 sm:px-6 lg:px-8">
                <div className="lg:flex lg:space-x-8">
                    <SettingsSidebar activeTab={tab} />
                    
                    <div className="flex-1 mt-6 lg:mt-0 max-w-4xl w-full">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
