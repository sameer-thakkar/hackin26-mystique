import { NextApiHandler } from 'next';
import Cookies from 'cookies';
import { checkIfCurrencyCodeValid } from 'utils/currency';
import { sendLog } from 'utils/logger';
import {
  createSafeTourTransformer,
  safeMarkdownToRichtext,
} from 'utils/tourGroups/richText';
import { COOKIE, CUSTOM_HEADER, UK_COUNTRY_CODE } from 'const/index';
import { LOG_LEVELS } from 'const/logs';

const BLACKLIST_QUERY_PARAMS = new Set(['slug', 'useTest', 'newCDN']);

const ToursAPI: NextApiHandler = async (req, res) => {
  const { useTest: useTestOverride, newCDN } = req?.query;
  const cookies = new Cookies(req, res);
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
    if (!BLACKLIST_QUERY_PARAMS.has(key))
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

  try {
    const apiResponse = await fetch(url, { headers });

    if (!apiResponse.ok) {
      sendLog({
        level: LOG_LEVELS.INFO,
        message: JSON.stringify({
          host: req.headers.host,
          url,
          message: 'Proxy API Error',
          statusCode: apiResponse.status,
        }),
      });
      return res
        .status(apiResponse.status)
        .json({ message: 'Proxy API Error' });
    }

    const data = await apiResponse.json();
    const transformTour = createSafeTourTransformer();

    res.setHeader('Access-Control-Allow-Origin', 'https://www.headout.com');
    res.setHeader('Content-type', 'application/json');

    if (data?.tourGroups?.length) {
      data.tourGroups = data.tourGroups.map(transformTour);
    }

    if (data?.products?.length) {
      data.products = data.products.map(transformTour);
    }

    if (data?.microBrandsHighlight) {
      data.microBrandsHighlight = safeMarkdownToRichtext({
        value: data?.microBrandsHighlight || '',
        context: 'response field=microBrandsHighlight',
      });
    }

    if (data?.pageData?.items?.length) {
      data.pageData.items = data.pageData.items.map(transformTour);
    }

    if (data?.sections?.length) {
      data.sections = data.sections.map((section: any) => {
        const { type, tourGroups } = section || {};
        return {
          type,
          tourGroups: {
            ...tourGroups,
            items: tourGroups?.items?.map(transformTour),
          },
        };
      });
    }

    res.status(200).json(data);
  } catch (error) {
    sendLog({
      err: error,
      level: LOG_LEVELS.INFO,
      message: JSON.stringify({
        host: req.headers.host,
        url,
        message: 'Proxy API Error',
        statusCode: 500,
      }),
    });

    return res.status(500).json({ message: 'Proxy API Error' });
  }
};

export default ToursAPI;
