import { serialize } from 'cookie';
const markdownToRichtext = require('@ueno/markdown-to-prismic-richtext');
const ToursAPI = async (req, res) => {
  const nakedDomain = req.headers.host
    .replace('stage-', '')
    .split('.')
    .slice(1)
    .join('.');
  const queryParams = Object.entries(req.query)
    .map(([key, value]) => (key !== 'slug' ? `${key}=${value}` : null))
    .filter((q) => q);
  let hsid = '';
  await fetch(
    `https://api.headout.com/api/${req.query.slug.join('/')}?${queryParams.join(
      '&'
    )}`
  )
    .then((r) => {
      hsid = r.headers.get('x-h-sid');
      return r.json();
    })
    .then((r) => {
      let data = r;
      res.setHeader('Content-type', 'application/json');
      if (!req.cookies['h-sid'])
        res.setHeader(
          'Set-Cookie',
          serialize('h-sid', hsid, {
            domain: nakedDomain,
            path: '/',
            expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
          })
        );
      if (data?.tourGroups?.length) {
        data.tourGroups = data.tourGroups.map((tour) => ({
          ...tour,
          microBrandsHighlight: markdownToRichtext(
            tour.microBrandsHighlight || ''
          )?.map((highlight) => ({ ...highlight, ...highlight.content })),
        }));
      }
      res.write(JSON.stringify(data));
      res.end();
    });
};

export default ToursAPI;
