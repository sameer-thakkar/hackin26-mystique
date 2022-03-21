import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  /**
   * Growth Experiment 7
   */
  DEFAULT_BANNER_CAROUSEL: 'Variant A',
  NEW_BANNER_CAROUSEL_WITHOUT_CTA: 'Variant B',
  NEW_BANNER_CAROUSEL_WITH_CTA: 'Variant C',
};

export const EXPERIMENT_NAMES = {
  /**
   * Growth Experiment 7
   * @see https://www.notion.so/headouthub/Growth-Experiments-7f4eeeeeae874220a9a66e30f5ed4800#7e1219c841de484e9a8f93389f9c856f
   */
  GROWTH_EXPERIMENT_7: 'Product Card And Carousel Experiment',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.GROWTH_EXPERIMENT_7]: new Experiment(
    EXPERIMENT_NAMES.GROWTH_EXPERIMENT_7,
    [
      VARIANTS.DEFAULT_BANNER_CAROUSEL,
      VARIANTS.NEW_BANNER_CAROUSEL_WITHOUT_CTA,
      VARIANTS.NEW_BANNER_CAROUSEL_WITH_CTA,
    ],
    [50, 0, 50]
  ),
};
