import { generateGoogleMapPlacesUrl } from '@headout/espeon/components/ItineraryV2';
import { TBoardingPoint } from './types';

export const extractBoardingPoints = ({
  sectionsData,
}: Record<string, any>): TBoardingPoint[] => {
  return sectionsData?.reduce(
    (
      acc: TBoardingPoint[],
      currentObject: Record<string, any>,
      index: number
    ) => {
      if (currentObject?.type === 'START_LOCATION') {
        const { location: { latitude = 0, longitude = 0, placeId = '' } = {} } =
          currentObject || {};
        const boardingPointData = {
          stopNumber: index + 1,
          stopName: currentObject?.details?.name,
          stopLocation: generateGoogleMapPlacesUrl({
            latitude,
            longitude,
            placeId,
          }),
          hideStop: !latitude || !longitude,
        };
        acc.push(boardingPointData);
      }
      return acc;
    },
    []
  );
};
