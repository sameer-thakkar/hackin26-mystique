import { useState, useContext, useEffect } from 'react';
import { CHEVRON_DOWN, CHEVRON_UP, LocationSvg } from 'assets/SvgIcons';
import { currencyAtom } from 'store/atoms/currency';
import Amenities from 'components/VenuePage/components/Amenities';
import Footer from 'components/common/Footer';
import Header from 'components/MicrositeV2/Header';
import Breadcrumb from 'components/slices/Breadcrumb';
import { strings } from 'const/strings';
import RichContent from 'UI/RichContent';
import { getLangObject, checkIfLTTMB } from 'utils/helper';
import { amenitiesIcons } from 'const/amenitiesIcons';
import Conditional from 'components/common/Conditional';
import {
  createBookingURL,
  getAlternateLanguages,
  getHeadoutLanguagecode,
} from 'utils';
import { convertUidToUrl, getLogoRedirectionUrl } from 'utils/urlUtils';
import { useRecoilValue } from 'recoil';
import { MBContext } from 'contexts/MBContext';
import { sendVariablesToDataLayer, trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PLATFORM,
  ANALYTICS_PROPERTIES,
} from 'const/index';
import PopulateMeta from 'components/common/NextSeoMeta';
import LongForm from 'components/common/LongForm';
import { Banner, VenuePageContainer } from 'components/VenuePage/styles';
import { BOOKING_FLOW_TYPE } from 'const/booking';
import { hsidAtom } from 'store/atoms/hsid';

import { IVenuePageProps } from './interace';

const VenuePage = (props: IVenuePageProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedLimit, setExpandedLimit] = useState(4);
  const {
    nakedDomain,
    redirectToHeadoutBookingFlow,
    lang: localeCode,
  } = useContext(MBContext);
  const hsid = useRecoilValue(hsidAtom);

  const {
    host,
    domainConfig,
    lang,
    data,
    isMobile,
    uid,
    isDev,
    serverRequestStartTimestamp,
    tgidsInPage,
  } = props;

  const {
    data: CMSContent,
    showsListSlicesData,
    showsGridSlicesData,
    first_publication_date: datePublished,
    last_publication_date: dateModified,
    alternate_languages,
  } = data;

  const {
    seatingCapacity,
    mobileBanner,
    desktopBanner,
    theatreName,
    theatreLocationUrl,
    theatreLocationCta,
    theatreInfo,
    amenitiesDropdown,
    descriptionSlices,
    refs,
  } = CMSContent;

  useEffect(() => {
    sendVariablesToDataLayer({
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: CMSContent.taggedCollection,
      [ANALYTICS_PROPERTIES.CITY]: CMSContent.city,
      [ANALYTICS_PROPERTIES.COUNTRY]: CMSContent.country,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: 'Theatre Page',
      [ANALYTICS_PROPERTIES.THEATRE_NAME]: theatreName,
      [ANALYTICS_PROPERTIES.HSID]: hsid,
      [ANALYTICS_PROPERTIES.LANGUAGE]: localeCode,
      [ANALYTICS_PROPERTIES.TGIDS]: tgidsInPage,
      [ANALYTICS_PROPERTIES.PLATFORM_NAME]:
        window.outerWidth < 768
          ? ANALYTICS_PLATFORM.MOBILE
          : ANALYTICS_PLATFORM.DESKTOP,
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,
    });
  }, []);

  const tgidForFirstShow = showsListSlicesData[0]?.id;

  const { SHOW_MORE, SHOW_LESS } = strings;

  const { commonHeader, commonFooter, secondaryFooter } = refs;
  const currency = useRecoilValue(currencyAtom);

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

  const isLTT = checkIfLTTMB(uid);

  const breadcrumbsLinks = [
    {
      link: { url: 'https://www.london-theater-tickets.com/' },
      text: 'London Theatre Tickets',
    },
    {
      link: { url: 'https://www.london-theater-tickets.com/london-theatres/' },
      text: 'Theatres In London',
    },
    { text: theatreName },
  ];

  const selfCanonicalLink = convertUidToUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
  });

  const logoRedirectionUrl = getLogoRedirectionUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
    isDev,
    host,
  });

  const handleShowMoreClick = () => {
    setIsExpanded(!isExpanded);
    setExpandedLimit(isExpanded ? 4 : amenitiesDropdown.length);
  };

  const onTheatreAddressClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.THEATRE_PAGE.THEATRE_ADDRESS_CLICKED,
      [ANALYTICS_PROPERTIES.THEATRE_ADDRESS]: 'Theatre Address',
    });
  };

  const redirectUrlForTabDataContent = createBookingURL({
    nakedDomain,
    lang: localeCode,
    tgid: tgidForFirstShow,
    redirectToHeadoutBookingFlow,
    currency,
    flowType: BOOKING_FLOW_TYPE.SEATMAP,
  });

  /* Find Best Seats CTA points to the first nowPlayingShow (incase of two) */
  const onFindBestSeatsCtaClicked = () => {
    window.open(redirectUrlForTabDataContent);
    trackEvent({
      eventName: ANALYTICS_EVENTS.THEATRE_PAGE.BEST_SEATS_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: showsListSlicesData[0].name,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]:
        showsListSlicesData[0].primaryCategory.id,
      [ANALYTICS_PROPERTIES.TGID]: showsListSlicesData[0].id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]:
        showsListSlicesData[0].primaryCategory.displayName,
    });
  };

  return (
    <>
      <PopulateMeta
        {...{
          prismicData: {
            ...CMSContent,
            canonical_link: selfCanonicalLink,
          },
          datePublished,
          dateModified,
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
        enableDropdownLinks={true}
        logoRedirectionURL={logoRedirectionUrl ?? ''}
        logoAltText={whiteLabelName || ''}
        enableSearch={false}
        enableBuyTickets={false}
        isGlobalMb={false}
        headerSlices={commonHeader.data.body}
        hasLanguageSelector={true}
        languageProps={{
          uid,
          currentLanguage,
          languages: alternateLanguages,
        }}
        hideCurrencySelector={true}
        logoUrl={logoUrl}
        hasPoweredByHeadoutLogo={true}
      />

      <Banner url={isMobile ? mobileBanner.url : desktopBanner.url}>
        <div className="banner-text">
          <h1 className="theatre-name">{theatreName}</h1>
          <a
            className="theatre-location-cta"
            href={theatreLocationUrl.url}
            target="_blank"
            rel="noreferrer"
            onClick={onTheatreAddressClick}
          >
            <LocationSvg />
            {theatreLocationCta}
          </a>
        </div>
      </Banner>

      <VenuePageContainer>
        <Conditional if={isLTT}>
          <div className="breadcrumb-container">
            <Breadcrumb
              orderedLinks={breadcrumbsLinks}
              shouldLastNodeBeUnderlined={false}
            />
          </div>
        </Conditional>
        <div className="theatre-info">
          <RichContent render={theatreInfo} />
        </div>
        <div className="amenities">
          <Conditional if={seatingCapacity}>
            <div className="amenity">
              {amenitiesIcons['Seating Capacity']}
              <p>{seatingCapacity} seats</p>
            </div>
          </Conditional>
          <Amenities
            {...{
              isMobile,
              expandedLimit,
              amenitiesDropdown,
            }}
          />
          <div className="show-more-cta">
            <button onClick={handleShowMoreClick}>
              <>
                {isExpanded ? SHOW_LESS : SHOW_MORE}
                {isExpanded ? CHEVRON_UP : CHEVRON_DOWN}
              </>
            </button>
          </div>
        </div>
      </VenuePageContainer>
      <LongForm
        content={descriptionSlices}
        isMobile={isMobile}
        showsListSlicesData={showsListSlicesData}
        showsGridSlicesData={showsGridSlicesData}
        isVenuePage={true}
        redirectUrlForTabDataContent={redirectUrlForTabDataContent}
        findBestSeatsCallback={onFindBestSeatsCtaClicked}
      />
      <VenuePageContainer>
        <Conditional if={isMobile && isLTT}>
          <Breadcrumb
            orderedLinks={breadcrumbsLinks}
            shouldLastNodeBeUnderlined={false}
          />
        </Conditional>
      </VenuePageContainer>
      <Footer
        currentLanguage={currentLanguage}
        attraction={commonFooter?.data?.attraction || 'attraction'}
        logoURL={logoUrl}
        logoAlt={whiteLabelName || ''}
        hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
        disclaimerText={commonFooter.data.disclaimer_text}
        slices={commonFooter?.data?.body || []}
        secondarySlices={secondaryFooter?.data?.body || []}
        primaryHeading={commonFooter?.data?.footer_heading}
        secondaryHeading={secondaryFooter?.data?.footer_heading}
      />
    </>
  );
};

export default VenuePage;
