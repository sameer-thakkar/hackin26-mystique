// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { init as initSentry } from '@sentry/nextjs';

const SENTRY_DSN =
  'https://a952d80706b3435388b1fb5983c74b18@o45960.ingest.sentry.io/1545593';

initSentry({
  dsn: SENTRY_DSN,
  tracesSampler: () => 0,
  ignoreUrls: [/https?:\/\/(www\.)?(localhost)\.com/],
  enabled: process.env.NODE_ENV !== 'development',
});
