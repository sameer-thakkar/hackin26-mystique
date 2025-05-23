import useABTesting from 'hooks/useABTesting';
import { checkIfLTTMB, isMobile } from 'utils/helper';
import { VARIANTS } from 'const/experiments';

export const useIsLTTShowPageExperiementEnabled = (
  uid: string,
  shouldTrackEvent = false
) => {
  const {
    variant: lttShowPageExperimentV2Variant,
    isExperimentResolving: isLttShowPageExperimentV2Resolving,
    isEligible: isLttShowPageExperimentV2Eligible,
  } = useABTesting({
    experimentId: 'LTT_SHOW_PAGE_EXPERIMENT_V2',
    customEligibilityCheckFn: () => checkIfLTTMB(uid) && !isMobile(),
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
