import { useEffect } from 'react';
import {
  getLocalizationLabels,
  initDayJSLocale,
} from 'utils/localizationUtils';
import { strings } from 'const/strings';
import { getLanguageFromPathname } from 'utils';

const App = ({ Component, pageProps, localizedStrings, lang }) => {
  useEffect(() => {
    strings.setContent({
      default: localizedStrings,
    });
    initDayJSLocale(lang);
  }, [localizedStrings, lang]);
  return <Component {...pageProps} />;
};

App.getInitialProps = async ({ Component, ctx }) => {
  const { pathname, query } = ctx;
  const lang = getLanguageFromPathname({ pathname, query }) || 'en';
  const localizedStrings = await getLocalizationLabels({ lang });
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  return { localizedStrings, pageProps, lang };
};

export default App;
