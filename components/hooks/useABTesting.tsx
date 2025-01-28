import React, { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { getABTestingVariant } from 'utils/experiments/experimentUtils';
import { appAtom } from 'store/atoms/app';
import { hsidAtom, hsidSetFailAtom } from 'store/atoms/hsid';
import { EXPERIMENT_NAMES, EXPERIMENTS, VARIANTS } from 'const/experiments';
import { QUERY_PARAMS } from 'const/index';

const DEFAULT_VARIANT = 'DEFAULT_VARIANT';
/**
 * Hook to get A/B Testing variant for `EXPERIMENT_TYPE` _(see - src/constants/experiments.js)_
 */
type TUseABTestingProps<T> = {
  experimentId: T;
  noTrack?: boolean;
  additionalEventProps?: Record<string, any> | (() => Record<string, any>);
  customEligibilityCheckFn?: () => boolean;
};
const useABTesting = <T extends keyof typeof EXPERIMENT_NAMES>({
  experimentId: experimentNameKey,
  noTrack = false,
  additionalEventProps,
  customEligibilityCheckFn,
}: TUseABTestingProps<T>) => {
  const {
    query: { [QUERY_PARAMS.EXPERIMENT_OVERRIDE]: experimentOverride },
  } = useRouter();
  const experimentName = EXPERIMENT_NAMES[experimentNameKey];
  const experimentObject = EXPERIMENTS[experimentName];
  /**
   * identifes and avoids experiment resolution flow for full rollout, [100, 0]/[0, 100] cases.
   */
  const fullRolloutIndex = experimentObject?.bucketWeight.indexOf(100);
  const fullRolloutVariant =
    experimentObject?.bucketName[fullRolloutIndex] || '';

  let experimentOverrideVariant = null;
  if (
    experimentOverride === VARIANTS.CONTROL ||
    experimentOverride === VARIANTS.TREATMENT
  )
    experimentOverrideVariant = experimentOverride;
  else if (
    typeof experimentOverride === 'string' &&
    experimentOverride.substring(0, 3).toLowerCase() ===
      experimentNameKey.substring(0, 3).toLowerCase()
    // Here we are comparing the first 3 letters of the experiment name to the override experiment query
  )
    experimentOverrideVariant = experimentOverride.substring(4);
  const [variant, setVariant] = React.useState<string | null>(
    experimentOverrideVariant || fullRolloutVariant || DEFAULT_VARIANT
  );
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
    if (
      !sandboxId ||
      variant !== DEFAULT_VARIANT ||
      isHsidSetFail ||
      isBot ||
      !isEligible
    )
      return;

    const eventProperties =
      additionalEventProps instanceof Function
        ? additionalEventProps()
        : additionalEventProps;

    const abTestingVariant = getABTestingVariant({
      expName: experimentName,
      hsid: sandboxId,
      noTrack: !shouldTrack.current,
      eventProperties,
    });

    // Ensure you avoid tracking on any re-render. (failsafe, ideally should not be required)
    shouldTrack.current = false;

    if (!experimentOverrideVariant) {
      setVariant(abTestingVariant);
    }
  }, [
    experimentNameKey,
    sandboxId,
    additionalEventProps,
    variant,
    isHsidSetFail,
    isBot,
    experimentOverrideVariant,
    experimentName,
    isEligible,
  ]);

  return {
    variant,
    isEligible,
    isExperimentResolving: variant === DEFAULT_VARIANT,
  };
};

export default useABTesting;
