import {
  ANALYTICS_PLATFORM,
  ANALYTICS_PROPERTIES,
  CUSTOM_TYPES,
  DOCUMENT_READY_STATES,
} from 'const/index';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { appAtom } from 'store/atoms/app';
import { gtmAtom } from 'store/atoms/gtm';
import { hsidAtom } from 'store/atoms/hsid';
import { sendVariableToDataLayer } from 'utils/analytics';
import { withShortcodes } from 'utils/helper';

const Analytics = ({ contentType, cmsContent }: any) => {
  const [{ eventsReady }, setEventsReady] = useRecoilState(gtmAtom);
  const hsid = useRecoilState(hsidAtom);
  const [appState, setAppState] = useRecoilState(appAtom);

  useEffect(() => {
    // GTM Universal Properties
    const customType = contentType;
    if (!customType || !hsid || eventsReady) return;

    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.PLATFORM_NAME,
      value:
        window.outerWidth < 768
          ? ANALYTICS_PLATFORM.MOBILE
          : ANALYTICS_PLATFORM.DESKTOP,
    });

    const pageHeading =
      customType === CUSTOM_TYPES.MICROSITE
        ? cmsContent?.data?.data?.heading
        : cmsContent?.data?.featured_title;
    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.PAGE_HEADING,
      value: withShortcodes(pageHeading).join(''),
    });

    setEventsReady({ eventsReady: true });
  }, [hsid]);

  useEffect(() => {
    const setPageLoaded = () => {
      setAppState({ ...appState, isPageLoaded: true });
    };

    /* fix for safari: page getting loaded even before listener was attached */
    if (
      document.readyState === DOCUMENT_READY_STATES.INTERACTIVE ||
      document.readyState === DOCUMENT_READY_STATES.COMPLETE
    ) {
      setPageLoaded();
    } else {
      window.addEventListener('DOMContentLoaded', setPageLoaded);
      return () =>
        window.removeEventListener('DOMContentLoaded', setPageLoaded);
    }
  }, []);

  return null;
};

export default Analytics;
