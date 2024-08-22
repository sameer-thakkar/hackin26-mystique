import { TAttractionsList } from './interface';

export const extractAttractionsData = ({
  routeSectionsData,
  excludeStopAsAttraction = false,
}: {
  routeSectionsData: Record<string, any>;
  excludeStopAsAttraction?: boolean;
}): TAttractionsList[] => {
  const attractionsData = routeSectionsData?.reduce(
    (acc: TAttractionsList[], currentObject: Record<string, any>) => {
      if (
        currentObject?.type !== 'START_LOCATION' &&
        currentObject?.type !== 'END_LOCATION'
      ) {
        const parentAttraction = {
          name: currentObject?.details?.name,
          imageUrl: currentObject?.details?.mediaUrls?.[0],
          stopName: currentObject?.details?.name,
        };
        if (!excludeStopAsAttraction) {
          acc.push(parentAttraction);
        }

        if (currentObject?.childSections?.length) {
          const nestedAttractions = currentObject.childSections.map(
            (section: Record<string, any>) => ({
              name: section?.details?.name,
              imageUrl: section?.details?.mediaUrls?.[0] || '',
              stopName: currentObject?.details?.name,
            })
          );
          acc = acc.concat(nestedAttractions);
        }
      }
      return acc;
    },
    []
  );

  const uniqueItems = [
    ...new Map(
      attractionsData.map((item: TAttractionsList) => [
        item.name?.toLowerCase(),
        item,
      ])
    ).values(),
  ];
  return uniqueItems as TAttractionsList[];
};
