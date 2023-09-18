import { isServer } from 'utils/gen';
import { EXPERIMENTS, VARIANTS } from 'const/experiments';
import {
  ANALYTICS_EVENTS,
  GUIDED_TOUR_PRODUCT_CARD_REVAMP_EXPERIMENT,
} from 'const/index';
import { trackEvent } from '../analytics';
import type Experiment from './experiment';

export const resolveBucket = (experiment: Experiment, hsid: string) => {
  const sandboxId = hsid;
  if (!sandboxId) {
    // eslint-disable-next-line no-console
    console.log('null sandbox id', experiment.experimentName);
  }
  const uniqueId = sandboxId ? btoa(sandboxId) : null;
  return experiment.getBucket(uniqueId);
};

const mobileVariants = {
  [VARIANTS.SHOWPAGE_REDIRECT]: 'Control',
  [VARIANTS.CHECKOUT_REDIRECT]: 'LP to booking page',
};

export const getABTestingVariant = ({
  expName,
  hsid,
  noTrack = false,
  mobileName = false,
  eventProperties = {},
}: {
  expName: string;
  hsid: any;
  noTrack?: boolean;
  mobileName?: boolean;
  eventProperties?: Record<string, any>;
}) => {
  const experiment = EXPERIMENTS[expName];
  const variant = resolveBucket(experiment, hsid);

  if (!noTrack && !isServer()) {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIMENT_VIEWED,
      'Experiment Name':
        mobileName && mobileVariants?.[experiment.experimentName]
          ? mobileVariants[experiment.experimentName]
          : experiment.experimentName,
      'Experiment Variant': variant,
      ...eventProperties,
    });
  }

  return variant;
};

export const getExperimentVariables = (experimentName: string) =>
  ((window as any)?.experiments &&
    (window as any).experiments[experimentName]) ??
  {};

export const reorderProducts = ({
  productList,
  uid,
  tourRankingExpVariant,
}: {
  productList: any[];
  uid: string;
  tourRankingExpVariant?: string | null;
}) => {
  if (
    !Object.keys(GUIDED_TOUR_PRODUCT_CARD_REVAMP_EXPERIMENT).includes(uid) ||
    tourRankingExpVariant === VARIANTS.CONTROL
  )
    return productList;
  if (!tourRankingExpVariant) return productList;
  let reorderedArray = [
    ...productList.filter(
      ({ tgid }: { tgid: number }) =>
        GUIDED_TOUR_PRODUCT_CARD_REVAMP_EXPERIMENT[uid].id === tgid
    ),
    ...productList.filter(
      ({ tgid }: { tgid: number }) =>
        GUIDED_TOUR_PRODUCT_CARD_REVAMP_EXPERIMENT[uid].id !== tgid
    ),
  ];
  return reorderedArray.map((product: { tgid: number }) => {
    if (GUIDED_TOUR_PRODUCT_CARD_REVAMP_EXPERIMENT[uid].id === product.tgid)
      return { ...product, isSpecialGuidedTour: true };
    return product;
  });
};

export const getProductRanking = ({
  products,
  uid,
}: {
  products: any[];
  uid: string;
}) => {
  return products.findIndex(
    ({ tgid }: { tgid: number }) =>
      GUIDED_TOUR_PRODUCT_CARD_REVAMP_EXPERIMENT[uid].id === tgid
  );
};
