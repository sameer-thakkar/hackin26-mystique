import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type Swiper from 'swiper';
import { AIRPORT_TRANSFER_REVIEWS } from 'const/airportTransfers';
import { StarIcon } from 'const/descriptorIcons';
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

  const handleSlideChange = () => {
    if (!swiper) {
      return;
    }

    setIsSwiperEnd(swiper?.isEnd ?? false);
    setIsSwiperStart(swiper?.isBeginning ?? false);
  };

  return (
    <StyledReviewsContainer>
      <StyledHeaderSection>
        <StyledSectionTitle>
          {strings.AIRPORT_TRANSFER.SEAMLESS_TRANSFERS}
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
  avatarPath,
  name,
  countryEmoji,
  country,
  text,
}: {
  avatarPath: string;
  name: string;
  countryEmoji: string;
  country: string;
  text: string;
}) => {
  return (
    <StyledReviewCardContainer>
      <Image src={avatarPath} width={44} height={44} />

      <div className="name-and-country">
        <p className="name">{name}</p>

        <div className="country">
          <span role="img" aria-label={`Flag of ${country}`}>
            {countryEmoji}
          </span>
          {country}
        </div>
      </div>

      <div className="stars">
        <StarIcon />
        <StarIcon />
        <StarIcon />
        <StarIcon />
        <StarIcon />
      </div>

      <div className="text">{text}</div>
    </StyledReviewCardContainer>
  );
};
