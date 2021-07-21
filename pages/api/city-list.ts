import { NextApiRequest, NextApiResponse } from 'next';

const CityList = async (req: NextApiRequest, res: NextApiResponse) => {
  let curPage = +req.query.page || 1;
  // Display 50 countries per page. Limitation by prismic
  const perPage = 50;
  try {
    const cityRes = await fetch(`https://api.headout.com/api/v1/city/list`);
    const cityData = await cityRes.json();
    const totalCities = cityData?.length;
    const maxPage = Math.ceil(totalCities / perPage);
    if (curPage > maxPage) {
      curPage = maxPage;
    }
    const startIndex = (curPage - 1) * perPage;
    const endIndex = curPage * perPage;

    const citiesResult = cityData.slice(startIndex, endIndex);
    res.setHeader('Content-type', 'application/json');
    const response = {
      results_size: citiesResult?.length,
      results: citiesResult?.map((c) => {
        const { cityCode, displayName: city, country } = c || {};
        const { code: countryCode, displayName: countryName, currency } =
          country || {};
        return {
          id: cityCode,
          title: city,
          description: city,
          image_url:
            'https://www.headout.com/static/favicons/favicon-32x32.png',
          last_update: new Date().getTime(),
          blob: {
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
    res.status(500).json({
      ...error,
    });
  }
};

export default CityList;
