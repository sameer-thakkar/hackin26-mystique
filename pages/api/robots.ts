const fullDomain = req =>
  req.headers["x-forwarded-proto"] + "://" + req.headers.host;

const robotsContentForStage = () =>
  `User-agent: Screaming Frog SEO Spider\nDisallow:\n\nUser-agent: *\nDisallow: /`;

const robotsContent = domain =>
  `User-agent: *\n\nSitemap: ${domain}/sitemap.xml`;

export default function handle(req, res) {
  const domain = fullDomain(req);
  const content = domain.includes("stage.")
    ? robotsContentForStage()
    : robotsContent(domain);
  res.setHeader("Content-type", "text/plain");
  res.send(content);
  res.end();
}
