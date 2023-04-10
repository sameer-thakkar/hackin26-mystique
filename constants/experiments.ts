import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
  SHOW_BANNER: 'Treatment',
  HIDE_BANNER: 'Control',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
  LTT_EASTER_PHASED_ROLLOUT: 'Ltt Easter Phased Rollout',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),
  [EXPERIMENT_NAMES.LTT_EASTER_PHASED_ROLLOUT]: new Experiment(
    EXPERIMENT_NAMES.LTT_EASTER_PHASED_ROLLOUT,
    [VARIANTS.SHOW_BANNER, VARIANTS.HIDE_BANNER],
    [20, 80]
  ),
};
