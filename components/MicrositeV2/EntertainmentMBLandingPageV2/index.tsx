import { useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { SwiperOptions } from 'swiper';
import useSWR from 'swr';
import type { TReview } from 'types/reviews';
import Conditional from 'components/common/Conditional';
import LazyComponent from 'components/common/LazyComponent';
import Reviews from 'components/common/Reviews';
import BrowseByCategoriesSection from 'components/MicrositeV2/EntertainmentMBLandingPageV2/BrowseByCategoriesSection';
import CategoryCarouselsSection from 'components/MicrositeV2/EntertainmentMBLandingPageV2/CategoryCarouselsSection';
import { TLandingPageV2Props } from 'components/MicrositeV2/EntertainmentMBLandingPageV2/interface';
import SpecialSections from 'components/MicrositeV2/EntertainmentMBLandingPageV2/SpecialSections';
import {
  LandingPageWrapper,
  ReviewSectionLazyWrapper,
  ReviewSectionWrapper,
  SpecialSectionsLazyWrapper,
} from 'components/MicrositeV2/EntertainmentMBLandingPageV2/style';
import TopShowsSection from 'components/MicrositeV2/EntertainmentMBLandingPageV2/TopShowsSection';
import { TMediaData } from 'components/NewsPage/ArticlePage/interface';
import { MBContext } from 'contexts/MBContext';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { addDays, formatDateToString } from 'utils/dateUtils';
import { sendLog } from 'utils/logger';
import { currencyAtom } from 'store/atoms/currency';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  COLLECTION_ID_THEATRE_NAMES_MAP,
  RESOURCE_ASSET_TYPE,
} from 'const/index';
import { strings } from 'const/strings';

const NUMBER_OF_CATEGORIES_BEFORE_REVIEWS = 3;
const NUMBER_OF_REVIEWS_TO_FETCH = 9;

const EntertainmentMBLandingPageV2 = ({
  isMobile,
  categoryProps,
  allTours,
  browseByCategoriesRef,
  directTgid,
  collectionId,
}: TLandingPageV2Props) => {
  const { lang } = useContext(MBContext);

  const { categories } = categoryProps;
  const categoriesToRender: Array<Record<string, any>> =
    categories?.filter(
      (category: Record<string, any>) =>
        category.id !== collectionId && category.ranking?.popularity?.length
    ) ?? [];

  const topShowsTgids = categoryProps.categories.find(
    (category: any) => category.id === collectionId
  )?.ranking?.popularity;

  if (directTgid) {
    topShowsTgids.unshift(directTgid);
  }
  const duplicateTgids: Record<number, boolean> = {};

  const topShows: Array<Record<string, any>> = [];
  topShowsTgids?.forEach((tgid: number) => {
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
    id: collectionId,
  });

  let { data: collectionReviews, error: collectionReviewsError } = useSWR<{
    result: {
      reviews: {
        items: TReview[];
      };
    };
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
          actionName: strings.ENTERTAINMENT_MB_LANDING_PAGE.TODAY,
          onClick: () =>
            topShows.filter(
              (show: any) => inventoryData[show.tgid]?.dates[DATE_TODAY]
            ),
        },
        {
          actionName: strings.ENTERTAINMENT_MB_LANDING_PAGE.TOMORROW,
          onClick: () =>
            topShows.filter(
              (show: any) => inventoryData[show.tgid]?.dates[DATE_TOMORROW]
            ),
        },
      ]);
    }
  }, [data]);

  useEffect(() => {
    if (!collectionReviews?.result?.reviews?.items?.length) return;

    const { items: reviewItems } = collectionReviews.result.reviews ?? {};

    const resourceEntityMedias = reviewItems.map(
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
        message: `[CollectionReviewsApi] - collection reviews api failed for collection id ${collectionId}`,
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

  const theatreName = COLLECTION_ID_THEATRE_NAMES_MAP[collectionId];

  return (
    <LandingPageWrapper>
      <BrowseByCategoriesSection
        categoriesToRender={categoriesToRender}
        isMobile={isMobile}
        showGridUI={false}
        isLandingPage
        ref={browseByCategoriesRef}
      />
      <TopShowsSection
        isMobile={isMobile}
        topShows={topShows}
        heading={
          strings.formatString(
            strings.ENTERTAINMENT_MB_LANDING_PAGE.TOP_THEATRE_SHOWS,
            theatreName
          ) as string
        }
        directTgid={directTgid}
        showBrowseByCategories={false}
      />

      <SpecialSectionsLazyWrapper id="Last minute">
        <LazyComponent>
          <SpecialSections
            allTours={allTours}
            isMobile={isMobile}
            title={strings.ENTERTAINMENT_MB_LANDING_PAGE.LAST_MINUTE_TICKETS}
            actions={lastMinuteActions}
            updateActions={setLastMinuteActions}
            totalNumberOfShows={50}
            maxNumberOfShows={20}
            seeAllCardText="show tickets available"
            preselectedActionName={lastMinuteActions?.[0]?.actionName}
            hideSeeAll={true}
            useForcedSekeltonLoaders
          />
        </LazyComponent>
      </SpecialSectionsLazyWrapper>

      <CategoryCarouselsSection
        categoriesToRender={categoriesToRender.slice(
          0,
          NUMBER_OF_CATEGORIES_BEFORE_REVIEWS
        )}
        allTours={allTours}
        isMobile={isMobile}
      />

      <Conditional if={!collectionReviewsError && collectionReviews}>
        <ReviewSectionLazyWrapper>
          <LazyComponent
            options={{
              rootMargin: '-50px',
              threshold: 0.01,
            }}
          >
            <ReviewSectionWrapper id="review-section-wrapper">
              <Reviews
                heading={
                  strings.ENTERTAINMENT_MB_LANDING_PAGE.LOVED_BY_MILLIONS
                }
                reviews={{ reviewsData: collectionReviews!, mediaData }}
                isMobile={isMobile}
                mediaData={[]}
                overrideSwiperProps={swiperParams}
                trackingObject={reviewSectionViewedTrackingObject}
              />
            </ReviewSectionWrapper>
          </LazyComponent>
        </ReviewSectionLazyWrapper>
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

export default EntertainmentMBLandingPageV2;
