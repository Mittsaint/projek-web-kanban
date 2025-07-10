import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GuestLandingPage from './GuestLandingPage';
import UserDashboard from './UserDashboard';

const HomePage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect admin ke /admin jika mereka mencoba mengakses halaman utama
  useEffect(() => {
    if (!isLoading && user?.role === 'ADMIN') {
      navigate('/admin', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Tampilkan loading screen jika status otentikasi belum jelas
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-gray-900">
        {/* Anda bisa tambahkan komponen spinner di sini */}
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  // Pilih halaman yang akan ditampilkan berdasarkan status login
  return (
    <div className="w-full h-full animate-fade-in-fast">
      {user ? <UserDashboard /> : <GuestLandingPage />}
    </div>
  );
};

export default HomePage;