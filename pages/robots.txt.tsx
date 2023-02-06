import { Component } from 'react';

const fullDomain = (req: any) => req.headers['x-forwarded-proto'] + '://' + req.headers.host;

const robotsContentForStage = () =>
  `User-agent: Screaming Frog SEO Spider\nDisallow:\n\nUser-agent: *\nDisallow: /`;

const robotsContent = (domain: any) => `User-agent: *\n\nSitemap: ${domain}/sitemap.xml\nDisallow: */ja/*`;

const tempRobotsContent = `User-agent: *\nDisallow: /`;

const blackListNoIndex = [
  'rome-ticket.com',
  'madrid-ticket.com',
  'barcelonatickets.co',
  'paris-tickets.co',
  'versailles-tickets.com',
  'tickets-florence.com',
  'sevilletickets.com',
  'milan-tickets.co',
  'venice-tickets.co',
  'naples-tickets.co',
  'tickets-london.co.uk',
];

const indexDomains = [
  'parkguell.barcelonatickets.co',
  'camp-nou.barcelonatickets.co',
  'aerobus.barcelonatickets.co',
  'www.alhambra-granada-tickets.com',
  'www.alcazar-seville-tickets.com',
];

export default class RobotsTxt extends Component {
  static async getInitialProps({
    res,
    req
  }: any) {
    const domain = fullDomain(req);
    let content = domain.includes('stage-')
      ? robotsContentForStage()
      : robotsContent(domain);
    blackListNoIndex.forEach((item) => {
      if (domain.includes(item)) {
        content = tempRobotsContent;
      }
    });
    indexDomains.forEach((item) => {
      if (domain.includes(item)) {
        content = domain.includes('stage-')
          ? robotsContentForStage()
          : robotsContent(domain);
      }
    });
    res.setHeader('Content-type', 'text/plain');
    res.write(content);
    res.end();
  }
}
