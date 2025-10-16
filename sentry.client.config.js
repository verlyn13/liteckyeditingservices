import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
  release: import.meta.env.PUBLIC_SENTRY_RELEASE,

  // Performance Monitoring
  tracesSampleRate: import.meta.env.PUBLIC_SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Enable structured logs (Sentry recommended)
  enableLogs: true,

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out noise
  beforeSend(event, _hint) {
    // Don't send events if no DSN is configured
    if (!import.meta.env.PUBLIC_SENTRY_DSN) {
      return null;
    }

    // Filter browser extension errors
    if (
      event.exception?.values?.[0]?.stacktrace?.frames?.some(
        (frame) =>
          frame.filename?.includes('extension://') || frame.filename?.includes('moz-extension://')
      )
    ) {
      return null;
    }

    return event;
  },

  // Send default PII for better debugging (recommended by Sentry docs)
  sendDefaultPii: true,
});
