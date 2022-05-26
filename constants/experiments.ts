import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  NO_PROMO: 'Variant A',
  PROMO_5: 'Variant B',
  PROMO_10: 'Variant C',
};

export const EXPERIMENT_NAMES = {
  PROMO_EXPERIMENT: 'Promo Codes Experiment',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.PROMO_EXPERIMENT]: new Experiment(
    EXPERIMENT_NAMES.PROMO_EXPERIMENT,
    [VARIANTS.NO_PROMO, VARIANTS.PROMO_5, VARIANTS.PROMO_10],
    [33, 34, 33]
  ),
};
