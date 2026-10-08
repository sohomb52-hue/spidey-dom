import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { initSentry } from './utils/sentry';
import { AppSentryErrorBoundary } from './components/SentryErrorBoundary';
import './index.css';

// Initialize Sentry at entry point before any DOM rendering occurs
initSentry();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppSentryErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppSentryErrorBoundary>
  </StrictMode>
);
