import useSWRImmutable from 'swr/immutable';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';

export const useGuestCount = () => {
  const fetchUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.GuestCount,
    id: null,
  });
  const { data, error } = useSWRImmutable<Record<string, any>>(fetchUrl, {
    fetcher: swrFetcher,
  });
  return {
    data: data,
    error,
    isLoading: !error && !data,
  };
};
