import * as Sentry from '@sentry/react';

// Sentry configuration for Spider-Verse Fact Attack
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';
const ENVIRONMENT = import.meta.env.MODE || (import.meta.env.DEV ? 'development' : 'production');

export function initSentry(): void {
  // Always initialize with safe defaults
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    enabled: Boolean(SENTRY_DSN) || import.meta.env.PROD,
    // Keep trace sampling low to minimize memory overhead in constrained environments (Render 512MB)
    tracesSampleRate: import.meta.env.PROD ? 0.05 : 1.0,
    // Capture release if available
    release: 'spider-verse-fact-attack@2.1.0',
    // Attach tags specifically to diagnose Render deployment and memory thresholds
    initialScope: {
      tags: {
        host: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
        deployment_target: 'render',
      },
    },
    beforeSend(event, hint) {
      // Diagnostic memory telemetry if supported by the browser (Blink/Chromium performance.memory)
      if (typeof window !== 'undefined' && 'performance' in window) {
        const perf = window.performance as unknown as {
          memory?: { usedJSHeapSize?: number; totalJSHeapSize?: number; jsHeapSizeLimit?: number };
        };
        if (perf.memory) {
          event.extra = {
            ...event.extra,
            usedJSHeapSizeMB: Math.round((perf.memory.usedJSHeapSize || 0) / 1024 / 1024),
            totalJSHeapSizeMB: Math.round((perf.memory.totalJSHeapSize || 0) / 1024 / 1024),
            jsHeapSizeLimitMB: Math.round((perf.memory.jsHeapSizeLimit || 0) / 1024 / 1024),
          };
        }
      }

      // Log warning in console for local and production devtools inspection
      if (hint.originalException) {
        console.error('[Sentry Auto-Reported Crash]:', hint.originalException);
      }

      return event;
    },
  });

  if (SENTRY_DSN) {
    console.log('🛡️ Sentry initialized with remote DSN telemetry reporting.');
  } else {
    console.log('🛡️ Sentry active in local diagnostics mode (Configure VITE_SENTRY_DSN for remote dashboard forwarding).');
  }
}

/**
 * Capture component-specific runtime crashes with component tags
 */
export function reportComponentCrash(error: unknown, componentName: string, extraData?: Record<string, unknown>): void {
  console.error(`[Component Error in <${componentName}/>]:`, error);
  Sentry.withScope((scope) => {
    scope.setTag('component_name', componentName);
    if (extraData) {
      scope.setExtras(extraData);
    }
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(String(error), 'error');
    }
  });
}

export { Sentry };
