import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Skeleton from 'react-loading-skeleton';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
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
  ReviewHeader,
  ReviewMediaSection,
  ReviewSectionWrapper,
  ReviewSkeletonContainer,
  ReviewSkeletonMediaContainer,
  ReviewsSection,
  ReviewUserDetailsContainer,
  ReviewUserDetailsTextContentContainer,
  ShowMoreReviewsButton,
  StarCount,
  ViewTranslatedContentButton,
} from 'components/MicrositeV2/ShowPageV2/ReviewSection/style';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { fetchTourGroupReviews, TReviewMediasResponse } from 'utils/apiUtils';
import { formatDateToString } from 'utils/dateUtils';
import { getStars } from 'utils/productUtils';
import { getRandomReviewerImage } from 'utils/reviewUtils';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  LANGUAGE_SORT_ORDER,
} from 'const/index';
import { strings } from 'const/strings';
import StarFullNew from 'assets/starFullNew';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
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
}: TReviewSectionProps) => {
  const [reviews, setReviews] =
    useState<TReviewMediasResponse['items']>(initialReviews);
  const [numberOfReviewsToShow, setNumberOfReviewsToShow] = useState(5);
  const { averageRating, ratingsCount, ratingsSplit } = reviewsDetails;
  const getShortenedNumber = (num: number) =>
    num > 999 ? `${(num / 1000).toFixed(1)}k` : num;
  const shortenedRatingsCount = getShortenedNumber(ratingsCount);
  const { lang } = useContext(MBContext);
  const [offset, setOffset] = useState<number | null>(
    Math.max(5, initialReviews.length)
  );
  const [totalNumberOfReviews, setTotalNumberOfReviews] = useState(-1);
  const [isFetching, setIsFetching] = useState(!initialReviews.length);
  const [moreReviewsClickCount, setMoreReviewsClickCount] = useState(1);

  const fetchReviews = useCallback(async () => {
    try {
      if (!offset || offset >= maximumNumberOfReviews) return;
      setIsFetching(true);
      const reviewsResponse = await fetchTourGroupReviews({
        tgid,
        offset,
        limit: numberOfReviewsToFetchAtOnce,
        filterType: 'TOP',
        language: lang,
      });
      const {
        items: newReviews = [],
        nextOffset = null,
        total,
      } = reviewsResponse ?? {};
      setReviews([...reviews, ...newReviews]);
      setOffset(nextOffset);
      setIsFetching(false);
      if (totalNumberOfReviews === -1 && total) setTotalNumberOfReviews(total);
    } catch (error) {
      return;
    }
  }, [offset, reviews]);

  useEffect(() => {
    if (!initialReviews.length) fetchReviews();
  }, []);

  return (
    <ReviewSectionWrapper>
      <RatingsDetailsSection>
        <RatingsCountSection>
          <Ratings>
            <StarFullNew fillColor={COLORS.BRAND.CANDY} /> {averageRating}
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
      <ReviewsSection>
        {reviews.slice(0, numberOfReviewsToShow).map((review, index) => (
          <ReviewElement
            review={review}
            isMobile={isMobile}
            key={index}
            controlledSwiperParams={controlledSwiperParams}
          />
        ))}
        <Conditional if={showSkeleton && isFetching}>
          {Array.from({ length: 5 }, (_, i) => 5 - i).map((idx: number) => (
            <ReviewSkeleton key={idx} isMobile={isMobile} />
          ))}
        </Conditional>
      </ReviewsSection>
      <Conditional
        if={
          (isMobile || showFetchMoreButton) &&
          numberOfReviewsToShow <
            (totalNumberOfReviews === -1
              ? maximumNumberOfReviews
              : Math.min(totalNumberOfReviews, maximumNumberOfReviews)) &&
          reviews.length > 0
        }
      >
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
        if={
          reviewPageUrl &&
          (!(isMobile || showFetchMoreButton) ||
            numberOfReviewsToShow >=
              (totalNumberOfReviews === -1
                ? maximumNumberOfReviews
                : Math.min(totalNumberOfReviews, maximumNumberOfReviews)))
        }
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
          {externalButtonContent ?? strings.SHOW_PAGE_V2.READ_DETAILED_REVIEWS}
        </AllReviewsButton>
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
}: {
  review: TReviewMediasResponse['items'][0];
  isMobile: boolean;
  controlledSwiperParams?: SwiperProps;
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
  } = review;
  const datePublished = formatDateToString(
    new Date(reviewTime),
    lang,
    'MMM, YYYY'
  );
  const customerFirstName = nonCustomerName?.split(' ')?.[0];
  return (
    <Review>
      <ReviewHeader>
        <div className="review-header">
          <div className="pfp">
            <Image
              url={
                reviewerImgUrl ?? getRandomReviewerImage(nonCustomerName ?? '')
              }
              alt="reviewer"
            />
          </div>
          <div className="user-details">
            <div className="details">
              <span className="name">
                {customerFirstName ?? nonCustomerName}
              </span>
              <span className="date">{datePublished}</span>
            </div>
            <div className="rating">
              {getStars(rating)}
              <span className="rating-count">{rating}/5</span>
            </div>
          </div>
        </div>
      </ReviewHeader>
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
              />
            ))}
          </Swiper>
        </ReviewMediaSection>
      </Conditional>
    </Review>
  );
};
export default ReviewSection;
