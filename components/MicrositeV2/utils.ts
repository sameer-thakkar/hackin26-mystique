import { VARIANTS } from 'const/experiments';
import { strings } from 'const/strings';
import { ELttOrBroadway } from './MobileBannerV2/interface';

export const getFirstBannerHeading = (
  isLttCopyExperimentEligible: boolean,
  index: number,
  originalBannerHeading: string,
  lttCopyExperimentVariant: string | null,
  lttOrBroadway: ELttOrBroadway | null
) => {
  if (
    !isLttCopyExperimentEligible ||
    index !== 0 ||
    !lttCopyExperimentVariant ||
    lttCopyExperimentVariant === VARIANTS.CONTROL ||
    !lttOrBroadway
  ) {
    return originalBannerHeading;
  } else if (lttCopyExperimentVariant === VARIANTS.TREATMENT_A) {
    return strings.ENTT_COPY_EXPERIMENT[lttOrBroadway].VARIANT_A.BANNER_TITLE;
  } else if (lttCopyExperimentVariant === VARIANTS.TREATMENT_B) {
    return strings.ENTT_COPY_EXPERIMENT[lttOrBroadway].VARIANT_B.BANNER_TITLE;
  } else {
    return originalBannerHeading;
  }
};
