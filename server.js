const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.APP_ENV === 'development';
const app = next({ dev });
const handle = app.getRequestHandler();

const BOTS_STATIC_HTML_EXPERIMENT_DOMAINS = [
  'thevaticantickets.com',
  'acropolis-tickets.com',
  'eiffeltickets.com',
  'seine-river-cruises.com',
  'colosseum-rome-tickets.com',
];

const SWR_ENABLED_DOMAINS = [
  ...BOTS_STATIC_HTML_EXPERIMENT_DOMAINS,
  'tickets-paris.fr',
  'ticket-madrid.com',
  'versailles-palace-tickets.com',
  'aquarium-tickets.com',
  'pradomuseumtickets.com',
];

const TIME = {
  SECONDS_IN_DAY: 60 * 60 * 24,
  SECONDS_IN_HOUR: 60 * 60,
};

const removeScripts = (html) => {
  // Regular expression pattern to match script tags
  const scriptTagPattern = /<script[\s\S]*?>[\s\S\n]*?<\/script>/gi;

  // Regular expression pattern to match script tags with type="application/ld+json"
  const ldJsonScriptPattern = /type=["']?application\/ld\+json["']?/gi;

  // Remove script tags except for type="application/ld+json"
  const modifiedHTML = html.replace(scriptTagPattern, (scriptTag) => {
    return scriptTag.match(ldJsonScriptPattern) ? scriptTag : '';
  });

  return modifiedHTML;
};

const getByteLength = (payload) =>
  new TextEncoder().encode(payload).buffer.byteLength;

app.prepare().then(() => {
  const server = express();

  server.use((req, res, next) => {
    const originalEnd = res.end;
    const isBotQuery = typeof req.query.bot !== 'undefined';

    res.end = function (data, encoding) {
      const isBot = req.headers['x-bot'] === 'true' || isBotQuery;
      const isStaticHTMLEnabledDomain =
        BOTS_STATIC_HTML_EXPERIMENT_DOMAINS.findIndex((d) =>
          req.hostname.includes(d)
        ) > -1;
      if (
        isStaticHTMLEnabledDomain &&
        isBot &&
        data &&
        res.getHeader('content-type')?.includes('text/html')
      ) {
        let modifiedData = removeScripts(data);
        res.setHeader('Content-Length', getByteLength(modifiedData));
        data = modifiedData;
      }
      originalEnd.call(res, data, encoding);
    };
    next();
  });

  server.use((req, res, next) => {
    const isAPIRoute = /\/(fe)?api\//.test(req.path);
    const isSWREnabledDomain =
      SWR_ENABLED_DOMAINS.findIndex((d) => req.hostname.includes(d)) > -1;
    if (!isAPIRoute && isSWREnabledDomain) {
      const isBot = req.headers['x-bot'] === 'true';
      const sweTTL = TIME.SECONDS_IN_DAY * 1;
      let swrTTL = TIME.SECONDS_IN_DAY * 1; // regular user staleness ttl

      if (isBot) {
        swrTTL = TIME.SECONDS_IN_DAY * 2;
      }

      const swrCacheCtrl = `stale-while-revalidate=${swrTTL}`;
      const sweCacheCtrl = `stale-if-error=${sweTTL}`;

      res.setHeader(
        'Cache-Control',
        `public, ${swrCacheCtrl}, ${sweCacheCtrl}`
      );
    }
    next();
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const serverInstance = server.listen(port, (err) => {
    if (err) throw err;
  });
  serverInstance.keepAliveTimeout = 122 * 1000;
  serverInstance.headersTimeout = 130 * 1000;
});
