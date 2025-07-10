import React, { useState, useEffect } from "react";
import { Globe, Sun, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import Icon from "../../components/icon/Icon";

// --- Komponen Toggle Switch ---
const ThemeToggle = ({ theme, onToggle }) => {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ${
        isDark ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
          isDark ? "translate-x-6" : "translate-x-1"
        }`}
      />
      <Sun
        className={`h-3 w-3 absolute left-2 text-yellow-500 transition-opacity ${
          isDark ? "opacity-0" : "opacity-100"
        }`}
      />
      <Moon
        className={`h-3 w-3 absolute right-2 text-white transition-opacity ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
};

// --- Komponen Utama Accessibility ---
const Accessibility = () => {
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="space-y-10">
      {/* Bagian Pengaturan Tampilan (Appearance) - Dibuat lebih menonjol */}
      <div className="bg-transparent">
        <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t("accessibilityPage.appearanceTitle")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("accessibilityPage.appearanceDescription")}
          </p>
        </div>
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Opsi Light Mode */}
          <div onClick={() => setTheme("light")} className="cursor-pointer">
            <div
              className={`w-full p-2 rounded-lg transition-all duration-200 ${
                theme === "light"
                  ? "ring-2 ring-blue-500"
                  : "ring-1 ring-gray-300 dark:ring-gray-600 hover:ring-blue-400"
              }`}
            >
              <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Sun className="mx-auto h-10 w-10" />
                  <p className="mt-2 text-sm font-semibold">
                    {t("accessibilityPage.themeLight")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Opsi Dark Mode */}
          <div onClick={() => setTheme("dark")} className="cursor-pointer">
            <div
              className={`w-full p-2 rounded-lg transition-all duration-200 ${
                theme === "dark"
                  ? "ring-2 ring-blue-500"
                  : "ring-1 ring-gray-300 dark:ring-gray-600 hover:ring-blue-400"
              }`}
            >
              <div className="w-full h-40 bg-gray-800 rounded-md flex items-center justify-center">
                <div className="text-center text-gray-300">
                  <Moon className="mx-auto h-10 w-10" />
                  <p className="mt-2 text-sm font-semibold">
                    {t("accessibilityPage.themeDark")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Pengaturan Bahasa */}
      <div className="bg-transparent">
        <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t("accessibilityPage.languageTitle")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("accessibilityPage.languageDescription")}
          </p>
        </div>
        <div className="pt-6">
          <div className="max-w-xs">
            <label htmlFor="language-select" className="sr-only">
              {t("accessibilityPage.languageTitle")}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Globe className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <select
                id="language-select"
                name="language"
                value={language}
                onChange={handleLanguageChange}
                className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="en">English</option>
                <option value="id">Indonesia</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
