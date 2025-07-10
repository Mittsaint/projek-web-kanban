import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi) // Memuat terjemahan dari backend (folder public)
  .use(LanguageDetector) // Mendeteksi bahasa pengguna
  .use(initReactI18next) // Mengikat i18next dengan react
  .init({
    supportedLngs: ['en', 'id'], // Bahasa yang didukung
    fallbackLng: 'en', // Bahasa default jika deteksi gagal
    debug: true, // Tampilkan log di console (nonaktifkan di produksi)
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path ke file terjemahan Anda
    },
    react: {
      useSuspense: true, // Gunakan React Suspense saat memuat terjemahan
    },
  });

export default i18n;