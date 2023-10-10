import { isServer } from 'utils/gen';
import { EXPERIMENTS, VARIANTS } from 'const/experiments';
import {
  ANALYTICS_EVENTS,
} from 'const/index';
import { trackEvent } from '../analytics';
import type Experiment from './experiment';

export const resolveBucket = (experiment: Experiment, hsid: string) => {
  const sandboxId = hsid;
  if (!sandboxId) {
    // eslint-disable-next-line no-console
    console.log('null sandbox id', experiment.experimentName);
  }
  const uniqueId = sandboxId ? btoa(sandboxId) : null;
  return experiment.getBucket(uniqueId);
};

const mobileVariants = {
  [VARIANTS.SHOWPAGE_REDIRECT]: 'Control',
  [VARIANTS.CHECKOUT_REDIRECT]: 'LP to booking page',
};

export const getABTestingVariant = ({
  expName,
  hsid,
  noTrack = false,
  mobileName = false,
  eventProperties = {},
}: {
  expName: string;
  hsid: any;
  noTrack?: boolean;
  mobileName?: boolean;
  eventProperties?: Record<string, any>;
}) => {
  const experiment = EXPERIMENTS[expName];
  const variant = resolveBucket(experiment, hsid);

  if (!noTrack && !isServer()) {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIMENT_VIEWED,
      'Experiment Name':
        mobileName && mobileVariants?.[experiment.experimentName]
          ? mobileVariants[experiment.experimentName]
          : experiment.experimentName,
      'Experiment Variant': variant,
      ...eventProperties,
    });
  }

  return variant;
};

export const getExperimentVariables = (experimentName: string) =>
  ((window as any)?.experiments &&
    (window as any).experiments[experimentName]) ??
  {};