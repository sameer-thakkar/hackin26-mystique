import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import { EReviewRatingFilter, EReviewSortType } from 'types/reviews';
import Conditional from 'components/common/Conditional';
import type { TReviewSectionProps } from 'components/MicrositeV2/ShowPageV2/ReviewSection/interface';
import {
  AllReviewsButton,
  RatingBarAmount,
  RatingBarBase,
  Ratings,
  RatingsCount,
  RatingsCountSection,
  RatingsDetailsSection,
  RatingsSplit,
  Review,
  ReviewContent,
  ReviewMediaSection,
  ReviewSectionWrapper,
  ReviewSkeletonContainer,
  ReviewSkeletonMediaContainer,
  ReviewsSection,
  ReviewUserDetailsContainer,
  ReviewUserDetailsTextContentContainer,
  ShowMoreReviewsButton,
  SnapshotSectionContainer,
  StarCount,
  StyledReviewSectionHeading,
  ViewTranslatedContentButton,
} from 'components/MicrositeV2/ShowPageV2/ReviewSection/style';
import SnapshotSection from 'components/Product/components/Popup/ReviewSection/Snapshots';
import EmptyState from 'components/Reviews/EmptyState';
import ReviewFilterAndSorter from 'components/Reviews/Filters';
import ReviewHeader from 'components/Reviews/Header';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { getHeadoutLanguagecode } from 'utils';
import { trackEvent } from 'utils/analytics';
import { fetchTourGroupReviewsV6, TReviewMediasResponse } from 'utils/apiUtils';
import { getStars } from 'utils/productUtils';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  DEFAULT_TOP_REVIEWS_COUNT,
  LANGUAGE_SORT_ORDER,
} from 'const/index';
import { strings } from 'const/strings';
import StarFullNew from 'assets/starFullNew';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const AggregatedCountries = dynamic(
  () =>
    import(
      /* webpackChunkName: "AggregatedCountries" */ 'components/Reviews/AggregatedCountries'
    )
);

export const getTranslateButtonText = (
  usingTranslatedContent: boolean,
  sourceLanguage: string,
  lang: string
) => {
  if (!LANGUAGE_SORT_ORDER.includes(lang)) return;
  const isSupportedLanguage =
    sourceLanguage &&
    LANGUAGE_SORT_ORDER.includes(sourceLanguage.toLowerCase());
  if (!usingTranslatedContent)
    return strings.formatString(
      strings.REVIEW_LOC.TRANSLATE,
      (strings.REVIEW_LOC.LANGUAGES as Record<string, string>)[
        lang.toUpperCase()
      ]
    );

  if (isSupportedLanguage)
    return strings.formatString(
      strings.REVIEW_LOC.VIEW_ORIGINAL,
      (strings.REVIEW_LOC.LANGUAGES as Record<string, string>)[
        sourceLanguage.toUpperCase()
      ]
    );

  return strings.REVIEW_LOC.VIEW_ORIGINAL_NO_LANG;
};

const ReviewSection = ({
  tgid,
  reviewsDetails,
  reviewPageUrl,
  isMobile = false,
  initialReviews = [],
  maximumNumberOfReviews = 10,
  numberOfReviewsToFetchAtOnce = 10,
  showFetchMoreButton = false,
  controlledSwiperParams,
  showSkeleton = false,
  externalButtonContent,
  showReviews = true,
  onImageClick,
  snapshotSectionProps,
  numberOfReviewsToShow: numberOfReviewsToShowProp = 5,
  showCountriesSection = false,
}: TReviewSectionProps) => {
  const [reviews, setReviews] = useState<TReviewMediasResponse['items']>(
    initialReviews || []
  );
  const [numberOfReviewsToShow, setNumberOfReviewsToShow] = useState(
    numberOfReviewsToShowProp
  );
  const [reviewRatingFilter, setReviewRatingFilter] =
    useState<EReviewRatingFilter | null>(null);
  const [reviewSortType, setReviewSortType] = useState<EReviewSortType>(
    EReviewSortType.MOST_RELEVANT
  );
  const [hasMediaFilter, setHasMediaFilter] = useState<boolean>(false);
  const { averageRating, ratingsCount, ratingsSplit, reviewCountries } =
    reviewsDetails;

  const shortenedAverageRating = averageRating.toFixed(1);
  const getShortenedNumber = (num: number) =>
    num > 999 ? `${(num / 1000).toFixed(1)}K` : num;
  const shortenedRatingsCount = getShortenedNumber(ratingsCount);
  const { lang } = useContext(MBContext);
  const [offset, setOffset] = useState<number | null>(
    !initialReviews ? 0 : Math.max(5, initialReviews?.length || 0)
  );
  const [isFetching, setIsFetching] = useState(!initialReviews?.length);
  const [moreReviewsClickCount, setMoreReviewsClickCount] = useState(1);
  const SCROLL_THRESHOLD = isMobile ? 115 : 150;

  const fetchReviews = useCallback(async () => {
    try {
      if (offset === null || offset >= maximumNumberOfReviews) return;
      setIsFetching(true);
      const reviewsResponse = await fetchTourGroupReviewsV6({
        tgid,
        offset,
        limit: numberOfReviewsToFetchAtOnce,
        ratingFilter: reviewRatingFilter,
        hasMediaFilter,
        sortType: reviewSortType,
        language: getHeadoutLanguagecode(lang),
      });

      setIsFetching(false);

      const {
        result: { reviews: receivedReviews },
      } = reviewsResponse ?? {};

      const { items: newReviews = [], nextOffset = null } = receivedReviews;

      const updatedReviews =
        offset === 0 ? newReviews : [...reviews, ...newReviews];

      const firstNewReviewRef = document.querySelector(
        `#review-item-${updatedReviews?.length}`
      );

      if (firstNewReviewRef) {
        const popupContainer = document.querySelector(
          "[id*='product-card-popup'], #snapsheet-content-container"
        );
        const firstNewReviewPosition =
          firstNewReviewRef.getBoundingClientRect().top - SCROLL_THRESHOLD;

        popupContainer?.scrollBy({
          top: firstNewReviewPosition,
          behavior: 'smooth',
        });
      }

      setReviews(updatedReviews);
      setOffset(nextOffset);
    } catch (error) {
      return;
    }
  }, [offset, reviews, hasMediaFilter, reviewRatingFilter, reviewSortType]);

  useEffect(() => {
    fetchReviews();
  }, [hasMediaFilter, reviewRatingFilter, reviewSortType]);

  const {
    exposeSorting = false,
    exposeFiltering = false,
    exposeLoadMore = false,
  } = reviewsDetails?.displayConfig ?? {};

  const showLoadMoreButton =
    (isMobile || showFetchMoreButton) &&
    numberOfReviewsToShow < maximumNumberOfReviews &&
    reviews.length >= DEFAULT_TOP_REVIEWS_COUNT &&
    exposeLoadMore;

  return (
    <ReviewSectionWrapper>
      <RatingsDetailsSection
        $showingReviewsSection={showReviews && !snapshotSectionProps}
      >
        <RatingsCountSection>
          <Ratings>
            <StarFullNew fillColor={COLORS.BRAND.CANDY} />{' '}
            {shortenedAverageRating}
          </Ratings>
          <RatingsCount>
            {strings.formatString(strings.RATINGS, shortenedRatingsCount)}
          </RatingsCount>
        </RatingsCountSection>
        <RatingsSplit>
          {Array.from({ length: 5 }, (_, i) => 5 - i).map((rating, index) => (
            <StarCount key={index}>
              {getStars(rating)}
              <RatingBarBase>
                <RatingBarAmount
                  $width={(ratingsSplit[rating] / ratingsCount) * 100}
                />
              </RatingBarBase>
              <span>{getShortenedNumber(ratingsSplit[rating])}</span>
            </StarCount>
          ))}
        </RatingsSplit>
      </RatingsDetailsSection>

      <Conditional
        if={showCountriesSection && reviewCountries?.countries?.length}
      >
        <AggregatedCountries
          isMobile={isMobile}
          reviewCountries={reviewCountries}
        />
      </Conditional>
      <Conditional if={snapshotSectionProps}>
        <SnapshotSectionContainer>
          <SnapshotSection {...snapshotSectionProps!} />
        </SnapshotSectionContainer>
      </Conditional>

      <Conditional if={showReviews}>
        <Conditional if={snapshotSectionProps}>
          <StyledReviewSectionHeading>
            {strings.REVIEW_SECTION_HEADER}
          </StyledReviewSectionHeading>
        </Conditional>

        <Conditional if={exposeFiltering || exposeSorting}>
          <ReviewFilterAndSorter
            isDesktop={!isMobile}
            currentRatingFilter={reviewRatingFilter}
            showOnlyReviewsWithMedia={hasMediaFilter}
            currentSortType={reviewSortType}
            onSortTypeChange={(sortType) => {
              setOffset(0);
              setNumberOfReviewsToShow(numberOfReviewsToShowProp);
              setReviewSortType(sortType);
            }}
            onFilterChange={({ rating, withImages }) => {
              setOffset(0);
              setNumberOfReviewsToShow(numberOfReviewsToShowProp);
              setReviewRatingFilter(rating);
              setHasMediaFilter(withImages);
            }}
            productDetails={{
              tgid,
              reviewsDetails,
              isDesktop: !isMobile,
              numberOfReviews: reviews?.length ?? 0,
            }}
          />
        </Conditional>

        <Conditional if={reviews.length === 0 && !isFetching}>
          <EmptyState
            onClick={() => {
              // move to default state
              setOffset(0);
              setReviewRatingFilter(null);
              setHasMediaFilter(false);
              setReviewSortType(EReviewSortType.MOST_RELEVANT);
            }}
          />
        </Conditional>

        <ReviewsSection>
          {reviews.slice(0, numberOfReviewsToShow).map((review, index) => (
            <ReviewElement
              review={review}
              isMobile={isMobile}
              key={index}
              controlledSwiperParams={controlledSwiperParams}
              onClick={onImageClick}
              index={index}
            />
          ))}
          <Conditional if={showSkeleton && isFetching}>
            {Array.from({ length: 5 }, (_, i) => 5 - i).map((idx: number) => (
              <ReviewSkeleton key={idx} isMobile={isMobile} />
            ))}
          </Conditional>
        </ReviewsSection>
        <Conditional if={showLoadMoreButton}>
          <ShowMoreReviewsButton
            onClick={() => {
              setNumberOfReviewsToShow(numberOfReviewsToShow + 5);
              fetchReviews();
              trackEvent({
                eventName: ANALYTICS_EVENTS.MORE_REVIEWS_CLICKED,
                [ANALYTICS_PROPERTIES.CLICK_COUNT]: moreReviewsClickCount,
              });
              setMoreReviewsClickCount(moreReviewsClickCount + 1);
            }}
          >
            {strings.SHOW_PAGE_V2.SHOW_MORE_REVIEWS}
          </ShowMoreReviewsButton>
        </Conditional>

        <Conditional
          if={reviewPageUrl && !showLoadMoreButton && reviews.length > 0}
        >
          <AllReviewsButton
            href={reviewPageUrl}
            target="_blank"
            onClick={() => {
              trackEvent({
                eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
                [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.READ_DETAILED_REVIEWS,
                [ANALYTICS_PROPERTIES.SECTION]: 'Reviews',
              });
            }}
          >
            {externalButtonContent ??
              strings.SHOW_PAGE_V2.READ_DETAILED_REVIEWS}
          </AllReviewsButton>
        </Conditional>
      </Conditional>
    </ReviewSectionWrapper>
  );
};

const ReviewSkeleton = ({ isMobile = false }: { isMobile?: boolean }) => {
  const showMedia = useMemo(() => Math.round(Math.random()), []);

  return (
    <ReviewSkeletonContainer>
      <ReviewUserDetailsContainer>
        <Skeleton height={'2.5rem'} width={'2.5rem'} circle />
        <ReviewUserDetailsTextContentContainer>
          <Skeleton height={'1.2rem'} width={'4rem'} />
          <Skeleton height={'0.8rem'} width={'2.5rem'} />
        </ReviewUserDetailsTextContentContainer>
      </ReviewUserDetailsContainer>
      <Skeleton height={'2rem'} width={isMobile ? '348px' : '744px'} />
      <Conditional if={showMedia}>
        <ReviewSkeletonMediaContainer>
          <Skeleton height={'140px'} width={'105px'} />
          <Skeleton height={'140px'} width={'105px'} />
        </ReviewSkeletonMediaContainer>
      </Conditional>
    </ReviewSkeletonContainer>
  );
};

const ReviewElement = ({
  review,
  isMobile,
  controlledSwiperParams = {},
  onClick,
  index,
}: {
  review: TReviewMediasResponse['items'][0];
  isMobile: boolean;
  controlledSwiperParams?: SwiperProps;
  onClick?: (reviewId: string | number, localIndex: number) => void;
  index: number;
}) => {
  const [usingTranslatedContent, setUsingTranslatedContent] = useState(true);
  const { lang } = useContext(MBContext);

  const swiperParams: SwiperProps = {
    spaceBetween: isMobile ? 16 : 24,
    slidesPerView: isMobile ? 3 : 3.6,
    freeMode: true,
    ...controlledSwiperParams,
  };

  const {
    nonCustomerName,
    rating,
    reviewTime,
    content,
    translatedContent,
    reviewMedias,
    reviewerImgUrl,
    sourceLanguage,
    id,
  } = review;

  return (
    <Review id={`review-item-${index}`}>
      <ReviewHeader
        nonCustomerName={nonCustomerName}
        reviewerImgUrl={reviewerImgUrl}
        reviewTime={reviewTime}
        rating={rating}
      />
      <ReviewContent>
        {usingTranslatedContent && translatedContent
          ? translatedContent
          : content}
      </ReviewContent>
      <Conditional
        if={
          sourceLanguage?.toLowerCase() !== lang?.toLowerCase() &&
          translatedContent
        }
      >
        <ViewTranslatedContentButton
          onClick={() => setUsingTranslatedContent(!usingTranslatedContent)}
        >
          {getTranslateButtonText(usingTranslatedContent, sourceLanguage, lang)}
        </ViewTranslatedContentButton>
      </Conditional>
      <Conditional if={reviewMedias.length}>
        <ReviewMediaSection>
          <Swiper {...swiperParams}>
            {reviewMedias.map(({ url }, index: number) => (
              <Image
                url={url}
                alt={`review media ${index}`}
                key={index}
                fill={true}
                minFit={true}
                width={180}
                height={240}
                loadHigherQualityImage={true}
                onClick={() => onClick?.(id, index)}
              />
            ))}
          </Swiper>
        </ReviewMediaSection>
      </Conditional>
    </Review>
  );
};
export default ReviewSection;
