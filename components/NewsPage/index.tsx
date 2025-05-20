import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import PopulateMeta from 'components/common/NextSeoMeta';
import Header from 'components/MicrositeV2/Header';
import ArticlePage from 'components/NewsPage/ArticlePage';
import { getAlternateLanguages, getHeadoutLanguagecode } from 'utils';
import { sendVariablesToDataLayer, trackEvent } from 'utils/analytics';
import { checkIfLTTMB, getLangObject } from 'utils/helper';
import { convertUidToUrl, getLogoRedirectionUrl } from 'utils/urlUtils';
import { gtmAtom } from 'store/atoms/gtm';
import { hsidAtom } from 'store/atoms/hsid';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PLATFORM,
  ANALYTICS_PROPERTIES,
  BOOLEAN_STATES,
  PAGE_TYPES,
} from 'const/index';
import { TNewsPageProps } from './interface';
import NewsLandingPage from './LandingPage';

const NewsPage: React.FC<React.PropsWithChildren<TNewsPageProps>> = (props) => {
  const { eventsReady } = useRecoilValue(gtmAtom);
  const hsid = useRecoilState(hsidAtom);

  let {
    host,
    domainConfig,
    lang,
    data: CMSContent,
    isMobile,
    uid,
    isDev,
    serverRequestStartTimestamp,
  } = props;

  const {
    alternate_languages,
    data: CMSData,
    first_publication_date,
    last_publication_date,
    tgidMappingData,
  } = CMSContent;

  const {
    tgid,
    taggedCategory,
    taggedCity,
    taggedCountry,
    taggedCollection,
    taggedMbType,
    is_landing_page: isLandingPage,
    header_ref: commonHeader,
    primary_footer_ref: commonFooter,
    secondary_footer_ref: secondaryFooter,
    canonical_link: canonicalLink,
  } = CMSData ?? {};

  const {
    faviconUrl,
    logo: { logoUrl = '', showPoweredLogo = true } = {},
    name: whiteLabelName,
  } = domainConfig || {};
  const alternateLanguages = getAlternateLanguages(
    alternate_languages,
    isDev,
    host,
    uid
  );
  const currentLanguage = getLangObject(lang).code;
  const logoRedirectionUrl = getLogoRedirectionUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
    isDev,
    host,
  });
  const selfCanonicalLink = convertUidToUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
  });
  const isLTT = checkIfLTTMB(uid);

  useEffect(() => {
    if (!eventsReady) return;
    sendVariablesToDataLayer({
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
      [ANALYTICS_PROPERTIES.TGIDS]: tgid,
      [ANALYTICS_PROPERTIES.CITY]: taggedCity,
      [ANALYTICS_PROPERTIES.COUNTRY]: taggedCountry,
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: taggedCollection,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: taggedCategory,
      [ANALYTICS_PROPERTIES.MB_TYPE]: taggedMbType,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.NEWS_PAGE,
      [ANALYTICS_PROPERTIES.HSID]: hsid,
      [ANALYTICS_PROPERTIES.PLATFORM_NAME]: isMobile
        ? ANALYTICS_PLATFORM.MOBILE
        : ANALYTICS_PLATFORM.DESKTOP,
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,
      [ANALYTICS_PROPERTIES.IS_SHOW_PLAYING]: tgidMappingData?.listingPrice
        ?.finalPrice
        ? BOOLEAN_STATES.YES
        : BOOLEAN_STATES.NO,
    });
  }, [eventsReady]);

  return (
    <>
      <PopulateMeta
        {...{
          prismicData: {
            ...CMSData,
            canonical_link: canonicalLink || selfCanonicalLink,
          },
          datePublished: first_publication_date,
          dateModified: last_publication_date,
          serverRequestStartTimestamp,
          languages: alternateLanguages,
          isMobile,
          bannerImages: [],
          faviconUrl,
          logoUrl: logoUrl,
        }}
      />
      <Header
        isMobile={isMobile}
        allTours={[]}
        host={host}
        dropdownLinks={[]}
        enableDropdownLinks
        logoRedirectionURL={logoRedirectionUrl ?? ''}
        logoAltText={whiteLabelName || ''}
        enableSearch={false}
        enableBuyTickets={false}
        isGlobalMb={false}
        headerSlices={commonHeader?.data?.body}
        hasLanguageSelector
        hideCurrencySelector
        languageProps={{
          uid,
          currentLanguage,
          languages: alternateLanguages,
        }}
        logoUrl={logoUrl}
        hasPoweredByHeadoutLogo
        isNewsPage
        isEntertainmentMb
      />
      <Conditional if={!isLandingPage}>
        <ArticlePage {...props} />
      </Conditional>
      <Conditional if={isLandingPage}>
        <NewsLandingPage {...props} />
      </Conditional>
      <Footer
        currentLanguage={currentLanguage}
        attraction={commonFooter?.data?.attraction || 'attraction'}
        logoURL={logoUrl}
        logoAlt={whiteLabelName || ''}
        hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
        disclaimerText={commonFooter?.data?.disclaimer_text}
        slices={commonFooter?.data?.body || []}
        secondarySlices={secondaryFooter?.data?.body || []}
        primaryHeading={commonFooter?.data?.footer_heading}
        secondaryHeading={secondaryFooter?.data?.footer_heading}
        isLTT={isLTT}
      />
    </>
  );
};

export default NewsPage;
