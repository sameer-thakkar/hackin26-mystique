import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import BrowseByCategoriesSection from 'components/MicrositeV2/LttLandingPageV2/BrowseByCategoriesSection';
import CategoryCarouselsSection from 'components/MicrositeV2/LttLandingPageV2/CategoryCarouselsSection';
import ReviewSection from 'components/MicrositeV2/LttLandingPageV2/ReviewSection';
import SpecialSections from 'components/MicrositeV2/LttLandingPageV2/SpecialSections';
import { LandingPageWrapper } from 'components/MicrositeV2/LttLandingPageV2/style';
import TopLttShowsSection from 'components/MicrositeV2/LttLandingPageV2/TopLttShowsSection';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { addDays, formatDateToString } from 'utils/dateUtils';
import { currencyAtom } from 'store/atoms/currency';

type ILandingPageV2Props = {
  isMobile: boolean;
  categoryProps: any;
  allTours: Record<number, any>[];
};

const LttLandingPageV2 = ({
  isMobile,
  categoryProps,
  allTours,
}: ILandingPageV2Props) => {
  const topShowsTgids = categoryProps.categories.find(
    (category: any) => category.id === 167
  )?.ranking?.popularity;

  const topShows = topShowsTgids.map((tgid: number) => allTours[tgid]);

  const currency = useRecoilValue(currencyAtom);

  const DATE_TODAY = formatDateToString(new Date(), 'en', 'YYYY-MM-DD');
  const DATE_TOMORROW = formatDateToString(
    addDays(new Date(), 1),
    'en',
    'YYYY-MM-DD'
  );

  const inventoryEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.CalendarInventoryForTourGroupList,
    params: {
      'tour-group-ids': Object.keys(allTours).join(','),
      'from-date': DATE_TODAY,
      'to-date': DATE_TOMORROW,
      ...(currency && {
        currency,
      }),
    },
    id: '',
  });

  let { data } = useSWR(inventoryEndpoint, {
    fetcher: swrFetcher,
  });
  const [lastMinuteActions, setLastMinuteActions] = useState<any>([]);

  useEffect(() => {
    const inventoryData = data?.data;
    if (inventoryData) {
      setLastMinuteActions([
        {
          actionName: 'Today',
          onClick: () =>
            topShows.filter(
              (show: any) => inventoryData[show.tgid]?.dates[DATE_TODAY]
            ),
        },
        {
          actionName: 'Tomorrow',
          onClick: () =>
            topShows.filter(
              (show: any) => inventoryData[show.tgid]?.dates[DATE_TOMORROW]
            ),
        },
      ]);
    }
  }, [data]);

  return (
    <LandingPageWrapper>
      <Conditional if={!isMobile}>
        <BrowseByCategoriesSection />
      </Conditional>
      <TopLttShowsSection
        isMobile={isMobile}
        topShows={topShows}
        totalCount={Object.keys(allTours).length}
      />
      <SpecialSections
        allTours={allTours}
        isMobile={isMobile}
        title={'Last minute tickets'}
        actions={lastMinuteActions}
        totalNumberOfShows={50}
        maxNumberOfShows={20}
        seeAllCardText="show tickets available" //TODO: localise
        preselectedActionName={lastMinuteActions?.[0]?.actionName}
        hideSeeAll={true}
      />
      <CategoryCarouselsSection
        categoryProps={categoryProps}
        allTours={allTours}
        isMobile={isMobile}
      />
      <ReviewSection isMobile={isMobile} />
    </LandingPageWrapper>
  );
};

export default LttLandingPageV2;
