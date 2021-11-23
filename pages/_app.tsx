import { useEffect } from 'react';
import {
  getLocalizationLabels,
  initDayJSLocale,
} from 'utils/localizationUtils';
import { strings } from 'const/strings';
import { getLanguageFromPathname } from 'utils';
import 'public/global.css';
import { sendVariableToDataLayer } from 'utils/analytics';
import { ANALYTICS_PROPERTIES, CUSTOM_TYPES, PAGE_TYPES } from 'const/index';
import { withShortcodes } from 'utils/helper';

const App = ({ Component, pageProps, localizedStrings, lang }) => {
  strings.setContent({
    default: localizedStrings,
  });
  if (lang !== 'en') initDayJSLocale(lang);

  useEffect(() => {
    // GTM Universal Properties
    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.LANGUAGE,
      value: lang,
    });
    const customType = pageProps.ContentType;
    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.PAGE_TYPE,
      value:
        customType !== CUSTOM_TYPES.CONTENT_PAGE
          ? PAGE_TYPES.COLLECTION
          : PAGE_TYPES.CONTENT_PAGE,
    });
    const pageHeading =
      customType === CUSTOM_TYPES.MICROSITE
        ? pageProps.CMSContent.data?.data?.heading
        : pageProps.CMSContent.data?.featured_title;
    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.PAGE_HEADING,
      value: withShortcodes(pageHeading).join(''),
    });
  }, []);

  return <Component {...pageProps} />;
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
