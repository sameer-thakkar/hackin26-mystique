import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  OPEN_SELECT_PAGE_IN_SAME_TAB: 'Treatment',
  OPEN_SELECT_PAGE_IN_NEW_TAB: 'Control',
};

export const EXPERIMENT_NAMES = {
  NEW_TAB_EXPERIMENT: 'NEW TAB EXPERIMENT',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.NEW_TAB_EXPERIMENT]: new Experiment(
    EXPERIMENT_NAMES.NEW_TAB_EXPERIMENT,
    [
      VARIANTS.OPEN_SELECT_PAGE_IN_SAME_TAB,
      VARIANTS.OPEN_SELECT_PAGE_IN_NEW_TAB,
    ],
    [50, 50]
  ),
};
