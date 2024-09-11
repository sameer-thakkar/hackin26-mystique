import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { asLink } from '@prismicio/helpers';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type Swiper from 'swiper';
import { StyledHeaderSection } from 'components/AirportTransfers/AirportTransferFeatures/styles';
import { StyledReviewsContainer } from 'components/AirportTransfers/Review/styles';
import { trackPageSection } from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import { SECTION_NAMES } from 'components/HOHO/constants';
import HorizontalLine from 'components/slices/HorizontalLine';
import { ReviewsProps } from 'components/slices/Reviews/interface';
import {
  RatingTime,
  RatingWrapper,
  Review,
  ReviewContent,
  Reviewer,
  ReviewerCountry,
  ReviewerImage,
  ReviewerName,
  ReviewerSubtext,
  ReviewFooter,
  ReviewText,
  ReviewTop,
  StyledReviews,
  Title,
} from 'components/slices/Reviews/styles';
import Image from 'UI/Image';
import Rating from 'UI/Rating';
import useOnScreen from 'hooks/useOnScreen';
import { genUniqueId } from 'utils';
import { generateSidenavId, truncate } from 'utils/helper';
import COLORS from 'const/colors';
import { FLAGS_FOLDER_URL } from 'const/index';
import { ArrowCircleRight } from 'assets/airportTransfers';
import ChevronLeftCircle from 'assets/chevronLeftCircle';

const Slider = dynamic(() => import('UI/Slider'));
const SwiperWrapper = dynamic(() => import('components/Swiper'));
const SWIPER_BREAKPOINTS = {
  0: {
    slidesPerView: 1.15,
    spaceBetween: 12,
  },
  768: {
    slidesPerView: 2,
    spaceBetween: 16,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 18,
  },
  1440: {
    slidesPerView: 3,
    spaceBetween: 24,
  },
};

const swiperAutoPlayConfig = {
  delay: 2000,
  disableOnInteraction: false,
};
dayjs.extend(relativeTime);

/**
 * A slice for displaying reviews/testimonials.
 *
 * Video Tutorial:
 *
 * <div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/aa05669787c245f1b970a020fadc3e78" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>
 *
 * **All fields marked with a * are mandatory and will break the slice if left blank.**
 *
 * ### Non-repeatable zone
 * - Title
 * - Type
 *  - Can be regular or a testimonial. Regular will display the rating and testimonial will not.
 *
 * ### Repeatable zone
 * - Reviewer Image
 *  - If left blank an image will by fetched from the S3 bucket.
 * - Review Text
 *  - The reviews text
 * - Reviewer Name *
 * - Reviewer Subtext
 *  - The text that appears below the reviewer.
 * - Rating
 *  - Rating given. If blank, defaults to 4.5. If 5 < rating < 0 then defaults to 4.5.
 * - Rating Date
 *
 */

const Reviews: React.FC<ReviewsProps> = ({
  type = 'regular',
  title = '',
  reviews,
  isMobile,
  showNewDesign = false,
}) => {
  const reviewSlides = reviews
    ?.filter((review) => !!review.review_text?.length)
    ?.map((review, index) => {
      const n = (index % 202) + 1;
      const {
        review_text: reviewText,
        reviewer_name: reviewerName,
        reviewer_subtext: reviewerSubtext,
        reviewer_country_code: reviewerCountry,
        footer_text: footerText,
        reviewer_image_url,
        reviewer_image,
        reviewer_image_alt,
        rating,
        rating_date,
      } = review || {};

      return {
        reviewText,
        reviewerName,
        reviewerSubtext,
        reviewerCountry,
        footerText,
        imageUrl:
          asLink(reviewer_image_url) ||
          reviewer_image?.url ||
          `https://cdn-s3-open.headout.com/reviews/${n}.jpg`,
        imageAlt:
          reviewer_image_alt || review.reviewer_image?.alt || 'reviewer-image',
        rating: rating ? (rating > 5 || 0 > rating ? 4.5 : rating) : 4.5,
        ratingDate: rating_date ? dayjs(rating_date).fromNow() : '',
      };
    });

  const containerRef = useRef(null);
  const isIntersecting = useOnScreen({ ref: containerRef, unobserve: true });
  const [swiper, setSwiper] = useState<Swiper | null>(null);
  const [isSwiperEnd, setIsSwiperEnd] = useState(false);
  const [isSwiperStart, setIsSwiperStart] = useState(true);
  const handleSlideChange = () => {
    if (!swiper) {
      return;
    }

    setIsSwiperEnd(swiper?.isEnd ?? false);
    setIsSwiperStart(swiper?.isBeginning ?? false);
  };

  useEffect(() => {
    if (isIntersecting) {
      trackPageSection({ section: SECTION_NAMES.REVIEWS });
    }
  }, [isIntersecting]);

  const getReviewSlides = () => {
    return reviewSlides?.map(
      ({
        reviewText = '',
        reviewerName,
        reviewerSubtext,
        reviewerCountry,
        footerText,
        imageUrl,
        imageAlt,
        rating,
        ratingDate,
      }) => (
        <Review key={genUniqueId()} showNewDesign={showNewDesign}>
          <ReviewContent>
            <ReviewTop>
              <Reviewer $hasSubtext={reviewerSubtext}>
                <ReviewerImage>
                  <Image url={imageUrl} alt={imageAlt} height={48} width={48} />
                </ReviewerImage>
                <ReviewerName>{reviewerName}</ReviewerName>
                <ReviewerSubtext>
                  <Conditional if={reviewerCountry && reviewerSubtext}>
                    <ReviewerCountry>
                      <Image
                        url={`${FLAGS_FOLDER_URL}${reviewerCountry}.svg`}
                        alt={reviewerCountry || ''}
                        height={16}
                        width={16}
                      />
                    </ReviewerCountry>
                  </Conditional>
                  {reviewerSubtext}
                </ReviewerSubtext>
              </Reviewer>
              <RatingWrapper>
                <Rating fillColor={COLORS.TEXT.CANDY_1} value={rating} />
                <RatingTime>{ratingDate}</RatingTime>
              </RatingWrapper>
            </ReviewTop>
            <ReviewText>{truncate(reviewText || '', 300)}</ReviewText>
          </ReviewContent>
          <Conditional if={footerText}>
            <ReviewFooter>
              <HorizontalLine colorProp={COLORS.GRAY.G5} />
              {footerText}
            </ReviewFooter>
          </Conditional>
        </Review>
      )
    );
  };

  return showNewDesign ? (
    <StyledReviewsContainer noMargin={true} ref={containerRef}>
      <StyledHeaderSection>
        <Title id={generateSidenavId(title)} showNewDesign={showNewDesign}>
          {title}
        </Title>
        <div className="carousel-controls">
          <ArrowCircleRight
            onClick={() => swiper?.slidePrev()}
            className={isSwiperStart ? 'disabled' : ''}
          />

          <ArrowCircleRight
            onClick={() => swiper?.slideNext()}
            className={isSwiperEnd ? 'disabled' : ''}
          />
        </div>
      </StyledHeaderSection>

      <SwiperWrapper
        onSwiper={setSwiper}
        onSlideChange={handleSlideChange}
        breakpoints={SWIPER_BREAKPOINTS}
        loop={isMobile}
        autoplay={isMobile ? swiperAutoPlayConfig : false}
        centeredSlides={isMobile}
      >
        {getReviewSlides()}
      </SwiperWrapper>
    </StyledReviewsContainer>
  ) : (
    <StyledReviews reviewType={type} ref={containerRef}>
      <Title id={generateSidenavId(title)}>{title}</Title>
      <Slider
        sliderOptions={{
          slidesPerView: isMobile ? 1 : 3,
          freeMode: isMobile,
        }}
        nextButton={!isMobile ? ChevronLeftCircle : undefined}
        prevButton={!isMobile ? ChevronLeftCircle : undefined}
      >
        {getReviewSlides()}
      </Slider>
    </StyledReviews>
  );
};

export default Reviews;
