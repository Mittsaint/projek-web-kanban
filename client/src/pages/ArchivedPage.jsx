import React, { useState, useEffect, useCallback } from "react";
import boardService from "../services/boardService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const ArchivedPage = () => {
  // --- 2. Deklarasi State ---
  const [archivedBoards, setArchivedBoards] = useState([]);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 3. Fungsi untuk Mengambil Data ---
  const fetchArchivedBoards = useCallback(async () => {
    // Tidak set isLoading(true) di sini agar tidak berkedip saat refresh
    try {
      setError(null);
      const data = await boardService.boards.getArchived();
      setArchivedBoards(data);
    } catch (err) {
      console.error("Error fetching archived boards:", err);
      setError("Failed to load archived boards. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- 4. useEffect untuk Menjalankan Fetch Saat Komponen Dimuat ---
  useEffect(() => {
    fetchArchivedBoards();
  }, [fetchArchivedBoards]);

  // --- 5. Fungsi Handler untuk Aksi Pengguna ---
  const handleUnarchive = async (boardId) => {
    // Menggunakan toast untuk notifikasi, bukan window.confirm
    try {
      await boardService.boards.unarchive(boardId);
      toast.success("Board has been restored.");
      // Refresh daftar dengan memfilter state lokal untuk respons instan
      setArchivedBoards((prev) =>
        prev.filter((board) => board._id !== boardId)
      );
    } catch (error) {
      console.error("Failed to restore board:", error);
      toast.error("Failed to restore board.");
    }
  };

  const handleDelete = async (boardId) => {
    // Menggunakan window.confirm untuk aksi yang sangat destruktif
    if (
      window.confirm(
        "This action is permanent and cannot be undone. Are you sure?"
      )
    ) {
      try {
        await boardService.boards.deletePermanently(boardId);
        toast.success("Board permanently deleted.");
        // Refresh daftar
        setArchivedBoards((prev) =>
          prev.filter((board) => board._id !== boardId)
        );
      } catch (error) {
        console.error("Failed to delete board:", error);
        toast.error("Failed to delete board.");
      }
    }
  };

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 bg-gray-900">
      <div className="w-full">
        {/* Header Halaman */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t("archivedPage.pageTitle")}
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            {t("archivedPage.pageDescription")}
          </p>
        </div>
        {/* Konten Utama */}
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-10">
              {t("archivedPage.loading")}
            </p>
          ) : error ? (
            <p className="text-red-500 text-center py-10">{error}</p>
          ) : archivedBoards.length === 0 ? (
            // Tampilan "Empty State" yang lebih baik
            <div className="text-center py-16 px-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {t("archivedPage.noArchivedItemsTitle")}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t("archivedPage.noArchivedItemsDescription")}
              </p>
            </div>
          ) : (
            // Daftar Papan yang Diarsipkan
            archivedBoards.map((board) => (
              <div
                key={board._id}
                className="bg-white dark:bg-gray-800/80 p-5 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-lg hover:scale-[1.01]"
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {board.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("archivedPage.archivedOn")}:{" "}
                    {new Date(board.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleUnarchive(board._id)}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
                  >
                    {t("archivedPage.unarchiveButton")}
                  </button>
                  <button
                    onClick={() => handleDelete(board._id)}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                  >
                    {t("archivedPage.deleteButton")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivedPage;
