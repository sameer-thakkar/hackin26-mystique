import { LIVE_CHAT } from 'const/index';

declare global {
  interface Window {
    LC_API: any;
    __lc: any;
    livechat_chat_started: any;
  }
}

const chatLoaded = () => {
  if (window.LC_API) {
    window.LC_API.on_before_load = () => {
      window.LC_API.hide_chat_window();
    };
  }
};

const loadLiveChatScript = (isDelayed: boolean) => {
  const lc = document.createElement('script');
  lc.type = 'text/javascript';
  lc.defer = true;
  lc.src = 'https://cdn.livechatinc.com/tracking.js';
  const s = document.getElementsByTagName('script')[0];
  if (s) {
    s?.parentNode?.insertBefore(lc, s);
  }
  if (isDelayed) {
    lc.addEventListener('load', chatLoaded);
  }
};

export const loadChat = ({
  isDelayed,
  hideChatBubble,
}: {
  isDelayed: boolean;
  hideChatBubble: boolean;
}) => {
  (window as any).__lc = window.__lc || {};
  window.__lc.license = LIVE_CHAT.LICENCE_KEY;
  if (hideChatBubble) {
    window.LC_API = window.LC_API || {};
    window.livechat_chat_started = false;
    window.LC_API.on_before_load = function () {
      window.LC_API.hide_chat_window();
    };
    window.LC_API.on_chat_started = function () {
      window.livechat_chat_started = true;
    };
    window.LC_API.on_chat_window_minimized = function () {
      window.LC_API.hide_chat_window();
    };
    loadLiveChatScript(isDelayed);
  } else if (!window.LC_API) {
    loadLiveChatScript(isDelayed);
  }
};
