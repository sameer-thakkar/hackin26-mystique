import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
  IMGIX_CONTROL: 'Control',
  IMGIX_TREATMENT: 'Treatment',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
  IMGIX_EXPERIMENT: 'Imgix experiment',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),
  [EXPERIMENT_NAMES.IMGIX_EXPERIMENT]: new Experiment(
    EXPERIMENT_NAMES.IMGIX_EXPERIMENT,
    [VARIANTS.IMGIX_CONTROL, VARIANTS.IMGIX_TREATMENT],
    [80, 20]
  ),
};
