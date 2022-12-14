import React from 'react';
import parse from 'url-parse';
import EnvironmentContext from 'contexts/environmentContext';
import { getUID } from 'utils/helper';

const qs = (obj) =>
  Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join('&');

const resolveLink: any = (url, ctx) => {
  const { isDev, windowUrl } = ctx;
  const { href: linkHref, host: linkHost, pathname: linkPathname } = parse(
    url,
    true
  );
  const { host, query, protocol } = parse(windowUrl, true);

  if (isDev) {
    const updatedQuery = {
      ...query,
      mystique_uid: getUID(linkHref),
    };
    return `${isDev ? 'http:' : protocol}//${host}?${qs(updatedQuery)}`;
  }

  const normalizedHost = host.replace('stage-', '');
  if (normalizedHost !== linkHost) {
    return url;
  }

  if (host.startsWith('stage-')) {
    return `https://stage-${linkHost}${linkPathname}`;
  }

  return url;
};

const LinkResolver = ({ url, children, ...props }) => {
  return (
    <EnvironmentContext.Consumer>
      {(ctx) => (
        <a href={resolveLink(url, ctx)} {...props}>
          {children}
        </a>
      )}
    </EnvironmentContext.Consumer>
  );
};

export default LinkResolver;
