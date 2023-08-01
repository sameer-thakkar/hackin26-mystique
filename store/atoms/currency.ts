import { atom } from 'recoil';
import Cookies from 'js-cookie';
import { COOKIE, TIME } from 'const/index';

const cookiesSideEffect = () => ({ setSelf, onSet }: any) => {
  if (typeof window === 'undefined') return;

  const savedValue = Cookies.get(COOKIE.CURRENT_CURRENCY);
  if (savedValue != null) {
    setSelf(savedValue);
  }

  onSet((newValue: any, _: any, isReset: any) => {
    const host = window.location.host;
    const isDev = host?.includes('localhost');
    const hostParts = host.split('.');
    hostParts.splice(0, 1, '');
    const nakedDomain = hostParts.join('.');

    if (isReset) {
      Cookies.remove(COOKIE.CURRENT_CURRENCY);
    } else if (Cookies.get(COOKIE.CURRENT_CURRENCY) !== newValue) {
      Cookies.set(COOKIE.CURRENT_CURRENCY, newValue, {
        // @ts-expect-error TS(2322): Type 'string | null' is not assignable to type 'st... Remove this comment to see the full error message
        domain: isDev ? null : nakedDomain,
        expires: new Date().getTime() + TIME.SECONDS_IN_YEARS * 1,
      });
    }
  });
};

export const currencyAtom = atom<string | null>({
  key: 'activeCurrency',
  default: null,
  effects: [cookiesSideEffect()],
});
