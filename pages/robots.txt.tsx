import { Component } from 'react';
import { isSubdomain } from 'utils/index';

const fullDomain = (req: any) =>
  req.headers['x-forwarded-proto'] + '://' + req.headers.host;

const robotsContent = ({ domain, host }: { domain: string; host: string }) => {
  const isSubdomainHost = isSubdomain(host);
  const rules = isSubdomainHost
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
  static async getInitialProps({ res, req }: any) {
    const domain = fullDomain(req);
    const host = req.headers.host;
    let content = robotsContent({ domain, host });
    indexDomains.forEach((item) => {
      if (domain.includes(item)) {
        content = robotsContent({ domain, host });
      }
    });
    res.setHeader('Content-type', 'text/plain');
    res.write(content);
    res.end();
  }
}
