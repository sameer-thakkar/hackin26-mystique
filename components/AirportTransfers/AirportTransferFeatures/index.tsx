import { ReactNode, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type Swiper from 'swiper';
import { EffectCards } from 'swiper';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import en from 'const/localization/en';
import { strings } from 'const/strings';
import {
  ArrowCircleRight,
  CarIconSVG,
  MapSVG,
  PhoneSVG,
} from 'assets/airportTransfers';
import Ticket from 'assets/ticket';
import {
  StyledCardContainer,
  StyledGradientContainer,
  StyledHeaderSection,
  StyledSectionTitle,
} from './styles';

const SwiperWrapper = dynamic(() => import('components/Swiper'));

const getCards = (localisedStrings: typeof strings) => {
  const { BOOK_ONLINE, CONVENIENT_PICKUP, DROP_OFF, INSTANT_CONFIRMATION } =
    localisedStrings.AIRPORT_TRANSFER.BOOKING_STEPS;
  return [
    {
      icon: <PhoneSVG />,
      title: BOOK_ONLINE.TITLE,
      description: BOOK_ONLINE.DESCRIPTION,
    },
    {
      icon: <Ticket />,
      title: INSTANT_CONFIRMATION.TITLE,
      description: INSTANT_CONFIRMATION.DESCRIPTION,
    },
    {
      icon: <CarIconSVG />,
      title: CONVENIENT_PICKUP.TITLE,
      description: CONVENIENT_PICKUP.DESCRIPTION,
    },
    {
      icon: <MapSVG />,
      title: DROP_OFF.TITLE,
      description: DROP_OFF.DESCRIPTION,
    },
  ];
};

const SWIPER_BREAKPOINTS = {
  0: {
    slidesPerView: 1,
    spaceBetween: 16,
  },
  768: {
    slidesPerView: 2.2,
    spaceBetween: 18,
  },
  1024: {
    slidesPerView: 2.6,
    spaceBetween: 18,
  },
  1200: {
    slidesPerView: 3,
    spaceBetween: 24,
  },
  1440: {
    slidesPerView: 3,
    spaceBetween: 24,
  },
  1700: {
    slidesPerView: 3.025,
    spaceBetween: 24,
  },
};

const swiperAutoPlayConfig = {
  disableOnInteraction: false,
};

export const AirportTransferFeatures = ({
  isMobile,
}: {
  isMobile: boolean;
}) => {
  const [swiper, setSwiper] = useState<Swiper | null>(null);

  const [isSwiperEnd, setIsSwiperEnd] = useState(false);

  const [isSwiperStart, setIsSwiperStart] = useState(true);

  useEffect(() => {
    if (!swiper || swiper?.destroyed || !isMobile) {
      return;
    }

    swiper?.slideTo?.(swiper.slides?.length - 1);
  }, [isMobile, swiper]);

  const enSectionTitle = en.AIRPORT_TRANSFER.HASSLE_FREE_TRANSFER;

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
        [ANALYTICS_PROPERTIES.RANKING]: 3,
      });
    }
  }, [isIntersecting, enSectionTitle]);

  const handleSwiper = (s: Swiper) => {
    setSwiper(s);

    if (!isMobile) return;

    handleSlidesOpacity(s);
  };

  const handleSlideChange = () => {
    if (!swiper) {
      return;
    }

    setIsSwiperEnd(swiper?.isEnd ?? false);
    setIsSwiperStart(swiper?.isBeginning ?? false);

    if (!isMobile) {
      return;
    }

    handleSlidesOpacity(swiper);
  };

  return (
    <StyledGradientContainer ref={sectionVisibilityTrackingRef}>
      <StyledHeaderSection>
        <StyledSectionTitle>
          {strings.AIRPORT_TRANSFER.HASSLE_FREE_TRANSFER}
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

      <div className="swiper-container">
        <SwiperWrapper
          noSwiping={isMobile}
          allowTouchMove={!isMobile}
          key={String(isMobile)} // Force re-render on breakpoint change
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
          }}
          breakpoints={isMobile ? undefined : SWIPER_BREAKPOINTS}
          direction={isMobile ? 'vertical' : 'horizontal'}
          effect={isMobile ? 'cards' : undefined}
          initialSlide={isMobile ? 3 : 0}
          modules={[EffectCards]}
          cardsEffect={
            isMobile
              ? {
                  rotate: false,
                  slideShadows: false,
                  perSlideOffset: 12,
                }
              : undefined
          }
          onSlideChange={handleSlideChange}
          onSwiper={handleSwiper}
          className="swiper"
          loop={isMobile}
          autoplay={isMobile ? swiperAutoPlayConfig : undefined}
        >
          {getCards(strings).map((card, i) => (
            <Card
              key={i}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </SwiperWrapper>
      </div>
    </StyledGradientContainer>
  );
};

const Card = ({
  icon,
  title,
  description,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}) => {
  return (
    <StyledCardContainer onClick={onClick}>
      {icon}

      <p className="title">{title}</p>

      <p className="description">{description}</p>
    </StyledCardContainer>
  );
};

const handleSlidesOpacity = (swiper: Swiper) => {
  const { activeIndex, slides } = swiper;

  slides?.forEach((slide, index) => {
    // hide all slides except the first 3 slides (including active)
    if (activeIndex > 2 && index < activeIndex - 2) {
      (slide as HTMLElement).style.opacity = '0';
      return;
    }

    if (index > activeIndex) {
      // Hide downward stack
      (slide as HTMLElement).style.opacity = '0';
      return;
    }

    if (index === activeIndex) {
      // Show the active slide
      (slide as HTMLElement).style.opacity = '1';
      return;
    }

    // Set opacity based on distance from active slide
    const opacity = 1 - Math.abs(activeIndex - index) * 0.4;
    (slide as HTMLElement).style.opacity = String(Math.max(opacity, 0.1));
  });
};
