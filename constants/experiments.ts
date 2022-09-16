import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
  SHOW_CASHBACK: 'Show Cashback',
  HIDE_CASHBACK: 'Hide Cashback',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
  CASHBACK_EFFICACY: 'Cashback Experiment',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),
  [EXPERIMENT_NAMES.CASHBACK_EFFICACY]: new Experiment(
    EXPERIMENT_NAMES.CASHBACK_EFFICACY,
    [VARIANTS.SHOW_CASHBACK, VARIANTS.HIDE_CASHBACK],
    [50, 50]
  ),
};
