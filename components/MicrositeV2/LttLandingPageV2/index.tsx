import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import LazyComponent from 'components/common/LazyComponent';
import BrowseByCategoriesSection from 'components/MicrositeV2/LttLandingPageV2/BrowseByCategoriesSection';
import CategoryCarouselsSection from 'components/MicrositeV2/LttLandingPageV2/CategoryCarouselsSection';
import { TLandingPageV2Props } from 'components/MicrositeV2/LttLandingPageV2/interface';
import SpecialSections from 'components/MicrositeV2/LttLandingPageV2/SpecialSections';
import { LandingPageWrapper } from 'components/MicrositeV2/LttLandingPageV2/style';
import TopLttShowsSection from 'components/MicrositeV2/LttLandingPageV2/TopLttShowsSection';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { addDays, formatDateToString } from 'utils/dateUtils';
import { currencyAtom } from 'store/atoms/currency';
import { LTD_COLLECTION_ID } from 'const/index';
import { strings } from 'const/strings';

const LttLandingPageV2 = ({
  isMobile,
  categoryProps,
  allTours,
  browseByCategoriesRef,
}: TLandingPageV2Props) => {
  const { categories } = categoryProps;
  const categoriesToRender: Array<Record<string, any>> =
    categories?.filter(
      (category: Record<string, any>) =>
        category.id !== LTD_COLLECTION_ID &&
        category.ranking?.popularity?.length
    ) ?? [];

  const topShowsTgids = categoryProps.categories.find(
    (category: any) => category.id === LTD_COLLECTION_ID
  )?.ranking?.popularity;

  const duplicateTgids: Record<number, boolean> = {};

  const topShows: Array<Record<string, any>> = [];
  topShowsTgids.forEach((tgid: number) => {
    if (!duplicateTgids[tgid]) {
      topShows.push(allTours[tgid]);
      duplicateTgids[tgid] = true;
    }
  });

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
          actionName: strings.LTT_LANDING_PAGE.TODAY,
          onClick: () =>
            topShows.filter(
              (show: any) => inventoryData[show.tgid]?.dates[DATE_TODAY]
            ),
        },
        {
          actionName: strings.LTT_LANDING_PAGE.TOMORROW,
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
        <BrowseByCategoriesSection
          categoriesToRender={categoriesToRender}
          isMobile={isMobile}
          ref={browseByCategoriesRef}
        />
      </Conditional>
      <LazyComponent>
        <TopLttShowsSection
          isMobile={isMobile}
          topShows={topShows}
          totalCount={Object.keys(allTours).length}
          categoriesToRender={categoriesToRender}
        />
      </LazyComponent>
      <LazyComponent>
        <SpecialSections
          allTours={allTours}
          isMobile={isMobile}
          title={strings.LTT_LANDING_PAGE.LAST_MINUTE_TICKETS}
          actions={lastMinuteActions}
          updateActions={setLastMinuteActions}
          totalNumberOfShows={50}
          maxNumberOfShows={20}
          seeAllCardText="show tickets available" //TODO: localise
          preselectedActionName={lastMinuteActions?.[0]?.actionName}
          hideSeeAll={true}
          useForcedSekeltonLoaders
        />
      </LazyComponent>
      <LazyComponent>
        <CategoryCarouselsSection
          categoriesToRender={categoriesToRender}
          allTours={allTours}
          isMobile={isMobile}
        />
      </LazyComponent>
    </LandingPageWrapper>
  );
};

export default LttLandingPageV2;
