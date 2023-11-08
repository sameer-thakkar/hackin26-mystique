import { useState } from 'react';
import dynamic from 'next/dynamic';
import Swiper from 'swiper';
import { StyledHeaderSection } from 'components/AirportTransfers/AirportTransferFeatures/styles';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import {
  TVehicleTypes,
  VEHICLE_TYPE_ILLUSTRATION_MAP,
} from 'const/airportTransfers';
import {
  ArrowCircleRight,
  LuggageIconSVG,
  PassengerSVG,
  SparklesSVG,
  ThreeCirclesSVG,
} from 'assets/airportTransfers';
import { TTransferVehicleTypesCarouselProps } from './interface';
import {
  StyledCardContainer,
  StyledCarouselContainer,
  StyledContainer,
  StyledSectionTitle,
  StyledTextSection,
  TranferTypeTag,
} from './styles';

const SwiperWrapper = dynamic(() => import('components/Swiper'));

const SWIPER_BREAKPOINTS = {
  0: {
    slidesPerView: 1.1,
    spaceBetween: 16,
  },
  386: {
    slidesPerView: 1.185,
    spaceBetween: 16,
  },
  410: {
    slidesPerView: 1.25,
    spaceBetween: 16,
  },

  768: {
    slidesPerView: 2,
    spaceBetween: 16,
  },
  1024: {
    slidesPerView: 2.725,
    spaceBetween: 24,
  },
  1200: {
    slidesPerView: 2.85,
    spaceBetween: 24,
  },
};

export const TransferVehicleTypesCarousel = ({
  sliceItems,
  isMobile,
}: TTransferVehicleTypesCarouselProps) => {
  const [swiper, setSwiper] = useState<Swiper | null>(null);

  const [isSwiperEnd, setIsSwiperEnd] = useState(false);

  const [isSwiperStart, setIsSwiperStart] = useState(true);

  if (!sliceItems) return null;

  const handleSlideChange = () => {
    if (!swiper) {
      return;
    }

    setIsSwiperEnd(swiper?.isEnd ?? false);
    setIsSwiperStart(swiper?.isBeginning ?? false);
  };

  return (
    <StyledContainer>
      <StyledHeaderSection className="header">
        <StyledSectionTitle>
          Pick the best airport transfer for you
        </StyledSectionTitle>

        <div className="carousel-controls">
          <ArrowCircleRight
            onClick={() => {
              swiper?.slidePrev();
              setIsSwiperEnd(false);
            }}
            className={isSwiperStart ? 'disabled' : ''}
          />

          <ArrowCircleRight
            onClick={() => swiper?.slideNext()}
            className={isSwiperEnd ? 'disabled' : ''}
          />
        </div>
      </StyledHeaderSection>

      <StyledCarouselContainer className="swiper-container">
        <SwiperWrapper
          centerInsufficientSlides
          slidesOffsetAfter={isMobile ? 48 : 0}
          className="swiper"
          breakpoints={SWIPER_BREAKPOINTS}
          onSwiper={(s) => {
            setSwiper(s);
            s.on('reachEnd', () => {
              setIsSwiperEnd(true);
            });
          }}
          onSlideChange={handleSlideChange}
        >
          {sliceItems?.map((item, index) => (
            <Card
              key={index}
              title={item.card_title}
              description={item.card_subtitle}
              tag={item.card_tag}
              paxInfo={item.passenger_info ?? undefined}
              luggageInfo={item.luggage_info ?? undefined}
              vehicleType={item.vehicle_type}
            />
          ))}
        </SwiperWrapper>
      </StyledCarouselContainer>
    </StyledContainer>
  );
};

const Card = ({
  tag,
  title,
  description,
  paxInfo: paxInfo,
  luggageInfo: luggageInfo,
  vehicleType,
}: {
  tag: string;
  title: string;
  description: string;
  paxInfo?: string;
  luggageInfo?: string;
  vehicleType: TVehicleTypes;
}) => {
  return (
    <StyledCardContainer $type={tag}>
      <TranferTypeTag $type={tag}>
        {tag === 'Shared' ? <ThreeCirclesSVG /> : <SparklesSVG />}

        {tag === 'Shared' ? 'Shared' : 'Private'}
      </TranferTypeTag>

      <StyledTextSection $type={tag}>
        <div className="title">{title}</div>

        <p className="description">{description}</p>

        <div className="pax-luggage-count">
          <Conditional if={paxInfo}>
            <div className="pax-count">
              <PassengerSVG />
              {paxInfo}
            </div>
          </Conditional>

          <Conditional if={luggageInfo}>
            <div className="luggage-count">
              <LuggageIconSVG />
              {luggageInfo}
            </div>
          </Conditional>
        </div>
      </StyledTextSection>

      <div className="illustration">
        <Image
          url={VEHICLE_TYPE_ILLUSTRATION_MAP[vehicleType]}
          alt={vehicleType}
          width={150}
          height={58}
        />
      </div>
    </StyledCardContainer>
  );
};
