import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type Swiper from 'swiper';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { AIRPORT_TRANSFER_REVIEWS } from 'const/airportTransfers';
import { StarIcon } from 'const/descriptorIcons';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import en from 'const/localization/en';
import { strings } from 'const/strings';
import { ArrowCircleRight } from 'assets/airportTransfers';
import { StyledHeaderSection } from '../AirportTransferFeatures/styles';
import {
  StyledReviewCardContainer,
  StyledReviewsContainer,
  StyledSectionTitle,
} from './styles';

const SwiperWrapper = dynamic(() => import('components/Swiper'));

const SWIPER_BREAKPOINTS = {
  0: {
    slidesPerView: 1,
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

export const AirportTransferReviews = ({ isMobile }: { isMobile: boolean }) => {
  const [swiper, setSwiper] = useState<Swiper | null>(null);

  const [isSwiperEnd, setIsSwiperEnd] = useState(false);

  const [isSwiperStart, setIsSwiperStart] = useState(true);

  const enSectionTitle = en.AIRPORT_TRANSFER.SEAMLESS_TRANSFERS;

  const sectionVisibilityTrackingRef = useRef(null);

  const isIntersecting = useOnScreen({
    ref: sectionVisibilityTrackingRef,
    unobserve: true,
  });

  useEffect(() => {
    if (isIntersecting) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: enSectionTitle,
        [ANALYTICS_PROPERTIES.RANKING]: 4,
      });
    }
  }, [enSectionTitle, isIntersecting]);

  const handleSlideChange = () => {
    if (!swiper) {
      return;
    }

    setIsSwiperEnd(swiper?.isEnd ?? false);
    setIsSwiperStart(swiper?.isBeginning ?? false);
  };

  return (
    <StyledReviewsContainer ref={sectionVisibilityTrackingRef}>
      <StyledHeaderSection>
        <StyledSectionTitle>
          {strings.AIRPORT_TRANSFER.SEAMLESS_TRANSFERS}
        </StyledSectionTitle>

        <div className="carousel-controls">
          <ArrowCircleRight
            onClick={() => {
              swiper?.slidePrev();
              trackEvent({
                eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
                [ANALYTICS_PROPERTIES.SECTION]: enSectionTitle,
                [ANALYTICS_PROPERTIES.DIRECTION]: 'Backward',
              });
            }}
            className={isSwiperStart ? 'disabled' : ''}
          />

          <ArrowCircleRight
            onClick={() => {
              swiper?.slideNext();
              trackEvent({
                eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
                [ANALYTICS_PROPERTIES.SECTION]: enSectionTitle,
                [ANALYTICS_PROPERTIES.DIRECTION]: 'Forward',
              });
            }}
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
        {AIRPORT_TRANSFER_REVIEWS.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </SwiperWrapper>
    </StyledReviewsContainer>
  );
};

const ReviewCard = ({
  name,
  rating,
  vehicleType,
  text,
}: {
  name: string;
  rating: number;
  vehicleType: string;
  text: string;
}) => {
  return (
    <StyledReviewCardContainer>
      <div>
        <p className="name">{name}</p>

        <div className="vehicle-type">{vehicleType}</div>
      </div>

      <div className="stars">
        {Array.from({ length: rating }).map((_, index) => (
          <StarIcon key={index} />
        ))}
      </div>

      <div className="text">{text}</div>
    </StyledReviewCardContainer>
  );
};
