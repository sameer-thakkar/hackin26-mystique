import { Component } from 'react';
import { NextPageContext } from 'next';
import { isSubdomain } from 'utils/index';
import { getDomainFromUid, getHostFromUid } from 'utils/urlUtils';
import {
  ROBOTS_TXT_ALLOWED_SUBDOMAINS,
  ROBOTS_TXT_BLOCKED_DOMAINS,
} from 'const/index';

const fullDomain = (req: any) =>
  req.headers['x-forwarded-proto'] + '://' + req.headers.host;

const robotsContent = ({ domain, host }: { domain: string; host: string }) => {
  const isSubdomainHost = isSubdomain(host);

  // These domains are completely blocked from robots.txt
  const shouldBlockDomain = ROBOTS_TXT_BLOCKED_DOMAINS.includes(domain);
  // These subdomains are allowed to be indexed
  const allowedSubdomains = ROBOTS_TXT_ALLOWED_SUBDOMAINS.includes(host);

  const rules =
    !allowedSubdomains && (isSubdomainHost || shouldBlockDomain)
      ? [`User-agent: *`, 'Disallow: /']
      : [
          `User-agent: *`,
          '',
          `Sitemap: ${domain}/sitemap.xml`,
          `Disallow: *amp=`,
          `Disallow: */ja/*`,
        ];

  return rules.join('\n');
};

const indexDomains = [
  'parkguell.barcelonatickets.co',
  'camp-nou.barcelonatickets.co',
  'aerobus.barcelonatickets.co',
  'www.alhambra-granada-tickets.com',
  'www.alcazar-seville-tickets.com',
];

export default class RobotsTxt extends Component {
  static async getInitialProps({ res, req, query }: NextPageContext) {
    const { mystique_uid } = query ?? {};
    const isDev = Boolean(mystique_uid);

    const domain = isDev
      ? getDomainFromUid(mystique_uid as string)
      : fullDomain(req as any);
    const host = isDev
      ? getHostFromUid(mystique_uid as string)
      : req?.headers?.host;

    if (!domain || !host) {
      res?.setHeader('Content-type', 'text/plain');
      res?.write('User-agent: *\nDisallow: /');
      res?.end();
      return;
    }

    let content = robotsContent({ domain, host });
    indexDomains.forEach((item) => {
      if (domain.includes(item)) {
        content = robotsContent({ domain, host });
      }
    });
    res?.setHeader('Content-type', 'text/plain');
    res?.write(content);
    res?.end();
  }
}
