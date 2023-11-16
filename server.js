const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.APP_ENV === 'development';
const app = next({ dev });
const handle = app.getRequestHandler();

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
      const isSSRPage = res.getHeader('content-type')?.includes('text/html');
      if (isBot && data && isSSRPage) {
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
    if (!isAPIRoute) {
      const isBot = req.headers['x-bot'] === 'true';
      const sieTTL = TIME.SECONDS_IN_DAY * 1;
      let swrTTL = TIME.SECONDS_IN_DAY * 1; // regular user staleness ttl
      let maxAge = null;

      if (isBot) {
        swrTTL = TIME.SECONDS_IN_DAY * 7;
        maxAge = TIME.SECONDS_IN_DAY * 1;
      }

      const swrCacheCtrl = `stale-while-revalidate=${swrTTL}`;
      const sieCacheCtrl = `stale-if-error=${sieTTL}`;
      const maxAgeCacheCtrl = maxAge ? `max-age=${maxAge}` : '';

      const cacheCtrlHeader = [
        'public',
        swrCacheCtrl,
        sieCacheCtrl,
        maxAgeCacheCtrl,
      ]
        .filter((c) => c)
        .join(', ');

      res.setHeader('Cache-Control', cacheCtrlHeader);
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
