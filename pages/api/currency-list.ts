import type { NextApiRequest, NextApiResponse } from 'next';
import { getHeadoutApiUrl, HeadoutEndpoints } from '../../utils/apiUtils';

const CurrencyList = async (_req: NextApiRequest, res: NextApiResponse) => {
  const endpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.CurrencyList,
    id: null,
  });
  await fetch(endpoint)
    .then((r) => r.json())
    .then((r) => {
      let data = r;
      res.setHeader('Content-type', 'application/json');
      const response = {
        results_size: data.length,
        results: data.map((currency: any) => ({
          id: currency?.code,
          title: currency?.currencyName,
          description: `${currency?.currencyName} - ${currency?.localSymbol}`,

          image_url:
            'https://www.headout.com/static/favicons/favicon-32x32.png',

          last_update: new Date().getTime(),

          blob: {
            ...currency,
          },
        })),
      };
      res.write(JSON.stringify(response));
      res.end();
    });
};

export default CurrencyList;
