import { atom } from 'recoil';
import Cookies from 'js-cookie';
import { COOKIE, TIME } from 'const/index';

const localStorageEffect = (key) => ({ setSelf, onSet }) => {
  if (typeof window === 'undefined') return;

  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue, _, isReset) => {
    const host = window.location.host;
    const hostParts = host.split('.');
    hostParts.splice(0, 1, 'book');
    const bookSubdomain = hostParts.join('.');

    Cookies.set(COOKIE.CURRENT_CURRENCY, newValue, {
      domain: bookSubdomain,
      expires: new Date().getTime() + TIME.SECONDS_IN_YEARS * 1,
    });
    isReset
      ? localStorage.removeItem(key)
      : localStorage.setItem(key, JSON.stringify(newValue));
  });
};

export const currencyAtom = atom({
  key: 'activeCurrency',
  default: null,
  effects: [localStorageEffect('activeCurrency')],
});
