import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),
};
