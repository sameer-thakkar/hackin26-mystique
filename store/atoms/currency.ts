import { atom } from 'recoil';
import Cookies from 'js-cookie';
import { COOKIE, TIME } from 'const/index';

const cookiesSideEffect = () => ({ setSelf, onSet }) => {
  if (typeof window === 'undefined') return;

  const savedValue = Cookies.get(COOKIE.CURRENT_CURRENCY);
  if (savedValue != null) {
    setSelf(savedValue);
  }

  onSet((newValue, _, isReset) => {
    const host = window.location.host;
    const isDev = host?.includes('localhost');
    const hostParts = host.split('.');
    hostParts.splice(0, 1, '');
    const nakedDomain = hostParts.join('.');

    if (isReset) {
      Cookies.remove(COOKIE.CURRENT_CURRENCY);
    } else if (Cookies.get(COOKIE.CURRENT_CURRENCY) !== newValue) {
      Cookies.set(COOKIE.CURRENT_CURRENCY, newValue, {
        domain: isDev ? null : nakedDomain,
        expires: new Date().getTime() + TIME.SECONDS_IN_YEARS * 1,
      });
    }
  });
};

export const currencyAtom = atom({
  key: 'activeCurrency',
  default: null,
  effects: [cookiesSideEffect()],
});
