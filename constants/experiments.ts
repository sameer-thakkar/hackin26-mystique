import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
  CONTROL: 'Control',
  TREATMENT: 'Treatment',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
  LTT_LP_REVAMP_EXPERIMENT: 'LTT Landing Page Revamp Experiment',
  LAST_MINUTE_FILTERS_EXPERIMENT: 'Last Minute Filters Experiment',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),
  [EXPERIMENT_NAMES.LTT_LP_REVAMP_EXPERIMENT]: new Experiment(
    EXPERIMENT_NAMES.LTT_LP_REVAMP_EXPERIMENT,
    [VARIANTS.CONTROL, VARIANTS.TREATMENT],
    [90, 10]
  ),
  [EXPERIMENT_NAMES.LAST_MINUTE_FILTERS_EXPERIMENT]: new Experiment(
    EXPERIMENT_NAMES.LAST_MINUTE_FILTERS_EXPERIMENT,
    [VARIANTS.CONTROL, VARIANTS.TREATMENT],
    [0, 100]
  ),
};
