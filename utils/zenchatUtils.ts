import { ZENDESK_CHAT } from 'const/index';

declare global {
  interface Window {
    zE?: (...args: any[]) => void;
    /**
     * attachEvent is only supported on IE - this handles cross-browser chat interactions
     */
    attachEvent?: (event: string, cb: () => void) => void;
  }
}

export const getZendeskChatbotID = () => ZENDESK_CHAT.LICENSE_KEY;

const canUseDOM = !(
  typeof window === 'undefined' ||
  !window.document ||
  !window.document.createElement
);

type Scope = 'messenger' | 'messenger:on' | 'messenger:set';
type ZendeskMethod =
  | 'show'
  | 'hide'
  | 'open'
  | 'close'
  | 'locale'
  | 'zIndex'
  | 'conversationFields';

export const ZendeskApi = (
  scope: Scope,
  method: ZendeskMethod,
  ...args: Array<unknown>
) => {
  if (canUseDOM && window.zE) {
    return window.zE.apply(null, [scope, method, ...args]);
  }
};

const onZenchatLoaded = () => {
  ZendeskApi('messenger', 'show');
  ZendeskApi('messenger', 'close');
};

export const initializeZenchat = () => {
  const zendeskChatBotID = getZendeskChatbotID() || '';
  if (
    zendeskChatBotID &&
    typeof window !== 'undefined' &&
    typeof window.zE === 'undefined'
  ) {
    const appendScript = () => {
      /**
       * Makes sure that the script addition is not blocking the main thread
       */
      requestAnimationFrame(() => {
        const zenchatScript = document.createElement('script');
        zenchatScript.id = 'ze-snippet';
        zenchatScript.type = 'text/javascript';
        zenchatScript.onload = onZenchatLoaded;
        zenchatScript.src = `https://static.zdassets.com/ekr/snippet.js?key=${zendeskChatBotID}`;

        const firstScript = document.getElementsByTagName('script')[0];
        firstScript?.parentNode?.insertBefore(zenchatScript, firstScript);
      });
    };

    if (document.readyState === 'complete') {
      appendScript();
    } else if (
      window?.attachEvent &&
      typeof window?.attachEvent === 'function' //IE-handling
    ) {
      window?.attachEvent?.('onload', appendScript);
    } else {
      window?.addEventListener('load', appendScript, false);
    }
  }
};

export const hideZendeskChatWidget = () => {
  ZendeskApi('messenger', 'show');
  ZendeskApi('messenger', 'hide');
};
