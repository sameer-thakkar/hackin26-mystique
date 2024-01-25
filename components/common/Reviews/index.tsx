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
import { LTT_CHEVRON_LEFT, LTT_CHEVRON_RIGHT } from 'assets/SvgIcons';

const Swiper = dynamic(() =>
  import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const Reviews: React.FC<TReviewsProp> = (props) => {
  const [swiper, setSwiper] = useState<TSwiper | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const reviewRef = useRef(null);
  const isReviewsSectionVisible = useOnScreen({
    ref: reviewRef,
    unobserve: true,
  });

  const { heading, reviews, isMobile, mediaData } = props;

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
      trackEvent({
        eventName: ANALYTICS_EVENTS.REVIEWS_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: 'Reviews Section',
      });
    }
  }, [isReviewsSectionVisible]);

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
              <LTT_CHEVRON_LEFT
                onClick={onPrev}
                disabled={swiper?.activeIndex === 0}
              />
              <LTT_CHEVRON_RIGHT
                onClick={onNext}
                disabled={
                  Number(swiper?.activeIndex) +
                    Number(swiper?.params?.slidesPerView) >=
                  reviews?.length
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
        {reviews?.map((review, index) => {
          const {
            tourGroup,
            nonCustomerName,
            rating,
            content,
            reviewTime,
            translatedContent,
          } = review;

          const verticalPoster = mediaData?.filter((media: any) => {
            return +media.resourceEntityId == tourGroup?.id;
          });
          const verticalPosterUrl = verticalPoster[0]?.medias[0]?.url;

          return (
            <ReviewCard
              key={index}
              tourGroupName={tourGroup?.name}
              reviewMedia={verticalPosterUrl}
              reviewerImgUrl={review?.reviewerImgUrl}
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
            totalCount={reviews?.length}
            activeIndex={Number(swiper?.realIndex)}
          />
        </div>
      </Conditional>
    </Wrapper>
  );
};
export default Reviews;
