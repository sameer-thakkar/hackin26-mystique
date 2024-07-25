import { IncomingMessage, ServerResponse } from 'http';
import { SHORTER_CACHE_AGE } from 'const/index';

export const setShortTTL = (res: ServerResponse<IncomingMessage>) => {
  res.setHeader('Cache-Control', `max-age=${SHORTER_CACHE_AGE}`);
};
