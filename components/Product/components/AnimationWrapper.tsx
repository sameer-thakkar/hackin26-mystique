import { useEffect, useRef, useState } from 'react';
import Reviews from 'components/Product/components/Reviews';
import { AnimationWrapper } from 'components/Product/styles';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { getUniqueRandomOutputs } from 'utils/productUtils';
import { EXPERIMENT_NAMES } from 'const/experiments';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';

const AnimatedCarousel = ({ isMobile }: { isMobile?: boolean }) => {
  const wrapperRef = useRef(null);
  const isOnScreen = useOnScreen({
    ref: wrapperRef,
  });
  const [topSlide, setTopSlide] = useState(0);
  const [triggerAppend, setTriggerAppend] = useState(true);
  const [isTracked, setIsTracked] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const appendSlide = (currSlide: number) => {
    if (!triggerAppend) {
      setTriggerAppend(true);
      return;
    }
    setTriggerAppend(false);
    setTopSlide(currSlide === reviews.length - 1 ? 0 : currSlide + 1);
  };

  const getClassName = (idx: number) => {
    if (idx === topSlide) return 'top-slide';
    if (idx === topSlide + 1 || (topSlide === reviews.length - 1 && idx === 0))
      return 'bottom-slide';
  };

  useEffect(() => {
    if (isTracked || !isOnScreen) return;
    setIsTracked(true);
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXP_COMPONENT_LOADED,
      [ANALYTICS_PROPERTIES.EXPERIMENT_NAME]:
        EXPERIMENT_NAMES.GUIDED_TOUR_PRODUCT_CARD_REVAMP_EXPERIMENT,
      [ANALYTICS_PROPERTIES.COMPONENT_NAME]: 'Review Component',
    });
  }, [isOnScreen, topSlide]);

  useEffect(() => {
    const sampleArray = Object.values(strings.GUIDED_TOUR_REVIEWS).filter(
      (str) => str
    );
    const randomReviews =
      getUniqueRandomOutputs({
        sampleArray,
        outputCount: 3,
      }) ?? [];
    setReviews((prevReviews) => [...prevReviews, ...randomReviews]);
    return () => {
      setReviews([]);
    };
  }, []);

  return (
    <AnimationWrapper
      ref={wrapperRef}
      onAnimationEnd={() => appendSlide(topSlide)}
    >
      {reviews.map((review, idx) => {
        return (
          <Reviews
            isMobile={isMobile}
            key={`review${idx}`}
            reviewText={review}
            className={getClassName(idx)}
          />
        );
      })}
      <Reviews className="place-holder" />
    </AnimationWrapper>
  );
};

export default AnimatedCarousel;
