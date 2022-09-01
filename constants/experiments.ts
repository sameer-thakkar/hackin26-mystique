import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
  SHOW_LOCALISED_CURRENCY: 'Treatment',
  SHOW_DEFAULT_CURRENCY: 'Control',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
  LOCAL_CURRENCY_Experiment: 'Localised Currency Experiment',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),

  [EXPERIMENT_NAMES.LOCAL_CURRENCY_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LOCAL_CURRENCY_Experiment,
    [VARIANTS.SHOW_LOCALISED_CURRENCY, VARIANTS.SHOW_DEFAULT_CURRENCY],
    [50, 50]
  ),
};
