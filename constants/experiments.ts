import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
  DEFAULT_HOMEPAGE: 'Control',
  CATEGORIES_HOMEPAGE: 'Treatment',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
  LTD_HOME_PAGE_EXPERIMENT: 'LTD Layout',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),
  [EXPERIMENT_NAMES.LTD_HOME_PAGE_EXPERIMENT]: new Experiment(
    EXPERIMENT_NAMES.LTD_HOME_PAGE_EXPERIMENT,
    [VARIANTS.DEFAULT_HOMEPAGE, VARIANTS.CATEGORIES_HOMEPAGE],
    [50, 50]
  ),
};
