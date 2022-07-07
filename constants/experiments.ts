import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  SHOWPAGE_REDIRECT: 'LP to showpage',
  CHECKOUT_REDIRECT: 'LP to booking page',
  CONTROL: 'Control',
  TREATMENT: 'Treatment',
};

export const EXPERIMENT_NAMES = {
  LTD_LP_Experiment: 'LTD LP Experiment',
  CTA_TEST_MB: 'CTA Test on MBs',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.LTD_LP_Experiment]: new Experiment(
    EXPERIMENT_NAMES.LTD_LP_Experiment,
    [VARIANTS.SHOWPAGE_REDIRECT, VARIANTS.CHECKOUT_REDIRECT],
    [50, 50]
  ),
  [EXPERIMENT_NAMES.CTA_TEST_MB]: new Experiment(
    EXPERIMENT_NAMES.CTA_TEST_MB,
    [VARIANTS.CONTROL, VARIANTS.TREATMENT],
    [50, 50]
  ),
};
