import { ANALYTICS_EVENTS } from 'const/index';
import { EXPERIMENTS } from 'const/experiments';
import { isServer } from 'utils/gen';
import { VARIANTS } from 'const/experiments';
import { trackEvent } from '../analytics';

export const resolveBucket = (experiment, hsid) => {
  const sandboxId = hsid;
  if (!sandboxId) {
    console.log('null sandbox id', experiment.experimentName);
  }
  const uniqueId = sandboxId ? btoa(sandboxId) : null;
  return experiment.getBucket(uniqueId);
};

const mobileVariants = {
  [VARIANTS.SHOWPAGE_REDIRECT]: 'Control', 
  [VARIANTS.CHECKOUT_REDIRECT]: 'LP to booking page',
}

export const getABTestingVariant = (
  EXPERIMENT_TYPE: string,
  hsid,
  noTrack = false,
  mobileName = false,
) => {
  const experiment = EXPERIMENTS[EXPERIMENT_TYPE];
  const variant = resolveBucket(experiment, hsid);

  if (!noTrack && !isServer()) {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIMENT_VIEWED,
      'Experiment Name': mobileName && mobileVariants?.[experiment.experimentName] ? mobileVariants[experiment.experimentName] : experiment.experimentName,
      'Experiment Variant': variant,
    });
  }

  return variant;
};

export const getExperimentVariables = (experimentName) =>
  ((window as any)?.experiments &&
    (window as any).experiments[experimentName]) ??
  {};
