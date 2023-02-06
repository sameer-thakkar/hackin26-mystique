import React from 'react';
import parse from 'url-parse';
import EnvironmentContext from 'contexts/environmentContext';
import { getUID } from 'utils/helper';

const qs = (obj: any) =>
  Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join('&');

const resolveLink: any = (url: string, ctx: any) => {
  const { isDev, windowUrl } = ctx;
  const { href: linkHref, host: linkHost, pathname: linkPathname } = parse(
    url,
    true
  );

  const { host, query, protocol } = parse(windowUrl, true);

  if (isDev) {
    const updatedQuery = {
      ...query,
      mystique_uid: getUID(linkHref || 'localhost'),
    };
    return `${isDev ? 'http:' : protocol}//${host}/?${qs(updatedQuery)}`;
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

interface ILinkResolver
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  url: string;
}

const LinkResolver: React.FC<ILinkResolver> = (props) => {
  const { url, children, ...restProps } = props;

  return (
    <EnvironmentContext.Consumer>
      {(ctx) => (
        <a href={resolveLink(url, ctx)} {...restProps}>
          {children}
        </a>
      )}
    </EnvironmentContext.Consumer>
  );
};

export default LinkResolver;
