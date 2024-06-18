import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import { ChildSection } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import SwiperWrapper from 'components/Swiper';
import Image from 'UI/Image';
import { useSwiperArrows } from 'hooks/useSwiper';
import { getDurationInHHMM } from 'utils/dateUtils';
import { nearbyThingsIcon } from 'const/itinerary';
import { strings } from 'const/strings';
import { TailedArrowSVG } from 'assets/airportTransfers';
import {
  CarouselContainer,
  Container,
  HeadingContainer,
  IconContainer,
  PassByContainer,
  PassByContent,
} from './styles';
import { NearbyThingsToDoProps } from './types';

const NavigationButtons = dynamic(
  () =>
    import(
      /* webpackChunkName: "NavigationButtons" */ 'components/common/NavigationButtons'
    )
);

const NearbyItem = ({
  details: { mediaUrls, name, timeFromParent, subType },
  id,
  link,
}: ChildSection & { link?: string | null }) => {
  const [TypeIcon, setTypeIcon] = useState<React.ComponentType<{}> | null>(
    null
  );

  const iconAvailable =
    subType && Object.keys(nearbyThingsIcon).includes(subType.label);

  useEffect(() => {
    if (!subType) return;

    const icon = dynamic(nearbyThingsIcon[subType.label]);

    setTypeIcon(icon);
  }, []);

  const durationObject = timeFromParent
    ? getDurationInHHMM(timeFromParent)
    : null;
  const hasHours = durationObject?.hours !== 0;
  const walkDuration = durationObject
    ? (strings.formatString(
        hasHours
          ? strings.ITINERARY.DESCRIPTORS.DURATION.WITH_HOURS
          : strings.ITINERARY.DESCRIPTORS.DURATION.WITHOUT_HOURS,
        ...(hasHours
          ? [durationObject?.hours, durationObject?.minutes]
          : [durationObject?.minutes])
      ) as string)
    : '';

  const hasImage = !!mediaUrls?.length;

  return (
    <PassByContainer
      key={`nearby-things-${id}`}
      {...(link && { href: link, as: 'a', target: '_blank' })}
    >
      {hasImage && (
        <Image
          url={mediaUrls[0]}
          alt="passby-image"
          height={36}
          width={56}
          priority
          fetchPriority={'high'}
          fill
          aspectRatio="16:10"
          autoCrop={false}
        />
      )}
      <Conditional if={!hasImage && iconAvailable}>
        <IconContainer>{TypeIcon && <TypeIcon />}</IconContainer>
      </Conditional>

      <PassByContent $isClickable={!!link}>
        <div className="passby-name">{name}</div>
        <Conditional if={walkDuration}>
          <div className="passby-duration">
            {strings.formatString(
              strings.ITINERARY.WALK_DURATION,
              walkDuration
            )}
          </div>
        </Conditional>
        <Conditional if={!!link}>
          <TailedArrowSVG className="passby-arrow" />
        </Conditional>
      </PassByContent>
    </PassByContainer>
  );
};

const NearbyThingsToDo = ({ passBys = [] }: NearbyThingsToDoProps) => {
  const swiperRef = useRef<TSwiper | null>(null);

  const { showRightArrow, showLeftArrow, onSlideChange } = useSwiperArrows();

  const swiperParams: SwiperProps = {
    lazy: {
      enabled: true,
      loadOnTransitionStart: true,
      loadPrevNext: true,
      loadPrevNextAmount: 1,
    },
    loop: false,
    loopPreventsSlide: false,
    autoplay: false,
    speed: 600,
    grabCursor: passBys.length > 1,
    preloadImages: false,
    onSwiper: (swiper: TSwiper) => {
      swiperRef.current = swiper;
      onSlideChange(swiper);
    },
    onSlideChange,
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 8,
  };

  const handleNext = () => swiperRef.current?.slideNext();
  const handlePrev = () => swiperRef.current?.slidePrev();

  return (
    <Container>
      <HeadingContainer>
        <p className="passby-heading">
          {strings.ITINERARY.SUB_SECTION_HEADING.NEARBY_THINGS_TO_DO}
        </p>
        <Conditional
          if={passBys.length > 2 && (showLeftArrow || showRightArrow)}
        >
          <NavigationButtons
            showLeftArrow={showLeftArrow}
            showRightArrow={showRightArrow}
            nextSlide={handleNext}
            prevSlide={handlePrev}
          />
        </Conditional>
      </HeadingContainer>
      <CarouselContainer>
        <SwiperWrapper {...swiperParams}>
          {passBys.map((passBy, index) => (
            <NearbyItem key={index} {...passBy} />
          ))}
        </SwiperWrapper>
      </CarouselContainer>
    </Container>
  );
};

export default NearbyThingsToDo;
