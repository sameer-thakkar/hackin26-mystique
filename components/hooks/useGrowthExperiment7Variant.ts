import { useState, useEffect } from 'react';
import { getABTestingVariant } from 'utils/experiments/experimentUtils';
import { EXPERIMENT_NAMES, VARIANTS } from 'const/experiments';

const useGrowthExperiment7Variant = (hsid: string) => {
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    if (hsid) {
      const abcTestingVariant = getABTestingVariant(
        EXPERIMENT_NAMES.GROWTH_EXPERIMENT_7,
        hsid
      );
      setVariant(abcTestingVariant);
    }
  }, [hsid]);

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
