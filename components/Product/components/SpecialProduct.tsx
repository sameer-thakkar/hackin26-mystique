import { useEffect, useRef, useState } from 'react';
import SpecialProductDetails from 'components/Product/components/SpecialProductDetails';
import { TSpecialProductType } from 'components/Product/interface';
import { SpecialProductWrapper } from 'components/Product/styles';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
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
