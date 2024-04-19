// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { browserTracingIntegration, init as initSentry } from '@sentry/nextjs';

const SENTRY_DSN =
  'https://a952d80706b3435388b1fb5983c74b18@o45960.ingest.sentry.io/1545593';

initSentry({
  dsn: SENTRY_DSN,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.05,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  ignoreUrls: [/https?:\/\/(www\.)?(localhost)\.com/],
  enabled: process.env.NODE_ENV !== 'development',
  integrations: [
    browserTracingIntegration({
      enableInp: true,
      // limit interactions sampling for INP
      interactionsSampleRate: 0.1,
    }),
  ],
});
