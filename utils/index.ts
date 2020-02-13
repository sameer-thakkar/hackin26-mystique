import Router from 'next/router';
import { withoutTrailingSlash } from '../utils/helper';
import { SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGES_MAP } from '../constants';

// Gets the UID and Language by the host and pathname
export const getPrismicProps = ({ host, pathname }) => {
  const pathnameSlugs = withoutTrailingSlash(pathname)
    .split('/')
    .filter(item => item);

  let requestedLang = pathnameSlugs[0];

  const isLangValid = SUPPORTED_LANGUAGES.includes(requestedLang);

  if (isLangValid) {
    pathnameSlugs.shift();
  } else {
    requestedLang = 'en';
  }

  const uid = `${withoutTrailingSlash(`${host}/${pathnameSlugs.join('/')}`)}`
    .replace('stage.', '')
    .replace(/\//g, '.');

  return {
    uid,
    lang: SUPPORTED_LANGUAGES_MAP[requestedLang],
  };
};

// Used for redirecting
export const redirectTo = ({ res, url }) => {
  if (res) {
    res.writeHead(302, {
      Location: url,
    });
    res.end();
  } else {
    Router.push(url);
  }
};

// Reflects promises to avoid running into the catch block
export const reflect = promise =>
  promise.then(
    payload => ({ payload, status: 'resolved' }),
    error => ({ error, status: 'rejected' })
  );
