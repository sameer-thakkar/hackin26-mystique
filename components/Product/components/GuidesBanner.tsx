import { useEffect, useRef, useState } from 'react';
import {
  GuideBannerHeading,
  GuidesBannerWrapper,
  GuidesImageWrapper,
} from 'components/Product/styles';
import Image from 'UI/Image';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { getUniqueRandomOutputs } from 'utils/productUtils';
import { EXPERIMENT_NAMES } from 'const/experiments';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  GUIDES_IMAGE_URL,
} from 'const/index';
import { strings } from 'const/strings';

export const GuidesBanner = ({
  isInSwipeSheet,
}: {
  isInSwipeSheet?: boolean;
}) => {
  const wrapperRef = useRef(null);
  const isOnScreen = useOnScreen({
    ref: wrapperRef,
  });
  const [isTracked, setIsTracked] = useState(false);
  const [guideImages, setGuideImages] = useState<number[] | undefined>([]);
  const trackClick = (e: any) => {
    e.stopPropagation();
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXP_COMPONENT_CLICKED,
      [ANALYTICS_PROPERTIES.EXPERIMENT_NAME]:
        EXPERIMENT_NAMES.GUIDED_TOUR_PRODUCT_CARD_REVAMP_EXPERIMENT,
      [ANALYTICS_PROPERTIES.COMPONENT_NAME]: 'Guide Component',
    });
  };
  useEffect(() => {
    if (isTracked || !isOnScreen) return;
    setIsTracked(true);
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXP_COMPONENT_LOADED,
      [ANALYTICS_PROPERTIES.EXPERIMENT_NAME]:
        EXPERIMENT_NAMES.GUIDED_TOUR_PRODUCT_CARD_REVAMP_EXPERIMENT,
      [ANALYTICS_PROPERTIES.COMPONENT_NAME]: 'Guide Component',
    });
  }, [isOnScreen]);
  useEffect(() => {
    setGuideImages(
      getUniqueRandomOutputs({ numArraySize: 19, outputCount: 3 })
    );
  }, []);

  return (
    <GuidesBannerWrapper
      ref={wrapperRef}
      $isInSwipeSheet={isInSwipeSheet}
      onClick={trackClick}
    >
      <GuidesImageWrapper>
        {guideImages?.map((guideImage, idx) => (
          <Image
            key={`guide-image-${guideImage}`}
            className={idx !== 0 ? 'push-left' : ''}
            alt="guide-img"
            url={`${strings.formatString(GUIDES_IMAGE_URL, guideImage)}`}
          />
        ))}
      </GuidesImageWrapper>
      <GuideBannerHeading>{strings.GUIDES_BANNER}</GuideBannerHeading>
    </GuidesBannerWrapper>
  );
};
