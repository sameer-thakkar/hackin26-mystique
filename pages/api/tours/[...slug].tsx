import Cookies from 'cookies';
import { COOKIE } from 'const/index';
import { checkIfCurrencyCodeValid } from 'utils/currency';

const markdownToRichtext = require('@ueno/markdown-to-prismic-richtext');
const ToursAPI = async (req, res) => {
  const { useTest } = req?.query;
  const cookies = new Cookies(req, res);
  const blackListQueryParams = ['slug', 'useTest'];

  const queryParamsObj = new URLSearchParams();
  const cookieCurrency = cookies.get(COOKIE.CURRENT_CURRENCY);
  const isCookieCurrencyValid = checkIfCurrencyCodeValid({
    currencyCode: cookieCurrency,
  });

  Object.entries(req.query ?? {}).forEach(([key, value]) => {
    if (!blackListQueryParams.includes(key))
      queryParamsObj.set(key, value as string);
  });

  if (
    isCookieCurrencyValid &&
    cookieCurrency &&
    !queryParamsObj.get('currency')
  ) {
    queryParamsObj.set('currency', cookieCurrency);
  } else if (cookieCurrency && !isCookieCurrencyValid) {
    cookies.set(COOKIE.CURRENT_CURRENCY);
  }

  const queryParamsString = queryParamsObj.toString();

  const url = `https://api.${
    useTest === 'true' || useTest ? 'test-' : ''
  }headout.com/api/${req.query.slug.join('/')}/${
    queryParamsString ? `?${queryParamsString}` : ''
  }`;
  await fetch(url)
    .then((r) => r.json())
    .then((r) => {
      let data = r;
      res.setHeader('Access-Control-Allow-Origin', 'https://www.headout.com');
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
      if (data?.pageData?.items?.length) {
        data.pageData.items = data?.pageData?.items.map((tour) => ({
          ...tour,
          microBrandsHighlight: markdownToRichtext(
            tour.microBrandsHighlight || ''
          )?.map((highlight) => ({ ...highlight, ...highlight.content })),
        }));
      }
      if (data?.sections?.length) {
        data.sections = data?.sections?.map((section) => {
          const { type, tourGroups } = section || {};
          return {
            type,
            tourGroups: {
              ...tourGroups,
              items: tourGroups?.items.map((tour) => ({
                ...tour,
                microBrandsHighlight: markdownToRichtext(
                  tour.microBrandsHighlight || ''
                )?.map((highlight) => ({ ...highlight, ...highlight.content })),
              })),
            },
          };
        });
      }

      res.write(JSON.stringify(data));
      res.end();
    });
};

export default ToursAPI;
