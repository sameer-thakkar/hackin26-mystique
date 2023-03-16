import React from 'react';
import useWindowSize from 'hooks/useWindowSize';
import { LIVE_CHAT } from 'const/index';
import { loadChat } from 'utils/chatUtils';
import { checkIfGpMotorTickets } from 'utils/helper';

type LiveChatProps = {
  uid?: string;
};

const LiveChat: React.FC<LiveChatProps> = ({ uid }) => {
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const isMobile = useWindowSize().width < 768;

  React.useEffect(() => {
    setTimeout(() => {
      loadChat({
        isDelayed: false,
        hideChatBubble: isMobile && !checkIfGpMotorTickets(uid),
      });
    }, LIVE_CHAT.DELAY);
  }, [isMobile, uid]);

  return null;
};

export default LiveChat;
