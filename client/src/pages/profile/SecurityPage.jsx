import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { AuthContext } from '../../contexts/AuthContext';
import userService from '../../services/userService';
import { KeyRound, Smartphone, Monitor, Globe } from 'lucide-react';

// --- Komponen untuk Input Form Password ---
const PasswordInput = ({ id, label, value, onChange, placeholder }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <div className="mt-1">
      <input
        type="password"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder={placeholder}
        required
      />
    </div>
  </div>
);

// --- Komponen untuk satu item sesi login ---
const SessionItem = ({ session, isCurrent, onRevoke, t }) => {
  const getDeviceIcon = (device) => {
    if (device.toLowerCase().includes("mobile"))
      return <Smartphone className="h-5 w-5 text-gray-500" />;
    if (
      device.toLowerCase().includes("windows") ||
      device.toLowerCase().includes("mac")
    )
      return <Monitor className="h-5 w-5 text-gray-500" />;
    return <Globe className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center space-x-4">
        {getDeviceIcon(session.device.os)}
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            {session.device.browser} on {session.device.os}
            {isCurrent && (
              <span className="text-xs text-green-600 dark:text-green-400 ml-2">
                {t("securityPage.thisDevice")}
              </span>
            )}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {session.location} &middot; Last used:{" "}
            {new Date(session.lastUsed).toLocaleDateString()}
          </p>
        </div>
      </div>
      {!isCurrent && (
        <button
          onClick={() => onRevoke(session._id)}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {t("securityPage.revokeSession")}
        </button>
      )}
    </div>
  );
};

// --- Komponen Utama SecurityPage ---
const SecurityPage = ({ user }) => {
  const { t } = useTranslation();
  const { user: authUser, logout } = useContext(AuthContext);
  const currentToken = authUser?.token;

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState("");

  const isPasswordAuth = user?.provider === "local";

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await userService.getLoginSessions?.() || await userService.getSessions?.();
        const sessionData = response?.data || response;
        setSessions(sessionData);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setSessionsError("Failed to load sessions.");
      } finally {
        setSessionsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      setPasswordError(t("securityPage.passwordMismatchError"));
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    setPasswordLoading(true);
    try {
      await userService.changePassword({ currentPassword, newPassword });
      toast.success(t("securityPage.passwordChangedSuccess") || "Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordSuccess("Password updated successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update password.";
      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogoutSession = async (sessionId) => {
    try {
      // Logout dari sesi saat ini
      if (user && user._id === sessionId) {
        logout(); 
        return;
      }

      await userService.logoutSession(sessionId);
      setSessions((prev) => prev.filter((session) => session._id !== sessionId || session.id !== sessionId));
      toast.success(t("securityPage.sessionRevokedSuccess"));
    } catch (err) {
      console.error("Failed to log out session:", err);
      setPasswordError("Failed to log out session. Please try again.");
      setTimeout(() => setPasswordError(""), 4000);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
      {/* Ganti Password */}
      {isPasswordAuth ? (
        <div className="bg-white dark:bg-gray-800/50 shadow-md rounded-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('securityPage.changePasswordTitle')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('securityPage.changePasswordDescription')}
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit}>
            <div className="p-6 space-y-4">
              <PasswordInput
                id="currentPassword"
                name="currentPassword"
                label={t("securityPage.currentPasswordLabel")}
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
              />
              <PasswordInput
                id="newPassword"
                name="newPassword"
                label={t("securityPage.newPasswordLabel")}
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
              />
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label={t("securityPage.confirmNewPasswordLabel")}
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
              />
              {passwordError && (
                <p className="text-sm text-red-600 dark:text-red-500">
                  {passwordError}
                </p>
              )}
              {passwordSuccess && (
                <p className="text-sm text-green-600 dark:text-green-500">
                  {passwordSuccess}
                </p>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/60 text-right rounded-b-lg">
              <button
                type="submit"
                disabled={passwordLoading}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
              >
                {passwordLoading ? t("buttons.saving") : t("buttons.saveChanges")}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800/50 shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Password
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            You are logged in via a social provider. Password management is handled by your provider.
          </p>
        </div>
      )}

      {/* Sesi Login */}
      <div className="bg-white dark:bg-gray-800/50 shadow-md rounded-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t("securityPage.loginSessionsTitle")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("securityPage.loginSessionsDescription")}
          </p>
        </div>
        <div className="p-6 divide-y divide-gray-200 dark:divide-gray-700">
          {sessionsLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading sessions...
            </p>
          ) : sessionsError ? (
            <p className="text-sm text-red-600 dark:text-red-500">
              {sessionsError}
            </p>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No active login sessions found.
            </p>
          ) : (
            sessions.map((session) => (
              <SessionItem
                key={session.id || session._id}
                session={session}
                isCurrent={session.token === currentToken}
                onRevoke={handleLogoutSession}
                t={t}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
