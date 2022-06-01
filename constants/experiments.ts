import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
  NO_PROMO: 'Variant A',
  PROMO_5: 'Variant B',
  PROMO_10: 'Variant C',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
  PROMO_EXPERIMENT: 'Promo Codes Experiment',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),
  [EXPERIMENT_NAMES.PROMO_EXPERIMENT]: new Experiment(
    EXPERIMENT_NAMES.PROMO_EXPERIMENT,
    [VARIANTS.NO_PROMO, VARIANTS.PROMO_5, VARIANTS.PROMO_10],
    [33, 34, 33]
  ),
};
