import { ComponentType, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { SwiperOptions } from 'swiper';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import Reviews from 'components/common/Reviews';
import { TCategoryCarouselsSection } from 'components/MicrositeV2/LttLandingPageV2/CategoryCarouselsSection/interface';
import { TLandingPageV2Props } from 'components/MicrositeV2/LttLandingPageV2/interface';
import { ISpecialSections } from 'components/MicrositeV2/LttLandingPageV2/SpecialSections/interface';
import {
  LandingPageWrapper,
  ReviewSectionWrapper,
} from 'components/MicrositeV2/LttLandingPageV2/style';
import { ITopLttShowsSectionProps } from 'components/MicrositeV2/LttLandingPageV2/TopLttShowsSection';
import { TMediaData } from 'components/NewsPage/ArticlePage/interface';
import { MBContext } from 'contexts/MBContext';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { addDays, formatDateToString } from 'utils/dateUtils';
import { sendLog } from 'utils/logger';
import { currencyAtom } from 'store/atoms/currency';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  LTD_COLLECTION_ID,
  RESOURCE_ASSET_TYPE,
} from 'const/index';
import { strings } from 'const/strings';

const BrowseByCategoriesSection: ComponentType<any> = dynamic(
  () =>
    import(
      /* webpackChunkName: "BrowseByCategoriesSection" */ 'components/MicrositeV2/LttLandingPageV2/BrowseByCategoriesSection'
    )
);

const CategoryCarouselsSection: ComponentType<TCategoryCarouselsSection> =
  dynamic(
    () =>
      import(
        /* webpackChunkName: "CategoryCarouselsSection" */ 'components/MicrositeV2/LttLandingPageV2/CategoryCarouselsSection'
      )
  );

const SpecialSections: ComponentType<ISpecialSections> = dynamic(
  () =>
    import(
      /* webpackChunkName: "SpecialSections" */ 'components/MicrositeV2/LttLandingPageV2/SpecialSections'
    )
);

const TopLttShowsSection: ComponentType<ITopLttShowsSectionProps> = dynamic(
  () =>
    import(
      /* webpackChunkName: "TopLttShowsSection" */ 'components/MicrositeV2/LttLandingPageV2/TopLttShowsSection'
    )
);

const NUMBER_OF_CATEGORIES_BEFORE_REVIEWS = 3;
const NUMBER_OF_REVIEWS_TO_FETCH = 9;

const LttLandingPageV2 = ({
  isMobile,
  categoryProps,
  allTours,
  browseByCategoriesRef,
  directTgid,
}: TLandingPageV2Props) => {
  const { lang } = useContext(MBContext);

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

  if (directTgid) {
    topShowsTgids.unshift(directTgid);
  }
  const duplicateTgids: Record<number, boolean> = {};

  const topShows: Array<Record<string, any>> = [];
  topShowsTgids.forEach((tgid: number) => {
    if (!duplicateTgids[tgid] && allTours[tgid]) {
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

  const collectionReviewsApiEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.CollectionReviews,
    params: {
      limit: NUMBER_OF_REVIEWS_TO_FETCH.toString(),
      language: lang,
    },
    id: LTD_COLLECTION_ID,
  });

  let { data: collectionReviews, error: collectionReviewsError } = useSWR<{
    items: Record<string, any>[];
  }>(collectionReviewsApiEndpoint, {
    fetcher: swrFetcher,
  });

  let { data } = useSWR(inventoryEndpoint, {
    fetcher: swrFetcher,
  });

  const [lastMinuteActions, setLastMinuteActions] = useState<any>([]);
  const [mediaData, setMediaData] = useState<{
    resourceEntityMedias: TMediaData[];
  }>({ resourceEntityMedias: [] });

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

  useEffect(() => {
    if (!collectionReviews) return;

    const resourceEntityMedias = collectionReviews.items.map(
      (review: Record<string, any>) => ({
        resourceEntityId: review.tourGroup.id,
        medias: [
          {
            url: allTours?.[review.tourGroup.id]?.verticalImage?.url,
            type: RESOURCE_ASSET_TYPE.IMAGE,
          },
        ],
      })
    );
    const mediaData = { resourceEntityMedias };
    setMediaData(mediaData);
  }, [collectionReviews]);

  useEffect(() => {
    if (collectionReviewsError) {
      sendLog({
        message: `[CollectionReviewsApi] - collection reviews api failed for collection id ${LTD_COLLECTION_ID}`,
        err: collectionReviewsError,
      });
    }
  }, [collectionReviewsError]);

  const swiperParams: SwiperOptions = {
    spaceBetween: isMobile ? 0 : 24,
    preventInteractionOnTransition: true,
    cssMode: !isMobile,

    ...(isMobile && {
      slideToClickedSlide: true,
      loop: isMobile,
      loopedSlides: NUMBER_OF_REVIEWS_TO_FETCH,
      slidesPerView: 'auto',
      autoplay: {
        disableOnInteraction: false,
        delay: 8000,
      },
      centeredSlides: true,
    }),
  };

  const reviewSectionViewedTrackingObject = {
    eventName: ANALYTICS_EVENTS.PAGE_SECTION_VIEWED,
    [ANALYTICS_PROPERTIES.SECTION]: 'Reviews',
  };

  return (
    <LandingPageWrapper>
      <BrowseByCategoriesSection
        categoriesToRender={categoriesToRender}
        isMobile={isMobile}
        showGridUI={false}
        isLandingPage
        ref={browseByCategoriesRef}
      />
      <TopLttShowsSection
        isMobile={isMobile}
        topShows={topShows}
        heading={strings.LTT_LANDING_PAGE.TOP_WEST_END_SHOWS}
        directTgid={directTgid}
        showBrowseByCategories={false}
      />
      <SpecialSections
        allTours={allTours}
        isMobile={isMobile}
        title={strings.LTT_LANDING_PAGE.LAST_MINUTE_TICKETS}
        actions={lastMinuteActions}
        updateActions={setLastMinuteActions}
        totalNumberOfShows={50}
        maxNumberOfShows={20}
        seeAllCardText="show tickets available"
        preselectedActionName={lastMinuteActions?.[0]?.actionName}
        hideSeeAll={true}
        useForcedSekeltonLoaders
        id="Last minute"
      />
      <CategoryCarouselsSection
        categoriesToRender={categoriesToRender.slice(
          0,
          NUMBER_OF_CATEGORIES_BEFORE_REVIEWS
        )}
        allTours={allTours}
        isMobile={isMobile}
      />
      <Conditional if={!collectionReviewsError}>
        <ReviewSectionWrapper id="review-section-wrapper">
          <Reviews
            heading={strings.LTT_LANDING_PAGE.LOVED_BY_MILLIONS}
            reviews={{ reviewsData: collectionReviews, mediaData }}
            isMobile={isMobile}
            mediaData={[]}
            overrideSwiperProps={swiperParams}
            trackingObject={reviewSectionViewedTrackingObject}
          />
        </ReviewSectionWrapper>
      </Conditional>
      <CategoryCarouselsSection
        categoriesToRender={categoriesToRender.slice(
          NUMBER_OF_CATEGORIES_BEFORE_REVIEWS
        )}
        allTours={allTours}
        isMobile={isMobile}
      />
    </LandingPageWrapper>
  );
};

export default LttLandingPageV2;
