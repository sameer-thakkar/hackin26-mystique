import { generateGoogleMapUrl } from '@headout/espeon/components/Itinerary';
import { TStopsList } from './interface';

export const extractStopsList = ({
  routeSectionsData,
}: Record<string, any>): TStopsList[] => {
  return routeSectionsData?.reduce(
    (acc: TStopsList[], currentObject: Record<string, any>) => {
      if (
        currentObject?.type !== 'START_LOCATION' &&
        currentObject?.type !== 'END_LOCATION'
      ) {
        const { location: { latitude = 0, longitude = 0, placeId = '' } = {} } =
          currentObject || {};
        const stopData = {
          stopName: currentObject?.details?.name,
          stopLocation: generateGoogleMapUrl({ latitude, longitude, placeId }),
          attractionsCovered: currentObject?.childSections?.map(
            (section: Record<string, any>) => section?.details?.name
          ),
        };
        acc.push(stopData);
      }
      return acc;
    },
    []
  );
};
