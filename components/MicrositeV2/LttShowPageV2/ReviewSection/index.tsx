import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import { TReviewSectionProps } from 'components/MicrositeV2/LttShowPageV2/ReviewSection/interface';
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
  ReviewsSection,
  ShowMoreReviewsButton,
  StarCount,
  ViewTranslatedContentButton,
} from 'components/MicrositeV2/LttShowPageV2/ReviewSection/style';
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
  isMobile,
}: TReviewSectionProps) => {
  const [reviews, setReviews] = useState<TReviewMediasResponse['items']>([]);
  const [numberOfReviewsToShow, setNumberOfReviewsToShow] = useState(5);
  const { averageRating, ratingsCount, ratingsSplit } = reviewsDetails;
  const getShortenedNumber = (num: number) =>
    num > 999 ? `${(num / 1000).toFixed(1)}k` : num;
  const shortenedRatingsCount = getShortenedNumber(ratingsCount);
  const { lang } = useContext(MBContext);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsResponse = await fetchTourGroupReviews({
          tgid,
          offset: 5,
          limit: 10,
          filterType: 'TOP',
          language: lang,
        });
        const { items: reviews = [] } = reviewsResponse ?? {};
        setReviews(reviews);
      } catch (error) {
        return;
      }
    };
    fetchReviews();
  }, []);

  return (
    <ReviewSectionWrapper>
      <RatingsDetailsSection>
        <RatingsCountSection>
          <Ratings>
            {averageRating} <StarFullNew fillColor={COLORS.BRAND.CANDY} />
          </Ratings>
          <RatingsCount>
            {strings.formatString(strings.RATINGS, shortenedRatingsCount)}
          </RatingsCount>
        </RatingsCountSection>
        <RatingsSplit>
          {Array.from({ length: 5 }, (_, i) => 5 - i).map((rating) => (
            <StarCount key={rating}>
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
          <ReviewElement review={review} isMobile={isMobile} key={index} />
        ))}
      </ReviewsSection>
      <Conditional
        if={isMobile && numberOfReviewsToShow < 10 && reviews.length > 0}
      >
        <ShowMoreReviewsButton
          onClick={() => setNumberOfReviewsToShow(numberOfReviewsToShow + 5)}
        >
          {strings.LTT_SHOW_PAGE.SHOW_MORE_REVIEWS}
        </ShowMoreReviewsButton>
      </Conditional>

      <Conditional
        if={reviewPageUrl && (!isMobile || numberOfReviewsToShow >= 10)}
      >
        <AllReviewsButton
          href={reviewPageUrl}
          onClick={() => {
            trackEvent({
              eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
              [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.READ_DETAILED_REVIEWS,
              [ANALYTICS_PROPERTIES.SECTION]: 'Reviews',
            });
          }}
        >
          {strings.LTT_SHOW_PAGE.READ_DETAILED_REVIEWS}
        </AllReviewsButton>
      </Conditional>
    </ReviewSectionWrapper>
  );
};

const ReviewElement = ({
  review,
  isMobile,
}: {
  review: TReviewMediasResponse['items'][0];
  isMobile: boolean;
}) => {
  const [usingTranslatedContent, setUsingTranslatedContent] = useState(true);
  const { lang } = useContext(MBContext);

  const swiperParams: SwiperProps = {
    spaceBetween: isMobile ? 16 : 24,
    slidesPerView: isMobile ? 3 : 3.6,
    freeMode: true,
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
