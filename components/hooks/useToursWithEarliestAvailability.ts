import useSWRImmutable from 'swr/immutable';
import { TTour } from 'components/AirportTransfers/interface';
import { fetchBatchedCalendarInventory } from 'utils/apiUtils';
import { addDays, formatDateToString } from 'utils/dateUtils';

export const useToursWithEarliestAvailability = ({
  tours,
  currency,
  shouldFetchEarliestAvailabilities,
}: {
  tours: TTour[];
  shouldFetchEarliestAvailabilities: boolean;
  currency: string;
}) => {
  const { data: inventory, error } = useSWRImmutable(
    shouldFetchEarliestAvailabilities ? 'batchedCalendarInventory' : null, // Key to cache data
    () =>
      fetchBatchedCalendarInventory({
        tgids: tours.map((tour) => tour.tgid).filter(Boolean),
        fromDate: formatDateToString(new Date(), 'en', 'YYYY-MM-DD'),
        currency,
        toDate: formatDateToString(addDays(new Date(), 60), 'en', 'YYYY-MM-DD'),
      }),
    {
      fallback: {},
    }
  );

  const earliestAvailabilityData = Object.keys(inventory || {}).reduce(
    (acc: Record<number, any>, tgid) => {
      const tour = inventory?.[Number(tgid) as keyof typeof inventory];
      const { sortedInventoryDates } = tour || ({} as any);
      const [firstAvailableDate] = sortedInventoryDates || [];

      if (!firstAvailableDate) return acc;

      return {
        ...acc,
        [tgid]: {
          startDate: firstAvailableDate,
        },
      };
    },
    {}
  );

  const showEarliestAvailability =
    shouldFetchEarliestAvailabilities && !error && inventory;

  const toursWithEarliestAvailability = shouldFetchEarliestAvailabilities
    ? (tours.map((tour: any) => ({
        ...tour,
        earliestAvailability:
          earliestAvailabilityData[
            tour.tgid as keyof typeof earliestAvailabilityData
          ],
      })) as TTour[])
    : tours;

  return { toursWithEarliestAvailability, showEarliestAvailability };
};
