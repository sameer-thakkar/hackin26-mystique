import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
  HIDE_NEXT_AVAILABLE_DATE: 'Hide Next Available Date',
  SHOW_NEXT_AVAILABLE_DATE: 'Show Next Available Date',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
  NEXT_AVAILABLE_DATE_EXPERIMENT: 'Next Available Date Experiment',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),
  [EXPERIMENT_NAMES.NEXT_AVAILABLE_DATE_EXPERIMENT]: new Experiment(
    EXPERIMENT_NAMES.NEXT_AVAILABLE_DATE_EXPERIMENT,
    [VARIANTS.HIDE_NEXT_AVAILABLE_DATE, VARIANTS.SHOW_NEXT_AVAILABLE_DATE],
    [20, 80]
  ),
};
