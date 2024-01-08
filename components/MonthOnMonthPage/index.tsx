import { useMemo } from 'react';
import CalendarUnit from 'components/CalendarUnit';
import Conditional from 'components/common/Conditional';
import FabIcon from 'components/common/FabIcon';
import CategoryPageBanner from 'components/MicrositeV2/CategoryPageBanner';
import BrowseByCategoriesSection from 'components/MicrositeV2/LttLandingPageV2/BrowseByCategoriesSection';
import CategoryCarouselsSection from 'components/MicrositeV2/LttLandingPageV2/CategoryCarouselsSection';
import TopLttShowsSection from 'components/MicrositeV2/LttLandingPageV2/TopLttShowsSection';
import { TMonthOnMonthPageProps } from 'components/MonthOnMonthPage/interface';
import { MonthOnMonthPageWrapper } from 'components/MonthOnMonthPage/styles';
import {
  getAllowedTgids,
  getFilteredObject,
  getTgidAsKey,
} from 'components/MonthOnMonthPage/utils/index';

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
}) => {
  const allowedTgids = useMemo(
    () => getAllowedTgids(displayMonth, allTours),
    [allTours, displayMonth]
  );

  const topShowsAllowedTgids = useMemo(
    () =>
      getAllowedTgids(
        displayMonth,
        getTgidAsKey(categoryTourListData[taggedCollection])
      ),
    [displayMonth]
  );

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
      <CategoryPageBanner
        heading={heroProps?.banners[0]?.bannerHeading}
        isMobile={isMobile}
        bannerImgUrl={bannerImgUrl}
        breadcrumbs={breadcrumbs}
        isMonthOnMonthPage
      />
      <MonthOnMonthPageWrapper>
        <Conditional if={!isMobile}>
          <BrowseByCategoriesSection
            categoriesToRender={getUpdatedCategoriesToRender(categories)}
            isMobile={isMobile}
            ref={browseByCategoriesRef}
          />
        </Conditional>
        <div className={isMobile ? '' : 'main-wrapper'}>
          <TopLttShowsSection
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
