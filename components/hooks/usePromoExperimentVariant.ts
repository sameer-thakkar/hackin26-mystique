import { EXPERIMENT_NAMES, VARIANTS } from 'constants/experiments';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { getABTestingVariant } from 'utils/experiments/experimentUtils';

const getVariantFromCookieValue = (val) => {
  switch (val) {
    case '1':
      return VARIANTS.NO_PROMO;
    case '2':
      return VARIANTS.PROMO_5;
    case '3':
      return VARIANTS.PROMO_10;
    default:
      return null;
  }
};

const getCookieValueFromVariant = (variant) => {
  switch (variant) {
    case VARIANTS.NO_PROMO:
      return '1';
    case VARIANTS.PROMO_5:
      return '2';
    case VARIANTS.PROMO_10:
      return '3';
    default:
      return null;
  }
};

const usePromoExperimentVariant = (hsid: string) => {
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    const variantNumberFromCookie = Cookies.get('promo-exp-variant');
    const variant = getVariantFromCookieValue(variantNumberFromCookie);
    if (variant) {
      setVariant(variant);
    }
  }, []);

  useEffect(() => {
    if (hsid && !variant) {
      const abcTestingVariant = getABTestingVariant(
        EXPERIMENT_NAMES.PROMO_EXPERIMENT,
        hsid
      );
      setVariant(abcTestingVariant);
      Cookies.set(
        'promo-exp-variant',
        getCookieValueFromVariant(abcTestingVariant)
      );
    }
  }, [hsid, variant]);
  return variant;
};

export default usePromoExperimentVariant;

export const getPromoTypeFromVariant = (variant) => {
  switch (variant) {
    case VARIANTS.NO_PROMO:
      return 'No Promo';
    case VARIANTS.PROMO_5:
      return '5% Promo';
    case VARIANTS.PROMO_10:
      return '10% Promo';
    default:
      return null;
  }
};
