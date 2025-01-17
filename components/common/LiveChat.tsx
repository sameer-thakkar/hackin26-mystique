import React from 'react';
import useWindowSize from 'hooks/useWindowSize';
import { loadChat } from 'utils/chatUtils';
import { checkIfGpMotorTicketsMB } from 'utils/helper';
import { COOKIE_BANNER_KEY, LIVE_CHAT } from 'const/index';

type LiveChatProps = {
  uid?: string;
};

const LiveChat: React.FC<React.PropsWithChildren<LiveChatProps>> = ({
  uid,
}) => {
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const isMobile = useWindowSize().width < 768;

  React.useEffect(() => {
    const cookieKeyExists = !!window.localStorage.getItem(COOKIE_BANNER_KEY);
    if (cookieKeyExists) {
      setTimeout(() => {
        loadChat({
          isDelayed: false,
          hideChatBubble: isMobile && !checkIfGpMotorTicketsMB(uid),
        });
      }, LIVE_CHAT.DELAY);
    } else {
      let startedLoading = false;

      const interval = setInterval(() => {
        const cookieBannerState =
          window.localStorage.getItem(COOKIE_BANNER_KEY);
        const cookieBannerShown =
          cookieBannerState &&
          ['shown', 'not compliant'].includes(cookieBannerState);
        if (startedLoading) {
          clearInterval(interval);
          return;
        }
        if (cookieBannerShown) {
          loadChat({
            isDelayed: false,
            hideChatBubble: isMobile && !checkIfGpMotorTicketsMB(uid),
          });
          startedLoading = true;
        }
      }, LIVE_CHAT.DELAY);
    }
  }, [isMobile, uid]);

  return null;
};

export default LiveChat;
