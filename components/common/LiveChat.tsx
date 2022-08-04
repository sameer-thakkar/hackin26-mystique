import React from 'react';
import useWindowSize from 'hooks/useWindowSize';
import { LIVE_CHAT } from 'const/index';
import { loadChat } from 'utils/chatUtils';

const LiveChat = () => {
  const isMobile = useWindowSize().width < 768;

  React.useEffect(() => {
    setTimeout(() => {
      loadChat({
        isDelayed: false,
        hideChatBubble: isMobile,
      });
    }, LIVE_CHAT.DELAY);
  }, [isMobile]);

  return null;
};

export default LiveChat;
