import { useState } from 'react';
import dynamic from 'next/dynamic';
import SwiperType from 'swiper';
import { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import {
  Review,
  ReviewSectionWrapper,
} from 'components/MicrositeV2/LttLandingPageV2/ReviewSection/style';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  LTT_LP_HARDCODED_REVIEWS,
} from 'const/index';
import { strings } from 'const/strings';
import LttChevronLeft from 'assets/lttChevronLeft';
import LttChevronRight from 'assets/lttChevronRight';
import Star from 'assets/star';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper'),
  { ssr: false }
);

interface IReviewSectionProps {
  isMobile: boolean;
}

const ReviewSection = ({ isMobile }: IReviewSectionProps) => {
  const [swiper, updateSwiper] = useState<SwiperType | null>(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);

  const swiperParams: SwiperProps = {
    slidesPerView: isMobile ? 1 : 3,
    spaceBetween: isMobile ? 12 : 25,
    style: isMobile ? { overflow: 'visible' } : {},
    loop: isMobile ? true : false,
    freeMode: {
      enabled: true,
    },
  };

  const goNext = () => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx + 3;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        Direction: 'Next',
        Category: 'Reviews Section',
        [ANALYTICS_PROPERTIES.NEXT_ITEMS_COUNT]: Math.min(
          3,
          LTT_LP_HARDCODED_REVIEWS?.length - newIndex
        ),
      });
    }
  };
  const goPrev = () => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx - 3;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        Direction: 'Previous',
        Category: 'Reviews Section',
        [ANALYTICS_PROPERTIES.NEXT_ITEMS_COUNT]: Math.min(
          3,
          LTT_LP_HARDCODED_REVIEWS?.length - newIndex
        ),
      });
    }
  };

  return (
    <ReviewSectionWrapper className="hroizontally-aligned-child">
      <div className="header">
        <div className="title">
          {strings.LTT_LANDING_PAGE.LOVED_BY_MILLIONS}
        </div>
        <Conditional if={!isMobile}>
          <div className="controls">
            <LttChevronLeft onClick={goPrev} disabled={activeSlideIdx <= 0} />
            <LttChevronRight
              onClick={goNext}
              disabled={activeSlideIdx + 3 >= LTT_LP_HARDCODED_REVIEWS.length}
            />
          </div>
        </Conditional>
      </div>
      <div className="reviews">
        <Swiper isFreeMode {...swiperParams} onSwiper={updateSwiper}>
          {LTT_LP_HARDCODED_REVIEWS.map((review, idx) => (
            <Review key={`${review.name} ${idx}`}>
              <div className="details">
                <div className="pfp">
                  <Image
                    draggable={false}
                    url={review.user_image_url}
                    alt={`${review.name} user image`}
                    priority
                    height={44}
                    width={44}
                    autoCrop={true}
                    className={`pinned-card-vertical-image`}
                    fetchPriority="high"
                    fitCrop={true}
                  />
                </div>
                <div className="user-details">
                  <div className="left">
                    <span className="name">{review.name}</span>
                    <span className="country">{review.country}</span>
                  </div>
                  <div className="stars">
                    {Array.from({ length: review.stars }).map((_, index) => (
                      <Star color={COLORS.TEXT.CANDY_1} key={`star_${index}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-content">{review.reviewText}</div>
              <a
                href={review.showLink}
                className="show-name"
                role="button"
                tabIndex={0}
                rel="nore"
              >
                {review.showName}
              </a>
            </Review>
          ))}
        </Swiper>
      </div>
    </ReviewSectionWrapper>
  );
};

export default ReviewSection;
