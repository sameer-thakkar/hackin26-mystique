import React from 'react';
import useWindowSize from 'hooks/useWindowSize';
import { checkIfGpMotorTicketsMB } from 'utils/helper';
import { initializeZenchat, ZendeskApi } from 'utils/zenchatUtils';
import { COOKIE_BANNER_KEY, ZENDESK_CHAT } from 'const/index';

interface IZendeskChat {
  uid?: string;
  isLttMonthOnMonthPage?: boolean;
}

let timeoutId: NodeJS.Timeout;
const ZendeskChat: React.FC<IZendeskChat> = (props) => {
  const { uid, isLttMonthOnMonthPage } = props;

  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const isMobile = useWindowSize()?.width < 768;
  const isChatInitializedRef = React.useRef(false);
  const shouldHideZenchatWidget = React.useMemo(() => {
    const cookieBannerShown =
      typeof window !== 'undefined' &&
      Boolean(window?.localStorage?.getItem(COOKIE_BANNER_KEY));

    return (
      (isMobile && !checkIfGpMotorTicketsMB(uid)) ||
      !cookieBannerShown ||
      isLttMonthOnMonthPage
    );
  }, [isMobile, uid, isLttMonthOnMonthPage]);

  /**
   * Enables the zendesk widget
   */
  const showWidget = React.useCallback(() => {
    ZendeskApi('messenger', 'show');
  }, []);

  /**
   * Hides the zendesk widget
   */
  const hideWidget = React.useCallback(() => {
    ZendeskApi('messenger', 'hide');
  }, []);

  React.useEffect(() => {
    if (shouldHideZenchatWidget) return;
    if (!isChatInitializedRef.current) {
      timeoutId = setTimeout(initializeZenchat, ZENDESK_CHAT.DELAY);
      isChatInitializedRef.current = true;
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        isChatInitializedRef.current = false;
      }
    };
  }, [shouldHideZenchatWidget]);

  React.useEffect(() => {
    if (shouldHideZenchatWidget) {
      hideWidget();
    } else {
      showWidget();
    }
  }, [hideWidget, shouldHideZenchatWidget, showWidget]);

  return null;
};

export default ZendeskChat;
