import { AppProps } from 'next/app';
import rtlPlugin from 'stylis-plugin-rtl';
import { StyleSheetManager } from 'styled-components';
import '@formatjs/intl-relativetimeformat/polyfill';
import 'public/global.css';
import LiveChat from 'components/common/LiveChat';
import { RTL_LANGUAGE_CODES } from 'const/index';
import { initDayJSLocale } from 'utils/localizationUtils';
import { ArabicGlobalStyle } from 'const/globalStyles/ar';
import ScrollToTop from 'components/common/ScrollToTop';
import Clarity from 'components/common/Clarity';
import { getLangObject } from 'utils/helper';

const App = ({
  Component,
  pageProps,
}: AppProps<{ lang: string; host: string; uid: string }>) => {
  const { lang: locale } = pageProps;
  const langCode = getLangObject(locale).code;
  if (langCode !== 'en') initDayJSLocale(langCode);

  const getLanguageBasedGlobalStyling = (lang: any) => {
    switch (lang) {
      case 'ar':
        return <ArabicGlobalStyle />;
      default:
        return null;
    }
  };

  const { host } = pageProps;
  return (
    <StyleSheetManager
      // @ts-expect-error TS(2769): No overload matches this call.
      stylisPlugins={RTL_LANGUAGE_CODES.includes(langCode) ? [rtlPlugin] : []}
    >
      <>
        {getLanguageBasedGlobalStyling(langCode)}
        <Component {...pageProps} />
        <ScrollToTop />
        <LiveChat uid={pageProps?.uid} />
        <Clarity host={host} />
      </>
    </StyleSheetManager>
  );
};

export default App;
