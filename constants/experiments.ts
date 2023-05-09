import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
  HIDE_CASHBACK_COMPONENT: 'Control',
  SHOW_CASHBACK_COMPONENT: 'Treatment',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
  REVAMPED_CASHBACK_EXPERIMENT: 'Revamped Cashback Experiment',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),
  [EXPERIMENT_NAMES.REVAMPED_CASHBACK_EXPERIMENT]: new Experiment(
    EXPERIMENT_NAMES.REVAMPED_CASHBACK_EXPERIMENT,
    [VARIANTS.HIDE_CASHBACK_COMPONENT, VARIANTS.SHOW_CASHBACK_COMPONENT],
    [50, 50]
  ),
};
