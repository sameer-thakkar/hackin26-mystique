import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
  CTA_COPY_MORE_DETAILS: 'Control',
  CTA_COPY_READ_MORE: 'Treatment',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
  CTA_COPY_EXPERIMENT: 'More Details CTA',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),
  [EXPERIMENT_NAMES.CTA_COPY_EXPERIMENT]: new Experiment(
    EXPERIMENT_NAMES.CTA_COPY_EXPERIMENT,
    [VARIANTS.CTA_COPY_READ_MORE, VARIANTS.CTA_COPY_MORE_DETAILS],
    [50, 50]
  ),
};
