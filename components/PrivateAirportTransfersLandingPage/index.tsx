import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useWindowWidth } from '@react-hook/window-size';
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import LazyComponent from 'components/common/LazyComponent';
import PopulateMeta from 'components/common/NextSeoMeta';
import AccordionGroup from 'components/slices/AccordionGroup';
import { getAlternateLanguages } from 'utils';
import {
  sendVariablesToDataLayer,
  sendVariableToDataLayer,
  trackEvent,
} from 'utils/analytics';
import { isServer } from 'utils/gen';
import { getLangObject, groupSlices } from 'utils/helper';
import { gtmAtom } from 'store/atoms/gtm';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  MB_CATEGORISATION,
  SLICE_TYPES,
  THEMES,
} from 'const/index';
import { BannerSection } from './BannerSection';
import { CityGuideSection } from './CityGuideSection';
import { FeatureSection } from './FeatureSection';
import { ScrollAwareCommonHeader } from './Header';
import { HowItWorksSection } from './HowItWorksSection';
import { ReviewsSection } from './ReviewsSection';
import { isAirportTransferLandingPageAtom } from './state';
import { FAQSectionWrapper } from './style';
import { TrustBoosterSection } from './TrustBoosterGrid';
import { VehiclesSection } from './VehiclesSection';

export type TPrivateAirportTransfersLandingPageProps = {
  cmsContent: Record<string, any>;
  host: string;
  isDev: boolean;
  isMobile: boolean;
  domainConfig: Record<string, any>;
  serverRequestStartTimestamp: string;
  cityPageParams: Record<string, any>;
};

export const PrivateAirportTransfersLandingPage = ({
  cmsContent,
  host,
  isDev,
  isMobile: isMobileFromProps,
  domainConfig,
  serverRequestStartTimestamp,
  cityPageParams,
}: TPrivateAirportTransfersLandingPageProps) => {
  const {
    uid,
    lang,
    first_publication_date: datePublished,
    last_publication_date: dateModified,
    alternate_languages,
    data: CMSData,
  } = cmsContent ?? {};

  const isMobileFromWindowWidth = useWindowWidth() < 768;
  const setIsAirportTransferLandingPage = useSetRecoilState(
    isAirportTransferLandingPageAtom
  );

  useEffect(() => {
    setIsAirportTransferLandingPage(true);
  }, [setIsAirportTransferLandingPage]);

  const isMobile = isServer() ? isMobileFromProps : isMobileFromWindowWidth;

  const {
    content_framework: contentFramework,
    attraction: attractionCMS,
    baseLangCategorisationMetadata,
    footer_ref: commonFooter,
  } = CMSData;

  const taggedCity = baseLangCategorisationMetadata?.tagged_city || '';

  const { data: commonFooterData } = commonFooter || {};

  const {
    attraction: attractionCFoot,
    footer_heading: footerHeadingCFoot,
    theme_override: themeOverrideCFoot,
    disclaimer_text: disclaimerTextCFoot,
  } = commonFooterData || {};

  const footerAttractionName = attractionCFoot || attractionCMS || 'attraction';

  const contentFrameworkSlices =
    (contentFramework?.data.body && groupSlices(contentFramework?.data.body)) ||
    [];

  const listicleSectionSlice = contentFrameworkSlices.find(
    (slice: { slice_type: string }) =>
      slice.slice_type === SLICE_TYPES.LISTICLE_SECTION_V2_START
  );

  const faqSlice = contentFrameworkSlices.find(
    (slice: { slice_type: string }) =>
      slice.slice_type === SLICE_TYPES.ACCORDION
  );

  const currentLanguage = getLangObject(lang).code;

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

  useEffect(() => {
    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.LANGUAGE,
      value: currentLanguage,
    });

    const { mbCity, mbCountry } = cityPageParams?.mbLocationData;

    sendVariablesToDataLayer({
      [ANALYTICS_PROPERTIES.COUNTRY]: mbCountry,
      [ANALYTICS_PROPERTIES.CITY]: mbCity,
    });
  }, []);

  const { eventsReady } = useRecoilValue(gtmAtom);

  useEffect(() => {
    if (!eventsReady) return;

    const {
      tagged_category: taggedCategoryName,
      tagged_sub_category: taggedSubCategoryName,
      tagged_mb_type: taggedMbType,
      shoulder_page_type: shoulderPageType,
      subattraction_type: subattractionType,
      tagged_page_type: taggedPageType,
    } = (baseLangCategorisationMetadata as TCategorisationMetadata) || {};

    sendVariablesToDataLayer({
      ...(taggedCategoryName && {
        [ANALYTICS_PROPERTIES.CATEGORY_NAME]: taggedCategoryName,
      }),
      ...(taggedSubCategoryName && {
        [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: taggedSubCategoryName,
      }),
      ...(taggedMbType && {
        [ANALYTICS_PROPERTIES.MB_TYPE]: taggedMbType,
      }),
      ...(shoulderPageType && {
        [ANALYTICS_PROPERTIES.SHOULDER_PAGE_TYPE]: shoulderPageType,
      }),
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,

      [ANALYTICS_PROPERTIES.PAGE_TYPE]: 'Private Airport Transfers',
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.NUMBER_OF_SLICES]: 2, // medium listicle and FAQs
      [ANALYTICS_PROPERTIES.FIRST_SLICE_TYPE]: SLICE_TYPES.LISTICLE,
      [ANALYTICS_PROPERTIES.IS_LANDING_PAGE]:
        taggedPageType === MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE,
      ...(subattractionType && {
        [ANALYTICS_PROPERTIES.SUBATTRACTION_TYPE]: subattractionType,
      }),
    });
  }, [eventsReady]);

  const cityGuideData = cityPageParams?.cityPageData?.cityGuideData;

  return (
    <>
      <PopulateMeta
        {...{
          prismicData: CMSData,
          datePublished,
          dateModified,
          serverRequestStartTimestamp,
          languages: alternateLanguages,
          isMobile,
          bannerImages: [],
          faviconUrl,
          logoUrl,
        }}
      />

      <ScrollAwareCommonHeader
        languages={alternateLanguages}
        currentLanguage={currentLanguage}
        isDarkTheme
        hasPoweredByHeadoutLogo
        isEntertainmentMB
        logoUrl={logoUrl}
        logoAltText={whiteLabelName || ''}
        isMobile={isMobile}
      />

      <BannerSection cityCode={taggedCity} isMobile={isMobile} />

      <FeatureSection />

      <HowItWorksSection listicleSectionSlice={listicleSectionSlice} />

      <LazyComponent>
        <ReviewsSection isMobile={isMobile} />
      </LazyComponent>

      <LazyComponent>
        <TrustBoosterSection isMobile={isMobile} />
      </LazyComponent>

      <LazyComponent>
        <VehiclesSection isMobile={isMobile} />
      </LazyComponent>

      <Conditional if={cityGuideData?.length}>
        <CityGuideSection
          isMobile={isMobile}
          taggedCity={taggedCity}
          currentLanguage={currentLanguage}
          cityGuideData={cityGuideData}
          host={host}
          isDev={isDev}
        />
      </Conditional>

      <FAQSectionWrapper>
        <AccordionGroup
          accordions={faqSlice?.items}
          heading={faqSlice?.primary?.heading}
          useSchema={faqSlice?.primary?.use_faq_schema || false}
          sliceProps={{
            trackingRank: 7,
          }}
          tabData={faqSlice?.items}
          isRevampedDesign={false}
          isMobile={isMobile}
        />
      </FAQSectionWrapper>

      <Footer
        currentLanguage={currentLanguage}
        attraction={footerAttractionName}
        logoURL={logoUrl}
        logoAlt={whiteLabelName || ''}
        hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
        disclaimerText={disclaimerTextCFoot || ''}
        slices={[]}
        themeOverride={themeOverrideCFoot || THEMES.INHERIT}
        secondaryHeading={undefined}
        primaryHeading={footerHeadingCFoot}
        secondarySlices={[]}
        isCatOrSubCatPage={true}
        isDarkPurps={false}
      />
    </>
  );
};
