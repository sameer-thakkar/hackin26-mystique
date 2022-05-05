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
import { metaAtom } from 'store/atoms/meta';
import { CONTENT_PAGE_TYPES, CUSTOM_TYPES, PAGE_TYPES } from 'const/index';
import renderShortCodes from 'utils/shortCodes';

const App = ({ Component, pageProps, localizedStrings, lang }) => {
  strings.setContent({
    default: localizedStrings,
  });
  if (lang !== 'en') initDayJSLocale(lang);

  const initRecoil = ({ set }: MutableSnapshot) => {
    if (!pageProps?.ContentType) return;
    const { lang } = pageProps ?? {};
    const {
      queryParams = {},
      baseLangPageTitle,
      categoryTourListData,
      CMSContent,
      ContentType: customType,
      tourGroupData,
      primaryCity,
    } = pageProps;
    const { title } = CMSContent?.data ?? {};
    const { currencyCode } = queryParams;
    const metaTitle = renderShortCodes(title)?.join?.('');
    let pageTitle =
      customType === CUSTOM_TYPES.MICROSITE
        ? CMSContent?.data?.data?.heading
        : CMSContent?.data?.featured_title;
    pageTitle = pageTitle ?? metaTitle;
    const pageType = !CONTENT_PAGE_TYPES.includes(customType)
      ? PAGE_TYPES.COLLECTION
      : PAGE_TYPES.CONTENT_PAGE;
    const mbName = renderShortCodes(baseLangPageTitle)?.join?.('');
    let scorpioData = categoryTourListData?.isCategoryV2
      ? Object.values(categoryTourListData).reduce(
          (acc: Array<any>, tours) => acc.concat(tours),
          []
        )
      : categoryTourListData?.scorpioData ?? tourGroupData ?? {};
    let primaryCollectionName = null,
      primaryCollectionId = null;
    if (
      Object.keys(scorpioData).length > 0 &&
      customType !== CUSTOM_TYPES.SHOW_PAGE
    ) {
      const [firstTour]: any = Object.values(scorpioData);
      const { primaryCollection } = firstTour;
      const { id, name } = primaryCollection ?? {};
      primaryCollectionName = name;
      primaryCollectionId = id;
    } else if (customType === CUSTOM_TYPES.SHOW_PAGE) {
      const { primaryCollection } = tourGroupData;
      const { id, name } = primaryCollection ?? {};
      primaryCollectionName = name;
      primaryCollectionId = id;
    }

    set(metaAtom, {
      city: primaryCity,
      country: primaryCity?.country,
      language: lang,
      pageTitle: pageTitle,
      collectionId: primaryCollectionId,
      collectionName: primaryCollectionName,
      mbName,
      pageType,
    });

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
