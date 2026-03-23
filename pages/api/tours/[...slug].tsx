import { NextApiHandler } from 'next';
import Cookies from 'cookies';
import TurndownService from 'turndown';
import { checkIfCurrencyCodeValid } from 'utils/currency';
import { sendLog } from 'utils/logger';
import { COOKIE, CUSTOM_HEADER, UK_COUNTRY_CODE } from 'const/index';
import { LOG_LEVELS } from 'const/logs';

const markdownToRichtext = require('@ueno/markdown-to-prismic-richtext');

const turndownService = new TurndownService();

const getRichTextFromHtmlContent = (properties: string) => {
  if (!properties) return '';

  const markedProperties = turndownService.turndown(properties);
  return markdownToRichtext(markedProperties)?.map((inclusion: THighlight) => ({
    ...inclusion,
    ...inclusion.content,
  }));
};

const ToursAPI: NextApiHandler = async (req, res) => {
  const { useTest: useTestOverride, newCDN } = req?.query;
  const cookies = new Cookies(req, res);
  const blackListQueryParams = ['slug', 'useTest', 'newCDN'];
  const headers = new Headers();
  const useTest =
    useTestOverride ||
    req?.headers?.host?.includes('test-headout') ||
    req?.headers?.host?.includes('localhost');

  const originalChannel =
    (req.headers['x-channel'] as string) || cookies.get(COOKIE.CURRENT_CHANNEL);

  if (originalChannel) {
    headers.set('x-channel', originalChannel);
  }

  // Check both SSR and client cookies — see IndexPage.tsx for why two cookies exist.
  const isUkExtraChargeEnabled =
    req.headers[CUSTOM_HEADER.PRICE_TRANSPARENCY_ENABLED] === 'true' ||
    cookies.get(COOKIE.UK_EXTRA_CHARGE_SSR) === 'true' ||
    cookies.get(COOKIE.UK_EXTRA_CHARGE_ENABLED) === 'true';

  if (isUkExtraChargeEnabled) {
    headers.set(CUSTOM_HEADER.PRICE_TRANSPARENCY_ENABLED, 'true');
    headers.set(CUSTOM_HEADER.FORWARDED_COUNTRY_CODE, UK_COUNTRY_CODE);
  }

  const queryParamsObj = new URLSearchParams();
  const cookieCurrency = cookies.get(COOKIE.CURRENT_CURRENCY);
  const isCookieCurrencyValid = checkIfCurrencyCodeValid({
    currencyCode: cookieCurrency as string,
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

  const url = `https://${newCDN === 'true' ? 'api-mb' : 'api'}.${
    useTest === 'true' || useTest ? 'test-' : ''
  }headout.com/api/${(req.query.slug as string[])?.join('/')}/${
    queryParamsString ? `?${queryParamsString}` : ''
  }`;

  await fetch(url, { headers })
    .then((apiResponse) => {
      if (!apiResponse.ok) {
        sendLog({
          level: LOG_LEVELS.INFO,
          message: {
            host: req.headers.host,
            url,
            message: 'Proxy API Error',
            statusCode: apiResponse.status,
          },
        });
        res.status(apiResponse.status);
        throw new Error('Proxy API Error');
      }

      return apiResponse;
    })
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
    })
    .catch(() => {
      res.end();
    });
};

export default ToursAPI;
