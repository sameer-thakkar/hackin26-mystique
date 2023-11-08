import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type Swiper from 'swiper';
import { EffectCards } from 'swiper';
import {
  ArrowCircleRight,
  CarIconSVG,
  MapSVG,
  PhoneSVG,
} from 'assets/airportTransfers';
import { TICKET } from 'assets/SvgIcons';
import {
  StyledCardContainer,
  StyledGradientContainer,
  StyledHeaderSection,
  StyledSectionTitle,
} from './styles';

const SwiperWrapper = dynamic(() => import('components/Swiper'));

const CARDS = [
  {
    icon: <PhoneSVG />,
    title: 'Book Online',
    description:
      'Enjoy a fast, and convenient booking experience by booking your tickets online.',
  },
  {
    icon: <TICKET />,
    title: 'Instant Confirmation',
    description:
      'Get instant confirmation on booking your airport transfer ticket.',
  },
  {
    icon: <CarIconSVG />,
    title: 'Convenient Pickup',
    description:
      'Avoid the hassle of long queues as your transfer vehicle will be waiting for you at your selected pickup point.',
  },
  {
    icon: <MapSVG />,
    title: 'Drop Off',
    description:
      'Get to reach your destination in a fast and comfortable manner.',
  },
];

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
    <StyledGradientContainer>
      <StyledHeaderSection>
        <StyledSectionTitle>
          Hassle-free airport transfer experience
        </StyledSectionTitle>

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
          {CARDS.map((card, i) => (
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
