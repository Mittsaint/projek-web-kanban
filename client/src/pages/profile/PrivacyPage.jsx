import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import userService from "../../services/userService";
import { UserX, Trash2, ShieldAlert } from "lucide-react";
import { Toaster, toast } from "sonner";

// --- Komponen Modal Konfirmasi Hapus Akun ---
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, t }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 ...">
              <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="mt-0 text-left">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("privacyPage.deleteModalTitle")}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("privacyPage.deleteModalMessage")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/60 px-6 py-4 sm:flex sm:flex-row-reverse ...">
          <button type="button" onClick={onConfirm} className="...">
            {t("privacyPage.deleteModalConfirm")}
          </button>
          <button type="button" onClick={onClose} className="...">
            {t("privacyPage.deleteModalCancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Komponen untuk Item Pengguna yang Diblokir ---
const BlockedUserItem = ({ user, onUnblock, t }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center space-x-4">
      <img
        className="h-10 w-10 rounded-full object-cover"
        src={
          user.profilePictureUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name
          )}&background=random`
        }
        alt={user.name}
      />
      <div>
        {/* Asumsi tidak ada username, hanya nama */}
        <p className="font-medium text-gray-800 dark:text-gray-200">
          {user.name}
        </p>
      </div>
    </div>
    <button
      onClick={() => onUnblock(user._id)} // Menggunakan _id dari data MongoDB
      className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
    >
      {t("privacyPage.unblockUser")}
    </button>
  </div>
);

// --- Komponen Utama Privacy ---
const PrivacyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isModalOpen, setModalOpen] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data pengguna yang diblokir saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const users = await userService.getBlockedUsers();
        setBlockedUsers(users);
      } catch (error) {
        console.error("Failed to load blocked users:", error);
        // Opsional: tampilkan error di UI
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlockedUsers();
  }, []); // Array dependensi kosong agar hanya berjalan sekali

  // Fungsi untuk membuka blokir pengguna
  const handleUnblockUser = async (blockedUserId) => {
    try {
      await userService.unblockUser(blockedUserId);
      setBlockedUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== blockedUserId)
      );
      toast.success("User has been unblocked."); // <-- Menggunakan Toast
    } catch (error) {
      console.error(`Failed to unblock user ${blockedUserId}:`, error);
      toast.error("Failed to unblock user."); // <-- Menggunakan Toast
    }
  };
  // Fungsi untuk menghapus akun pengguna
  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      toast.success("Your account has been deleted successfully."); // <-- Menggunakan Toast
      logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("There was an error deleting your account."); // <-- Menggunakan Toast
      setModalOpen(false);
    }
  };

  return (
    <>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteAccount}
        t={t} // Teruskan fungsi 't' ke modal
      />
      <div className="space-y-8">
        {/* Bagian Pengguna yang Diblokir */}
        <div className="bg-white dark:bg-gray-800/50 shadow-md rounded-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("privacyPage.blockedUsersTitle")}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("privacyPage.blockedUsersDescription")}
            </p>
          </div>
          <div className="p-6 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("privacyPage.loadingBlockedUsers")}
              </p>
            ) : blockedUsers.length > 0 ? (
              blockedUsers.map((user) => (
                <BlockedUserItem
                  key={user._id}
                  user={user}
                  onUnblock={handleUnblockUser}
                />
              ))
            ) : (
              <div className="text-center py-4">
                <UserX className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  {t("privacyPage.noBlockedUsers")}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t("privacyPage.noBlockedUsersDescription")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bagian Hapus Akun */}
        <div className="bg-white dark:bg-gray-800/50 shadow-md rounded-lg">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-red-600 dark:text-red-500">
              {t("privacyPage.deleteAccountTitle")}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {t("privacyPage.deleteAccountDescription")}
            </p>
            <div className="mt-5">
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="-ml-1 mr-2 h-5 w-5" />
                {t("buttons.deleteMyAccount")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
