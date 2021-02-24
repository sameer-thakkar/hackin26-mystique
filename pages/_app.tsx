import {
  getLocalizationLabels,
  initDayJSLocale,
} from 'utils/localizationUtils';
import { strings } from 'const/strings';
import { getLanguageFromPathname } from 'utils';

const App = ({ Component, pageProps, localizedStrings, lang }) => {
  strings.setContent({
    default: localizedStrings,
  });
  if (lang !== 'en') initDayJSLocale(lang);

  return <Component {...pageProps} />;
};

App.getInitialProps = async ({ Component, ctx }) => {
  const { asPath, query } = ctx;
  const lang = getLanguageFromPathname({ pathname: asPath, query }) || 'en';
  const localizedStrings = await getLocalizationLabels({ lang });
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  return { localizedStrings, pageProps, lang };
};

export default App;
