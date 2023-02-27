import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
  SHOW_VIDEO: 'Show Video',
  HIDE_VIDEO: 'Hide Video',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
  MEDIAUPGRADE_VIDEO_EXPERIMENT: 'Media Upgrade Video Experiment',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),
  [EXPERIMENT_NAMES.MEDIAUPGRADE_VIDEO_EXPERIMENT]: new Experiment(
    EXPERIMENT_NAMES.MEDIAUPGRADE_VIDEO_EXPERIMENT,
    [VARIANTS.SHOW_VIDEO, VARIANTS.HIDE_VIDEO],
    [50, 50]
  ),
};
