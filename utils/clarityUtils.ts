import Cookies from 'js-cookie';
import { isProduction } from 'utils/gen';
import {
  CLARITY_PROJECT_ID,
  CLARITY_SUPPORTED_DOMAINS,
} from 'const/clarityConstants';
import { COOKIE, DOMAIN_INITIALS } from 'const/index';

export const initializeClarity = (key: string) => {
  (function (
    c: { [key: string]: any },
    l: Document,
    a: string,
    r: string,
    i: string,
    t?: HTMLScriptElement,
    y?: HTMLScriptElement
  ) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0] as HTMLScriptElement;
    y?.parentNode?.insertBefore(t, y);
  })(window, document, 'clarity', 'script', key);
};

export const initClarityProjectId = (host: string) => {
  Cookies.set(COOKIE.CLARITY_PROJECT_ID, CLARITY_PROJECT_ID, {
    domain: host.replace(DOMAIN_INITIALS, ''),
    path: '',
  });

  return CLARITY_PROJECT_ID;
};

export const initClarity = (host: string) => {
  let clarityProjectId = Cookies.get(COOKIE.CLARITY_PROJECT_ID);

  if (!clarityProjectId?.length) {
    clarityProjectId = initClarityProjectId(host);
  }

  initializeClarity(clarityProjectId);
};

export const isClarityRequired = (host: string) => {
  return CLARITY_SUPPORTED_DOMAINS.indexOf(host) !== -1 && isProduction();
};
