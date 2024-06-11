import type { NextApiRequest, NextApiResponse } from 'next';
import { getValidUrl } from 'utils/urlUtils';
import { getHeadoutApiUrl, HeadoutEndpoints } from '../../utils/apiUtils';

const CityList = async (req: NextApiRequest, res: NextApiResponse) => {
  let curPage = Number(req.query.page) || 1;
  // Display 50 countries per page. Limitation by prismic
  const perPage = 50;
  try {
    const endpoint = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.CityListV2,
      id: null,
    });
    const cityRes = await fetch(endpoint);
    const cityData = await cityRes.json();
    const totalCities = cityData?.length;
    const maxPage = Math.ceil(totalCities / perPage);
    if (curPage > maxPage) {
      curPage = maxPage;
    }
    const startIndex = (curPage - 1) * perPage;
    const endIndex = curPage * perPage;

    const citiesResult: Record<string, any>[] = cityData.slice(
      startIndex,
      endIndex
    );
    res.setHeader('Content-type', 'application/json');
    const response = {
      results_size: totalCities,
      results: citiesResult?.map((c) => {
        const { cityCode, displayName: city, country, imageURL } = c || {};
        const {
          code: countryCode,
          displayName: countryName,
          currency,
        } = country || {};
        return {
          id: cityCode,
          title: city,
          description: city,
          image_url: getValidUrl(imageURL),
          last_update: new Date().getTime(),
          blob: {
            id: cityCode,
            cityCode,
            city,
            countryCode,
            country: countryName,
            currency,
          },
        };
      }),
      curPage,
      maxPage,
    };

    res.status(200).json({
      ...response,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export default CityList;
