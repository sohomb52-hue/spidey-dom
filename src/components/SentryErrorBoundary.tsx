import React from 'react';
import * as Sentry from '@sentry/react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error: unknown;
  resetError: () => void;
  componentStack?: string | null;
}

export const SpideyErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError, componentStack }) => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-neutral-900 border-4 border-red-600 rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_#e11d48]">
        <div className="flex items-center gap-3 text-red-500 mb-4">
          <AlertTriangle className="w-8 h-8 shrink-0 animate-pulse" />
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-red-500 font-sans">
            Spider-Sense Glitch Detected!
          </h1>
        </div>

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-4">
          A multiversal runtime anomaly occurred in a component during execution. Sentry has automatically caught and logged the diagnostic telemetry for inspection.
        </p>

        {errorMessage && (
          <div className="bg-neutral-950 border border-red-500/40 rounded-lg p-3.5 mb-4 text-xs font-mono text-red-400 overflow-x-auto max-h-36">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {componentStack && (
          <details className="mb-6 text-xs text-neutral-400 bg-neutral-950 border border-neutral-800 rounded-lg p-2.5">
            <summary className="cursor-pointer text-neutral-300 font-bold hover:text-white mb-2">
              View Component Stack Trace
            </summary>
            <pre className="overflow-x-auto text-[11px] font-mono text-neutral-400 whitespace-pre-wrap max-h-40">
              {componentStack}
            </pre>
          </details>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={resetError}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[4px_4px_0px_#991b1b] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Reboot Web-Shooters (Try Again)
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Full Page Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export const AppSentryErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError, componentStack }) => (
        <SpideyErrorFallback
          error={error}
          resetError={resetError}
          componentStack={componentStack}
        />
      )}
      onError={(error, componentStack) => {
        console.error('[Sentry ErrorBoundary Captured Error]:', error);
        console.error('[Component Stack]:', componentStack);
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};
