import { Component } from 'react';

const fullDomain = (req) =>
  req.headers['x-forwarded-proto'] + '://' + req.headers.host;

const robotsContentForStage = () =>
  `User-agent: Screaming Frog SEO Spider\nDisallow:\n\nUser-agent: *\nDisallow: /`;

const robotsContent = (domain) =>
  `User-agent: *\n\nSitemap: ${domain}/sitemap.xml`;

const tempRobotsContent = `User-agent: *\nDisallow: /`;

const tempDomains = [
  'rome-ticket.com',
  'madrid-ticket.com',
  'barcelonatickets.co',
  'paris-tickets.co',
  'versailles-tickets.com',
  'granada-tickets.com',
  'tickets-florence.com',
];

export default class RobotsTxt extends Component {
  static async getInitialProps({ res, req }) {
    const domain = fullDomain(req);
    let content = domain.includes('stage.')
      ? robotsContentForStage()
      : robotsContent(domain);
    tempDomains.forEach((item) => {
      if (domain.includes(item)) {
        content = tempRobotsContent;
      }
    });
    console.log(res);
    res.setHeader('Content-type', 'text/plain');
    res.write(content);
    res.end();
  }
}
