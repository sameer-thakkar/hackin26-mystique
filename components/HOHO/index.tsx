import { useCallback, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import TourGroupInfo from 'components/HOHO/components/TourGroupInfo';
import { VariantCardWrapper } from 'components/HOHO/components/VariantCard/styles';
import VariantCarousel from 'components/HOHO/components/VariantCarousel';
import { HOHOCardProps } from 'components/HOHO/interface';
import { Container, VariantCardSkeletonWrapper } from 'components/HOHO/styles';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CAROUSEL_DIR,
} from 'const/index';
import 'react-loading-skeleton/dist/skeleton.css';

const CAROUSEL_SLIDE_NUMBER = 3;
const swipeDirection = {
  forward: 1,
  backward: -1,
};

const HOHOCard: React.FC<HOHOCardProps> = (props) => {
  const {
    isMobile,
    variants,
    tourGroupId,
    tourGroupData,
    routeDetails,
    currency,
    index,
  } = props;

  const {
    productTitle: tourGroupName,
    images,
    highlights: tourGroupHighlights,
  } = tourGroupData || {};
  const tourGroupImage = images?.[images?.length - 1];

  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const finalVariants = variants?.filter(
    (variant: Record<string, any>) =>
      variant?.listingPrice !== null && variant?.variantInfo !== null
  );
  const totalCards = finalVariants?.length;

  useEffect(() => {
    if (!swiper) return;
    setActiveIndex(swiper.activeIndex);
  }, [swiper?.activeIndex]);

  const updateIndex = useCallback(() => {
    if (isMobile || !swiper) return;
    setActiveIndex(swiper.realIndex);
  }, [swiper, isMobile]);

  const swipeSlide = useCallback(
    (direction: number) => {
      if (!swiper) return;
      const currentIndex = swiper.activeIndex;
      const updatedIndex = currentIndex + CAROUSEL_SLIDE_NUMBER * direction;
      swiper.slideTo(updatedIndex);
      setActiveIndex(updatedIndex);

      const isForward = direction === swipeDirection.forward;
      const disabled = isForward
        ? currentIndex + CAROUSEL_SLIDE_NUMBER >= totalCards
        : currentIndex <= 0;
      if (!disabled) {
        trackEvent({
          eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
          [ANALYTICS_PROPERTIES.DIRECTION]: isForward
            ? CAROUSEL_DIR.NEXT
            : CAROUSEL_DIR.PREV,
        });
      }
    },
    [swiper]
  );

  const swiperParams: SwiperProps = {
    slidesPerView: CAROUSEL_SLIDE_NUMBER,
    spaceBetween: 24,
    onSwiper: (swiper: TSwiper) => setSwiperInstance(swiper),
    onTouchEnd: () => {},
    onSlideChange: () => updateIndex(),
  };

  const tourGroupInfo = {
    tourGroupName,
    tourGroupImage,
    tourGroupHighlights,
    tourGroupId,
    images,
  };

  const containerRef = useRef(null);
  const isIntersecting = useOnScreen({ ref: containerRef, unobserve: true });
  useEffect(() => {
    if (isIntersecting) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_VISIBLE,
        [ANALYTICS_PROPERTIES.TGID]: tourGroupId,
      });
    }
  }, [isIntersecting, tourGroupId]);

  return (
    <Conditional if={totalCards}>
      <Container ref={containerRef}>
        <TourGroupInfo
          {...tourGroupInfo}
          isMobile={isMobile}
          swipeNext={() => swipeSlide(swipeDirection.forward)}
          swipePrev={() => swipeSlide(swipeDirection.backward)}
          activeIndex={activeIndex}
          totalCards={totalCards}
          tgidRouteData={routeDetails}
          index={index}
        />
        <Conditional if={!isMobile && swiper === null && totalCards > 1}>
          <VariantCardSkeletonWrapper>
            <VariantCardSkeleton />
            <VariantCardSkeleton />
            <VariantCardSkeleton />
          </VariantCardSkeletonWrapper>
        </Conditional>
        <VariantCarousel
          isMobile={isMobile}
          swiperParams={swiperParams}
          variants={variants}
          tgid={tourGroupId}
          tourGroupName={tourGroupName || ''}
          currency={currency}
          isSingleVariant={totalCards === 1}
        />
      </Container>
    </Conditional>
  );
};
export default HOHOCard;

export const VariantCardSkeleton = () => {
  return (
    <VariantCardWrapper isSkeleton={true}>
      <Skeleton width="100%" height="400px" />
    </VariantCardWrapper>
  );
};
