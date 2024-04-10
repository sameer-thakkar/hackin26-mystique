import Cookies from 'js-cookie';
import { getNakedDomain } from 'utils';
import { COOKIE } from 'const/index';

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

export const initClarity = ({
  host,
  projectId,
}: {
  host: string;
  projectId: string;
}) => {
  // persist clarity session on booking flow.
  if (!Cookies.get(COOKIE.CLARITY_PROJECT_ID)?.length)
    Cookies.set(COOKIE.CLARITY_PROJECT_ID, projectId, {
      domain: getNakedDomain(host),
      path: '/',
      expires: 30,
    });

  initializeClarity(projectId);
};
