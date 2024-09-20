import { useMemo } from 'react';
import CalendarUnit from 'components/CalendarUnit';
import Conditional from 'components/common/Conditional';
import FabIcon from 'components/common/FabIcon';
import CategoryPageBanner from 'components/MicrositeV2/CategoryPageBanner';
import DesktopBannerV2 from 'components/MicrositeV2/DesktopBannerV2';
import BrowseByCategoriesSection from 'components/MicrositeV2/EntertainmentMBLandingPageV2/BrowseByCategoriesSection';
import CategoryCarouselsSection from 'components/MicrositeV2/EntertainmentMBLandingPageV2/CategoryCarouselsSection';
import TopShowsSection from 'components/MicrositeV2/EntertainmentMBLandingPageV2/TopShowsSection';
import { TMonthOnMonthPageProps } from 'components/MonthOnMonthPage/interface';
import { MonthOnMonthPageWrapper } from 'components/MonthOnMonthPage/styles';
import {
  getAllowedTgids,
  getFilteredObject,
  getTgidAsKey,
} from 'components/MonthOnMonthPage/utils/index';
import { sendLog } from 'utils/logger';

const MonthOnMonthPage: React.FC<TMonthOnMonthPageProps> = ({
  heroProps,
  isMobile,
  breadcrumbs,
  browseByCategoriesRef,
  taggedCollection,
  categoryTourListData,
  categoryProps,
  allTours,
  pageTabsSlice,
  displayMonth,
  isEntertainmentBanner,
  bannerTrustBoosters,
}) => {
  const allowedTgids = useMemo(() => {
    const result = getAllowedTgids(displayMonth, allTours);
    if (result?.length === 0 || !result) {
      sendLog({
        message: 'Allowed tgids empty',
      });
    }
    return result ?? [];
  }, [allTours, displayMonth]);

  const topShowsAllowedTgids = useMemo(() => {
    const result = getAllowedTgids(
      displayMonth,
      getTgidAsKey(categoryTourListData[taggedCollection])
    );
    if (result?.length === 0 || !result) {
      sendLog({
        message: 'Top shows allowed tgids empty',
      });
    }
    return result ?? [];
  }, [displayMonth]);

  const { categories } = categoryProps;

  const getUpdatedCategoriesToRender = (categories: any) => {
    const clonedCategories = categories;

    clonedCategories?.forEach((_: Record<string, any>, index: number) => {
      let allowedTours: number[] = [];

      clonedCategories[index]?.ranking?.popularity?.forEach((tgid: number) => {
        if (allowedTgids.includes(Number(tgid))) {
          allowedTours.push(tgid);
        }
      });

      clonedCategories[index].ranking.popularity = allowedTours;
    });

    const categoriesToRender: Array<Record<string, any>> =
      clonedCategories?.filter(
        (category: Record<string, any>) => category?.ranking?.popularity?.length
      ) ?? [];

    return categoriesToRender;
  };

  const topShows = Object.values(
    getFilteredObject(
      categoryTourListData[taggedCollection],
      topShowsAllowedTgids
    )
  );

  const bannerImgUrl = isMobile
    ? heroProps?.banners[0]?.mobile_url
    : heroProps?.banners[0]?.url;

  return (
    <>
      <Conditional if={isEntertainmentBanner}>
        <DesktopBannerV2
          allTours={[]}
          bannerImages={[heroProps?.banners[0]]}
          trustBoosters={bannerTrustBoosters}
        />
      </Conditional>
      <Conditional if={!isEntertainmentBanner}>
        <CategoryPageBanner
          heading={heroProps?.banners[0]?.bannerHeading}
          isMobile={isMobile}
          bannerImgUrl={bannerImgUrl}
          breadcrumbs={breadcrumbs}
          isMonthOnMonthPage
          trustBoosters={bannerTrustBoosters}
        />
      </Conditional>
      <MonthOnMonthPageWrapper>
        <Conditional if={!isMobile}>
          <BrowseByCategoriesSection
            categoriesToRender={getUpdatedCategoriesToRender(categories)}
            isMobile={isMobile}
            ref={browseByCategoriesRef}
            showGridUI={isMobile}
          />
        </Conditional>
        <div className={isMobile ? '' : 'main-wrapper'}>
          <TopShowsSection
            isMobile={isMobile}
            topShows={topShows}
            heading={heroProps?.coverHeading}
            showBrowseByCategories
            isCategoryPage
            categoriesToRender={getUpdatedCategoriesToRender(categories)}
          />
          <CategoryCarouselsSection
            categoriesToRender={getUpdatedCategoriesToRender(categories)}
            allTours={allTours}
            isMobile={isMobile}
            isCategoryPage
          />
        </div>
      </MonthOnMonthPageWrapper>
      <div className={isMobile ? '' : 'main-wrapper'}>
        <CalendarUnit
          pageTabsSlice={pageTabsSlice}
          displayMonth={displayMonth}
          isMobile={isMobile}
        />
      </div>
      <FabIcon displayMonth={displayMonth} />
    </>
  );
};

export default MonthOnMonthPage;
