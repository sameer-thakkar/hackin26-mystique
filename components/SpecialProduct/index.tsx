import { useEffect, useRef, useState } from 'react';
import { TSpecialProductType } from 'components/SpecialProduct/interface';
import { SpecialProductWrapper } from 'components/SpecialProduct/styles';
import SpecialProductDetails from 'components/SpecialProductDetails';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { EXPERIMENT_NAMES } from 'const/experiments';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';

const SpecialProduct = ({ Product, isMobile }: TSpecialProductType) => {
  const wrapperRef = useRef(null);
  const isOnScreen = useOnScreen({ ref: wrapperRef });
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isTracked, setIsTracked] = useState(false);
  useEffect(() => {
    if (!animationComplete || isTracked || !isOnScreen) return;
    setIsTracked(true);
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXP_COMPONENT_LOADED,
      [ANALYTICS_PROPERTIES.EXPERIMENT_NAME]:
        EXPERIMENT_NAMES.TOUR_RANKING_EXPERIMENT,
      [ANALYTICS_PROPERTIES.COMPONENT_NAME]: 'Guided Tours Design Box',
    });
  }, [isOnScreen, animationComplete]);

  return (
    <SpecialProductWrapper
      ref={wrapperRef}
      onAnimationEndCapture={() => setAnimationComplete(true)}
    >
      <SpecialProductDetails
        isMobile={isMobile}
        isOpeningAnimationComplete={animationComplete}
      />
      {Product}
    </SpecialProductWrapper>
  );
};

export default SpecialProduct;
