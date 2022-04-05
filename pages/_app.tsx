import {
  getLocalizationLabels,
  initDayJSLocale,
} from 'utils/localizationUtils';
import { strings } from 'const/strings';
import { getLanguageFromPathname } from 'utils';
import 'public/global.css';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { currencyAtom } from 'store/atoms/currency';
import '@formatjs/intl-relativetimeformat/polyfill';

const App = ({ Component, pageProps, localizedStrings, lang }) => {
  strings.setContent({
    default: localizedStrings,
  });
  if (lang !== 'en') initDayJSLocale(lang);

  const initRecoil = ({ set }: MutableSnapshot) => {
    if (!pageProps?.ContentType) return;

    const { queryParams = {} } = pageProps;
    const { currencyCode } = queryParams;
    if (currencyCode?.length) {
      set(currencyAtom, currencyCode);
    }
  };

  return (
    <RecoilRoot initializeState={initRecoil}>
      <Component {...pageProps} />
    </RecoilRoot>
  );
};

App.getInitialProps = async ({ Component, ctx }) => {
  const { asPath, query } = ctx;
  const [pathname, ..._query] = asPath.split('?');
  const lang = getLanguageFromPathname({ pathname, query }) || 'en';
  const localizedStrings = await getLocalizationLabels({ lang });
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  return { localizedStrings, pageProps, lang };
};

export default App;
