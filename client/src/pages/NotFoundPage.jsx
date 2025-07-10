import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // To direct to the correct home page

const NotFoundPage = () => {
  const { user } = useAuth(); // Use 'user' for consistency with our updated AuthContext

  // Determine the correct path and button text based on authentication status
  const homePath = user ? "/" : "/login";
  const homeButtonText = user ? "Go back to HomePage" : "Go back to Login";

  return (
    <main className="flex-grow grid min-h-full place-items-center bg-white dark:bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center max-w-lg">
        {/* --- SARAN 1: Tambahkan Ilustrasi SVG di sini --- */}
        <div className="mx-auto w-48 h-48 mb-8">
          {/* Contoh placeholder untuk SVG, ganti dengan SVG Anda */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-blue-500/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p className="text-base font-semibold text-blue-600 dark:text-blue-400">
          404 ERROR
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Page not found
        </h1>

        {/* --- SARAN 2: Teks yang lebih membantu --- */}
        <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">
          Oops! It seems this page has been archived or doesn't exist. Maybe one
          of the links below can help?
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to={homePath}
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            {homeButtonText}
          </Link>
          <Link
            to="/contact-support"
            className="text-sm font-semibold text-gray-900 dark:text-white"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* --- SARAN 3: Tautan Bermanfaat Lainnya --- */}
        {user && ( // Hanya tampilkan jika pengguna sudah login
          <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 w-full">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Or, jump to:
            </p>
            <div className="flex justify-center gap-x-6">
              <Link
                to="/projects"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Your Projects
              </Link>
              <Link
                to="/settings"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Settings
              </Link>
              <Link
                to="/activity"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Activity
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default NotFoundPage;
