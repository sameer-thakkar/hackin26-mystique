// @ts-expect-error TS(7016): Could not find a declaration file for module 'cook... Remove this comment to see the full error message
import Cookies from 'cookies';
import { COOKIE } from 'const/index';
import { checkIfCurrencyCodeValid } from 'utils/currency';
import TurndownService from 'turndown';

const markdownToRichtext = require('@ueno/markdown-to-prismic-richtext');
const turndownService = new TurndownService();

const getRichTextFromHtmlContent = (properties: string) => {
  if (!properties) return '';

  const markedProperties = turndownService.turndown(properties);
  return markdownToRichtext(markedProperties)?.map((inclusion: Highlight) => ({
    ...inclusion,
    ...inclusion.content,
  }));
};

const ToursAPI = async (req: any, res: any) => {
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
        data.tourGroups = data.tourGroups.map((tour: any) => ({
          ...tour,

          microBrandsHighlight: markdownToRichtext(
            tour.microBrandsHighlight || ''
          )?.map((highlight: any) => ({
            ...highlight,
            ...highlight.content,
          })),
          inclusionsRichText: getRichTextFromHtmlContent(tour.inclusions || ''),
          exclusionsRichText: getRichTextFromHtmlContent(tour.exclusions || ''),
        }));
      }
      if (data?.products?.length) {
        data.products = data.products.map((tour: any) => ({
          ...tour,

          microBrandsHighlight: markdownToRichtext(
            tour.microBrandsHighlight || ''
          )?.map((highlight: any) => ({
            ...highlight,
            ...highlight.content,
          })),
          inclusionsRichText: getRichTextFromHtmlContent(tour.inclusions || ''),
          exclusionsRichText: getRichTextFromHtmlContent(tour.exclusions || ''),
        }));
      }
      if (data?.microBrandsHighlight) {
        data.microBrandsHighlight = markdownToRichtext(
          data?.microBrandsHighlight || ''
        );
      }
      if (data?.pageData?.items?.length) {
        data.pageData.items = data?.pageData?.items.map((tour: any) => ({
          ...tour,

          microBrandsHighlight: markdownToRichtext(
            tour.microBrandsHighlight || ''
          )?.map((highlight: any) => ({
            ...highlight,
            ...highlight.content,
          })),
          inclusionsRichText: getRichTextFromHtmlContent(tour.inclusions || ''),
          exclusionsRichText: getRichTextFromHtmlContent(tour.exclusions || ''),
        }));
      }
      if (data?.sections?.length) {
        data.sections = data?.sections?.map((section: any) => {
          const { type, tourGroups } = section || {};
          return {
            type,
            tourGroups: {
              ...tourGroups,
              items: tourGroups?.items.map((tour: any) => ({
                ...tour,

                microBrandsHighlight: markdownToRichtext(
                  tour.microBrandsHighlight || ''
                )?.map((highlight: any) => ({
                  ...highlight,
                  ...highlight.content,
                })),
                inclusionsRichText: getRichTextFromHtmlContent(
                  tour.inclusions || ''
                ),
                exclusionsRichText: getRichTextFromHtmlContent(
                  tour.exclusions || ''
                ),
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
