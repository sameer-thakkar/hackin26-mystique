// import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import ReviewCard from 'components/common/Reviews/components/ReviewCard';
// import { Gradient } from './components/ReviewCard/styles';
import { TReviewsProp } from 'components/common/Reviews/interface';
import {
  Controls,
  NavigationButtons,
  TitleHeader,
  Wrapper,
} from 'components/common/Reviews/styles';
import { getVerticalImageUrl } from 'components/NewsPage/utils';
// import Button from 'UI/Button';
import { Paginator } from 'UI/Paginator';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  // NEWS_PAGE_SECTIONS,
} from 'const/index';
// import { strings } from 'const/strings';
import LttChevrontLeft from 'assets/lttChevronLeft';
import LttChevronRight from 'assets/lttChevronRight';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const Reviews: React.FC<TReviewsProp> = (props) => {
  const [swiper, setSwiper] = useState<TSwiper | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const reviewRef = useRef(null);
  const isReviewsSectionVisible = useOnScreen({
    ref: reviewRef,
    unobserve: true,
  });

  const {
    heading,
    reviews,
    isMobile,
    trackingObject,
    overrideSwiperProps = {},
  } = props;
  const { reviewsData, mediaData, tgidToReviewsPageUidMapping } = reviews;

  // const { SEE_ALL } = strings;

  const updateIndex = () => {
    if (swiper !== null) {
      const slideIndex = swiper?.realIndex;
      setActiveSlideIndex(slideIndex);
    }
  };

  useEffect(() => {
    if (!swiper || swiper?.destroyed) return;

    swiper.on('slideChange', updateIndex);

    return () => {
      if (swiper && !swiper.destroyed) {
        swiper.off('slideChange', updateIndex);
      }
    };
  }, [swiper, activeSlideIndex]);

  const swiperOptions: SwiperProps = {
    spaceBetween: 24,
    cssMode: true,
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1400: {
        slidesPerView: 3,
      },
    },
    allowTouchMove: isMobile ? true : false,
    onSwiper: (swiper) => setSwiper(swiper),
    ...{
      ...(isMobile && {
        autoplay: {
          delay: 8000,
        },
      }),
    },
    ...overrideSwiperProps,
  };

  const onPrev = () => {
    if (swiper !== null) {
      swiper.slidePrev();
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        [ANALYTICS_PROPERTIES.DIRECTION]: 'Previous',
        [ANALYTICS_PROPERTIES.CATEGORY]: 'Reviews',
      });
    }
  };

  const onNext = () => {
    if (swiper !== null) {
      swiper.slideNext();
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        [ANALYTICS_PROPERTIES.DIRECTION]: 'Next',
        [ANALYTICS_PROPERTIES.CATEGORY]: 'Reviews',
      });
    }
  };

  // const handleSeeAllCTAClick = () => {
  //   trackEvent({
  //     eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
  //     [ANALYTICS_PROPERTIES.SECTION]: NEWS_PAGE_SECTIONS.REVIEWS,
  //   });
  // };

  useEffect(() => {
    if (isReviewsSectionVisible) {
      trackEvent(trackingObject);
    }
  }, [isReviewsSectionVisible]);

  const { items: reviewItems } = reviewsData?.result?.reviews ?? {};

  if (!reviewItems?.length) {
    return null;
  }

  return (
    <Wrapper ref={reviewRef}>
      <TitleHeader>
        <h2>{heading}</h2>
        <Controls>
          <Conditional if={!isMobile}>
            {/* <u onClick={handleSeeAllCTAClick} role="button" tabIndex={0}>
              {SEE_ALL}
            </u> */}
            <NavigationButtons>
              <LttChevrontLeft
                onClick={onPrev}
                disabled={swiper?.activeIndex === 0}
              />
              <LttChevronRight
                onClick={onNext}
                disabled={
                  Number(swiper?.activeIndex) +
                    Number(swiper?.params?.slidesPerView) >=
                  reviewItems?.length
                }
              />
            </NavigationButtons>
          </Conditional>
          {/* <Conditional if={isMobile}>
            <Button className="see-all-cta" onClick={handleSeeAllCTAClick}>
              {SEE_ALL}
            </Button>
          </Conditional> */}
        </Controls>
      </TitleHeader>
      <Swiper {...swiperOptions}>
        {reviewItems?.map((review: Record<string, any>, index: number) => {
          const {
            tourGroup,
            nonCustomerName,
            rating,
            content,
            reviewTime,
            translatedContent,
          } = review;

          const verticalPosterUrl = getVerticalImageUrl(
            mediaData?.resourceEntityMedias,
            tourGroup?.id
          );

          return (
            <ReviewCard
              key={index}
              tourGroupName={tourGroup?.name}
              tourGroupId={tourGroup?.id}
              reviewMedia={verticalPosterUrl}
              reviewerImgUrl={review?.reviewerImgUrl}
              tgidToReviewsPageUidMapping={tgidToReviewsPageUidMapping}
              customerName={nonCustomerName}
              rating={rating}
              content={translatedContent ?? content}
              reviewTime={reviewTime}
              isMobile={isMobile}
            />
          );
        })}
      </Swiper>
      <Conditional if={isMobile}>
        <div className="paginator">
          <Paginator
            tabSize={0.9375}
            dotSize={0.25}
            totalCount={reviewItems?.length}
            activeIndex={Number(swiper?.realIndex)}
          />
        </div>
      </Conditional>
    </Wrapper>
  );
};
export default Reviews;
