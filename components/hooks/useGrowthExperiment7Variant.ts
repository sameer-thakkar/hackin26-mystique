import { useState, useEffect } from 'react';
import { getABTestingVariant } from 'utils/experiments/experimentUtils';
import { EXPERIMENT_NAMES, VARIANTS } from 'const/experiments';
import { useRecoilValue } from 'recoil';
import { hsidSetFailAtom } from 'store/atoms/hsid';

import useWindowSize from './useWindowSize';

const useGrowthExperiment7Variant = (hsid: string) => {
  const isMobile = useWindowSize().width < 768;

  const hasHsidSetFailed = useRecoilValue(hsidSetFailAtom);

  const [variant, setVariant] = useState(null);

  useEffect(() => {
    if (hasHsidSetFailed && isMobile) {
      setVariant(VARIANTS.DEFAULT_BANNER_CAROUSEL);
    }
  }, [hasHsidSetFailed, isMobile]);

  useEffect(() => {
    // Don't run the experiment on Desktop (concluded to 100%)
    if (!isMobile) {
      setVariant(VARIANTS.NEW_BANNER_CAROUSEL_WITH_CTA);
      return;
    }

    if (hsid) {
      const abcTestingVariant = getABTestingVariant(
        EXPERIMENT_NAMES.GROWTH_EXPERIMENT_7,
        hsid
      );
      setVariant(abcTestingVariant);
    }
  }, [hsid, isMobile]);

  return variant;
};

export default useGrowthExperiment7Variant;

export const getCaraouselTypeFromVariant = (variant) => {
  switch (variant) {
    case VARIANTS.DEFAULT_BANNER_CAROUSEL:
      return 'Default';
    case VARIANTS.NEW_BANNER_CAROUSEL_WITH_CTA:
      return 'With button as CTA';
    case VARIANTS.NEW_BANNER_CAROUSEL_WITHOUT_CTA:
      return 'With banner as CTA';
    default:
      return null;
  }
};
