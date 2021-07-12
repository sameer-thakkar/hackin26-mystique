const markdownToRichtext = require('@ueno/markdown-to-prismic-richtext');
const ToursAPI = async (req, res) => {
  const { useTest } = req?.query;
  const blackListQueryParams = ['slug', 'useTest'];
  const queryParams = Object.entries(req.query)
    .map(([key, value]) =>
      !blackListQueryParams.includes(key) ? `${key}=${value}` : null
    )
    .filter((q) => q);

  await fetch(
    `https://api.${
      useTest === 'true' || useTest ? 'test-' : ''
    }headout.com/api/${req.query.slug.join('/')}?${queryParams.join('&')}`
  )
    .then((r) => r.json())
    .then((r) => {
      let data = r;
      res.setHeader('Content-type', 'application/json');
      if (data?.tourGroups?.length) {
        data.tourGroups = data.tourGroups.map((tour) => ({
          ...tour,
          microBrandsHighlight: markdownToRichtext(
            tour.microBrandsHighlight || ''
          )?.map((highlight) => ({ ...highlight, ...highlight.content })),
        }));
      }
      if (data?.products?.length) {
        data.products = data.products.map((tour) => ({
          ...tour,
          microBrandsHighlight: markdownToRichtext(
            tour.microBrandsHighlight || ''
          )?.map((highlight) => ({ ...highlight, ...highlight.content })),
        }));
      }
      if (data?.microBrandsHighlight) {
        data.microBrandsHighlight = markdownToRichtext(
          data?.microBrandsHighlight || ''
        );
      }

      res.write(JSON.stringify(data));
      res.end();
    });
};

export default ToursAPI;
