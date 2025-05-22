import { useRecoilValue, useSetRecoilState } from 'recoil';
import useSWR from 'swr';
import { getDateXDaysAhead } from 'components/SeatMapPage/components/SideBar/utils';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { tourAvailabiltiesAtom } from 'store/atoms/tourAvailabilties';

interface UseFetchTourAvailabilitiesProps {
  loading: boolean;
  tgid: string;
  tourStartDate: string;
  activeCurrencyCode: string;
}

export const useFetchTourAvailabilities = ({
  loading,
  tgid,
  tourStartDate,
  activeCurrencyCode,
}: UseFetchTourAvailabilitiesProps) => {
  const setTourAvailabilties = useSetRecoilState(tourAvailabiltiesAtom);
  const { tourAvailabilties: tourAvailabiltiesInStore } = useRecoilValue(
    tourAvailabiltiesAtom
  );

  const availableToursDateUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupInventoriesV7,
    id: tgid,
    params: {
      'from-date': tourStartDate,
      'to-date': getDateXDaysAhead({
        startDate: tourStartDate,
        daysAhead: 7,
      }),
      currency: activeCurrencyCode,
      'use-seatmap-prices': 'true',
    },
  });

  const isTourStartDateInStore = tourAvailabiltiesInStore?.availabilities?.some(
    (availability: any) => availability.startDate === tourStartDate
  );

  let { data: tourAvailabilities, isValidating } = useSWR(
    loading || isTourStartDateInStore ? null : availableToursDateUrl,
    {
      fetcher: swrFetcher,
      onSuccess: (data) => {
        setTourAvailabilties({
          tourAvailabilties: {
            ...data,
          },
        });
      },
    }
  );

  if (isTourStartDateInStore) {
    tourAvailabilities = tourAvailabiltiesInStore;
  }

  return {
    tourAvailabilities,
    isValidating,
  };
};
