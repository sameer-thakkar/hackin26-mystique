import useSWRImmutable from 'swr/immutable';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';

type TAirport = {
  iataCode: string;
  name: string;
  tourGroupId: number;
};

export const usePrivateAirportTransferAirports = (cityCode: string) => {
  const fetchUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.Airports,
    id: null,
    params: {
      cities: cityCode,
    },
  });

  const { data, error } = useSWRImmutable<Record<string, TAirport[]>>(
    cityCode ? fetchUrl : null, // Only fetch if cityCode is present
    {
      fetcher: swrFetcher,
    }
  );

  return {
    data: data?.[cityCode],
    error,
    isLoading: !error && !data,
  };
};
