import LocalizedStrings from 'react-localization';
import EN from 'const/localization/en';

/**
 * Warning: Do not use strings in any Server Side Methods, it might be overriden by parallel request on origin server.
 * pass localizedStrings down the Fn chain and use, localisedStrings is a scoped variable to the request and will not have above issue.
 */
export const strings = new LocalizedStrings({
  default: EN,
});
