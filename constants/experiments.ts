import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
  SHOW_PROMOS: 'Treatment',
  DONT_SHOW_PROMOS: 'Control',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
  LTD_PROMOS_AND_DISCOUNT: 'New Product Cards Staged Rollout',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),
  [EXPERIMENT_NAMES.LTD_PROMOS_AND_DISCOUNT]: new Experiment(
    EXPERIMENT_NAMES.LTD_PROMOS_AND_DISCOUNT,
    [VARIANTS.SHOW_PROMOS, VARIANTS.DONT_SHOW_PROMOS],
    [20, 80]
  ),
};
