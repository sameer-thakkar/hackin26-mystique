/* eslint-disable no-console */
import { ANALYTICS_PROPERTIES } from 'const/index';

declare global {
  interface Window {
    dataLayer: Array<any>;
  }
}

export const trackEvent = ({ eventName, ...labelProps }) => {
  if (typeof window === 'undefined') return;
  if (!window.dataLayer) {
    console.group('trackEvent failed!');
    console.log({ eventName, labelProps });
    console.groupEnd();
    return;
  }
  const allProps = {
    event: eventName,
    ...labelProps,
  };
  window.dataLayer.push(allProps);
};

export const sendVariableToDataLayer = ({ name, value }) => {
  if (typeof window === 'undefined') return;
  const dLRef = typeof window !== 'undefined' ? window.dataLayer : [];
  if (!dLRef) {
    console.group('sendVariableToDataLayer failed!');
    console.log({ name, value });
    console.groupEnd();
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

export const getCommonEventMetaData = (pageMetaData) => {
  return {
    [ANALYTICS_PROPERTIES.COLLECTION_ID]: pageMetaData.collectionId,
    [ANALYTICS_PROPERTIES.COLLECTION_NAME]: pageMetaData.collectionName,
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData.pageType,
    [ANALYTICS_PROPERTIES.PAGE_TITLE]: pageMetaData.pageTitle,
  };
};
