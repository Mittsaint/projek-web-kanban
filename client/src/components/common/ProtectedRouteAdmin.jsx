import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRouteAdmin = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // 1. Tunggu sampai proses otentikasi selesai
  // Ini adalah langkah paling penting untuk mencegah redirect loop
  if (isLoading) {
    // Tampilkan loading indicator atau null selagi menunggu
    return <div className="w-full h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  // 2. Setelah loading selesai, periksa apakah pengguna terotentikasi DAN memiliki peran ADMIN
  if (isAuthenticated && user?.role === 'ADMIN') {
    // Jika semua syarat terpenuhi, izinkan akses ke halaman yang dituju (misal: AdminPage)
    return <Outlet />;
  }

  // 3. Jika tidak memenuhi syarat, alihkan ke halaman login
  // Mengarahkan ke /login lebih aman daripada ke / karena mencegah loop jika ada kesalahan logika
  return <Navigate to="/login" replace />;
};

export default ProtectedRouteAdmin;