import React, { useEffect, useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { getABTestingVariant } from 'utils/experiments/experimentUtils';
import { appAtom } from 'store/atoms/app';
import { hsidAtom, hsidSetFailAtom } from 'store/atoms/hsid';
import { EXPERIMENT_NAMES } from 'const/experiments';

const DEFAULT_VARIANT = 'DEFAULT_VARIANT';
/**
 * Hook to get A/B Testing variant for `EXPERIMENT_TYPE` _(see - src/constants/experiments.js)_
 */
type TUseABTestingProps<T> = {
  experimentId: T;
  noTrack?: boolean;
  additionalEventProps?: any;
  customEligibilityCheckFn?: () => boolean;
};
const useABTesting = <T extends keyof typeof EXPERIMENT_NAMES>({
  experimentId: experimentNameKey,
  noTrack = false,
  additionalEventProps,
  customEligibilityCheckFn,
}: TUseABTestingProps<T>) => {
  const [variant, setVariant] = React.useState<string | null>(DEFAULT_VARIANT);
  const shouldTrack = useRef(!noTrack);
  const sandboxId = useRecoilValue(hsidAtom);
  const isHsidSetFail = useRecoilValue(hsidSetFailAtom);
  const { isBot } = useRecoilValue(appAtom);
  const isEligible = useMemo(() => {
    let isEligible = !isBot; // Experiments doesn't apply for Bots. (Always Show Control.)
    isEligible = isEligible && !isHsidSetFail; // if HSID setter fails, skip experiment.
    if (customEligibilityCheckFn)
      isEligible = isEligible && customEligibilityCheckFn();

    return isEligible;
  }, [isBot, isHsidSetFail, customEligibilityCheckFn]);

  useEffect(() => {
    if (!isEligible) setVariant(null);
  }, [isEligible]);

  useEffect(() => {
    if (!sandboxId || variant !== DEFAULT_VARIANT || isHsidSetFail || isBot)
      return;
    const abTestingVariant = getABTestingVariant({
      expName: EXPERIMENT_NAMES[experimentNameKey],
      hsid: sandboxId,
      noTrack: !shouldTrack.current,
      eventProperties: additionalEventProps,
    });

    // Ensure you avoid tracking on any re-render. (failsafe, ideally should not be required)
    shouldTrack.current = false;

    setVariant(abTestingVariant);
  }, [
    experimentNameKey,
    sandboxId,
    additionalEventProps,
    variant,
    isHsidSetFail,
    isBot,
  ]);

  return {
    variant,
    isEligible,
    isExperimentResolving: variant === DEFAULT_VARIANT,
  };
};

export default useABTesting;
