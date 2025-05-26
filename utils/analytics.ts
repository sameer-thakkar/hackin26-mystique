import { BoosterType } from 'components/Product/interface';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, MYSTIQUE } from 'const/index';

declare global {
  interface Window {
    dataLayer: Array<any>;
  }
}

export type TGenericObject = Record<string, any>;

export type TDatalayerValue = any;

export type TDatalayerObject = Record<string, TDatalayerValue>;

export type TAnalyticsEvents =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type TTrackEvent = {
  eventName: string;
  [x: string]: TDatalayerValue;
};

export const trackEvent = ({ eventName, ...labelProps }: TTrackEvent) => {
  if (typeof window === 'undefined') return;
  if (!window.dataLayer) {
    // console.group('trackEvent failed!');
    // eslint-disable-next-line no-console
    console.log({ eventName, labelProps });
    // console.groupEnd();
    return;
  }
  const allProps = {
    event: eventName,
    ...labelProps,
    [ANALYTICS_PROPERTIES.CONTAINER]: MYSTIQUE,
  };
  window.dataLayer.push(allProps);
};

export const sendVariableToDataLayer = ({
  name,
  value,
}: {
  name: string;
  value: TDatalayerValue;
}) => {
  if (typeof window === 'undefined') return;

  if (window.dataLayer === undefined) {
    window.dataLayer = [];
  }

  const dLRef = typeof window !== 'undefined' ? window.dataLayer : [];
  if (!dLRef) {
    //  console.group('sendVariableToDataLayer failed!');
    //  console.groupEnd();
    return;
  }
  const lastVariableEntry =
    dLRef[dLRef.map((prop) => Object.keys(prop)[0]).lastIndexOf(name)];
  if (lastVariableEntry && Object.values(lastVariableEntry)[0] === value)
    return;
  dLRef.push({
    [name]: value,
  });
};

export const getCommonEventMetaData = (pageMetaData: TDatalayerObject) => {
  return {
    [ANALYTICS_PROPERTIES.COLLECTION_ID]: pageMetaData.collectionId,
    [ANALYTICS_PROPERTIES.COLLECTION_NAME]: pageMetaData.collectionName,
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData.pageType,
    [ANALYTICS_PROPERTIES.PAGE_TITLE]: pageMetaData.pageTitle,
  };
};

export const sendVariablesToDataLayer = (variablesMap: TDatalayerObject) => {
  Object.keys(variablesMap)
    .filter((k) => variablesMap[k])
    .forEach((key) => {
      sendVariableToDataLayer({
        name: key,
        value: variablesMap[key],
      });
    });
};

export const getProductCommonProperties = ({
  primaryCategory,
  primaryCollection,
  primarySubCategory,
  reviewsDetails,
  boosterType,
}: {
  primaryCategory?: TGenericObject;
  primaryCollection?: TGenericObject;
  primarySubCategory?: TGenericObject;
  reviewsDetails?: TGenericObject;
  boosterType?: keyof typeof BoosterType | null;
}): Record<string, number | string> => {
  return {
    ...(primaryCategory && {
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.displayName,
    }),
    ...(primarySubCategory && {
      [ANALYTICS_PROPERTIES.SUB_CAT_ID]: primarySubCategory?.id,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: primarySubCategory?.displayName,
    }),
    ...(primaryCollection && {
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: primaryCollection?.id,
      [ANALYTICS_PROPERTIES.COLLECTION_NAME]: primaryCollection?.displayName,
    }),
    ...(reviewsDetails && {
      [ANALYTICS_PROPERTIES.AVERAGE_RATING]: reviewsDetails?.averageRating,
      [ANALYTICS_PROPERTIES.NUMBER_OF_RATINGS]: reviewsDetails?.ratingsCount,
    }),
    ...(boosterType && {
      [ANALYTICS_PROPERTIES.BOOSTER_NAME]: BoosterType[boosterType],
    }),
  };
};

export type TDlValue = string | number | boolean | null | undefined;
type TDlProperty = Record<string, TDlValue>;

export const createTrackingHandler =
  (eventName: string, additionalProps?: TDlProperty) =>
  (properties?: TDlProperty) =>
    trackEvent({
      eventName,
      ...additionalProps,
      ...properties,
    });
