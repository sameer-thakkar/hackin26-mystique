import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getABTestingVariant } from 'utils/experiments/experimentUtils';
import { EXPERIMENT_NAMES, VARIANTS } from 'const/experiments';

const useGrowthExperiment7Variant = (hsid: string) => {
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    const variantNumberFromCookie = Cookies.get('gexp-7-variant');
    const variant = getVariantFromCookieValue(variantNumberFromCookie);
    if (variant) {
      setVariant(variant);
    }
  }, []);

  useEffect(() => {
    if (hsid && !variant) {
      const abcTestingVariant = getABTestingVariant(
        EXPERIMENT_NAMES.GROWTH_EXPERIMENT_7,
        hsid
      );
      setVariant(abcTestingVariant);
      Cookies.set(
        'gexp-7-variant',
        getCookieValueFromVariant(abcTestingVariant)
      );
    }
  }, [hsid, variant]);

  return variant;
};

export default useGrowthExperiment7Variant;

const getVariantFromCookieValue = (value) => {
  switch (value) {
    case '1':
      return VARIANTS.DEFAULT_BANNER_CAROUSEL;
    case '2':
      return VARIANTS.NEW_BANNER_CAROUSEL_WITH_CTA;
    case '3':
      return VARIANTS.NEW_BANNER_CAROUSEL_WITHOUT_CTA;
    default:
      return null;
  }
};

const getCookieValueFromVariant = (variant) => {
  switch (variant) {
    case VARIANTS.DEFAULT_BANNER_CAROUSEL:
      return '1';
    case VARIANTS.NEW_BANNER_CAROUSEL_WITH_CTA:
      return '2';
    case VARIANTS.NEW_BANNER_CAROUSEL_WITHOUT_CTA:
      return '3';
    default:
      return null;
  }
};

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
