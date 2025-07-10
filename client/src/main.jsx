import React, { Suspense } from 'react'; 
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './assets/css/animations.css';
import './i18n'; 
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Suspense>
            <App />
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)