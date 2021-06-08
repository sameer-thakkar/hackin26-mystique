import { EXPERIMENTS } from 'const/experiments';
import { isServer } from 'utils/gen';

import Analytics from '../analytics';

export const resolveBucket = (experiment, hsid) => {
  const sandboxId = hsid;
  if (!sandboxId) {
    console.log('null sandbox id', experiment.experimentName);
  }
  const uniqueId = sandboxId ? btoa(sandboxId) : null;
  return experiment.getBucket(uniqueId);
};

export const getABTestingVariant = (
  EXPERIMENT_TYPE: string,
  hsid,
  noTrack = false
) => {
  const experiment = EXPERIMENTS[EXPERIMENT_TYPE];
  const variant = resolveBucket(experiment, hsid);

  if (!noTrack && !isServer()) {
    const analytics = new Analytics();
    analytics.setVariableInDataLayer({
      eventName: 'Experiment Viewed',
      'Experiment Name': experiment.experimentName,
      'Experiment Variant': variant,
    });
  }

  return variant;
};

export const getExperimentVariables = (experimentName) =>
  ((window as any)?.experiments &&
    (window as any).experiments[experimentName]) ??
  {};
