import useABTesting from 'hooks/useABTesting';
import { checkIfLTTMB, isMobile } from 'utils/helper';
import { VARIANTS } from 'const/experiments';
import { ListingPrice } from '../interface';
import { hasDiscountElementAndCashbackElement } from '../utils';

const EXCLUDED_UIDS = [
  'www.london-theater-tickets.com.vogue-inventing-the-runway-tickets',
  'www.london-theater-tickets.com.wicked-tickets',
];

export const useIsLTTShowPageExperiementEnabled = (
  uid: string,
  listingPrice: ListingPrice,
  shouldTrackEvent = false
) => {
  const {
    variant: lttShowPageExperimentV2Variant,
    isExperimentResolving: isLttShowPageExperimentV2Resolving,
    isEligible: isLttShowPageExperimentV2Eligible,
  } = useABTesting({
    experimentId: 'LTT_SHOW_PAGE_EXPERIMENT_V2',
    customEligibilityCheckFn: () =>
      checkIfLTTMB(uid) &&
      !isMobile() &&
      !EXCLUDED_UIDS.includes(uid) &&
      !hasDiscountElementAndCashbackElement(listingPrice)?.hasDiscountElement,
    noTrack: !shouldTrackEvent,
  });

  const isShowPageExperiment =
    lttShowPageExperimentV2Variant === VARIANTS.TREATMENT &&
    isLttShowPageExperimentV2Eligible &&
    !isLttShowPageExperimentV2Resolving;

  return {
    isShowPageExperiment,
  };
};
