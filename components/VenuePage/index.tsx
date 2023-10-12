import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import LongForm from 'components/common/LongForm';
import PopulateMeta from 'components/common/NextSeoMeta';
import Header from 'components/MicrositeV2/Header';
import Amenities from 'components/VenuePage/components/Amenities';
import RichContent from 'UI/RichContent';
import { MBContext } from 'contexts/MBContext';
import {
  createBookingURL,
  getAlternateLanguages,
  getHeadoutLanguagecode,
  getSinglePrismicSlice,
} from 'utils';
import { sendVariablesToDataLayer, trackEvent } from 'utils/analytics';
import { getUniqueArrayItemsBy } from 'utils/arrayUtils';
import { getLangObject } from 'utils/helper';
import { convertUidToUrl, getLogoRedirectionUrl } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { hsidAtom } from 'store/atoms/hsid';
import { amenitiesIcons } from 'const/amenitiesIcons';
import { BOOKING_FLOW_TYPE } from 'const/booking';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PLATFORM,
  ANALYTICS_PROPERTIES,
  SLICE_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import { CHEVRON_DOWN, CHEVRON_UP, LocationSvg } from 'assets/SvgIcons';
import {
  IAccordionSlice,
  IAmenity,
  IVenuePageProps,
  IVerticalCardsGrid,
} from './interace';
import { Banner, VenuePageContainer } from './styles';
import { findFirstIndexOfAccordion, getShowsBasedOnTimestamp } from './utils';

const Breadcrumbs = dynamic(() =>
  import(/* webpackChunkName: "Breadcrumbs" */ 'components/Breadcrumbs')
);

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
    breadcrumbs,
  } = props;

  const {
    data: CMSContent,
    availableShowsData,
    allShowPageUids,
    inventorySlotData,
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
    taggedCategoryName,
    taggedSubCategoryName,
    mbType,
  } = CMSContent;

  const { slots }: SimplifiedSlotsData = inventorySlotData || {};

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
      ...(taggedCategoryName && {
        [ANALYTICS_PROPERTIES.CATEGORY_NAME]: taggedCategoryName,
      }),
      ...(taggedSubCategoryName && {
        [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: taggedSubCategoryName,
      }),
      ...(mbType && {
        [ANALYTICS_PROPERTIES.MB_TYPE]: mbType,
      }),
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,
    });
  }, []);

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

  const {
    nowPlayingShows,
    upcomingShows,
    pastShows,
  } = getShowsBasedOnTimestamp(availableShowsData);

  let tgidForFirstShow;
  switch (true) {
    case nowPlayingShows.length > 0:
      tgidForFirstShow = nowPlayingShows[0].id;
      break;

    case upcomingShows.length > 0:
      tgidForFirstShow = upcomingShows[0].id;
      break;
  }

  const redirectUrlForTabDataContent = createBookingURL({
    nakedDomain,
    lang: localeCode,
    tgid: tgidForFirstShow ?? '',
    redirectToHeadoutBookingFlow,
    currency,
    flowType: BOOKING_FLOW_TYPE.SEATMAP,
  });

  const automatedBreadcrumbsExists = Object.keys(breadcrumbs).length > 1;

  /* Find Best Seats CTA points to the first nowPlayingShow (incase of two) */
  const onFindBestSeatsCtaClicked = () => {
    window.open(redirectUrlForTabDataContent);
    trackEvent({
      eventName: ANALYTICS_EVENTS.THEATRE_PAGE.BEST_SEATS_CTA_CLICKED,
      ...(availableShowsData[0]?.name && {
        [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: availableShowsData[0]?.name,
      }),
      ...(availableShowsData[0]?.primaryCategory?.id && {
        [ANALYTICS_PROPERTIES.CATEGORY_ID]:
          availableShowsData[0]?.primaryCategory?.id,
      }),
      ...(availableShowsData[0]?.id && {
        [ANALYTICS_PROPERTIES.TGID]: availableShowsData[0]?.id,
      }),
      ...(availableShowsData[0]?.primaryCategory?.displayName && {
        [ANALYTICS_PROPERTIES.CATEGORY_NAME]:
          availableShowsData[0]?.primaryCategory?.displayName,
      }),
    });
  };

  const metaTitle =
    CMSContent.title +
    (nowPlayingShows.length > 0
      ? ` | ${strings.THEATRE_PAGE.NOW_PLAYING}: ${nowPlayingShows[0].name}`
      : '');

  let modifiedDescriptionSlices = JSON.parse(JSON.stringify(descriptionSlices));

  /* Hardcoding the position of ShowsGrid slice after Accordion slice. */
  if (pastShows.length > 0) {
    const indexOfAccordion = descriptionSlices.findIndex(
      findFirstIndexOfAccordion
    );

    const items = pastShows.map((show) => ({
      tgid: show.id,
    }));

    const pastShowSlice = {
      primary: {
        heading: strings.THEATRE_PAGE.PAST_SHOWS,
      },
      slice_type: 'shows_grid',
      items,
    };

    modifiedDescriptionSlices?.splice(indexOfAccordion + 1, 0, pastShowSlice);
  }

  const uniqueDateTimeSlots = getUniqueArrayItemsBy(slots, [
    'startDate',
    'startTime',
  ]);

  const amenitiesSchema = amenitiesDropdown.map((amenity: IAmenity) => {
    return {
      '@type': 'LocationFeatureSpecification',
      name: amenity?.amenities_list,
      value: 'true',
    };
  });

  const faqSchema = getSinglePrismicSlice({
    sliceName: SLICE_TYPES.ACCORDION,
    slices: descriptionSlices,
  }).items?.map((item: IAccordionSlice) => {
    return {
      '@type': 'Question',
      name: item.heading,
      acceptedAnswer: {
        '@type': 'Answer',
        text: RichText?.asText(item.content),
      },
    };
  });

  const additionalProperty = getSinglePrismicSlice({
    sliceName: SLICE_TYPES.VERTICAL_CARD_GRIDS,
    slices: descriptionSlices,
  }).items?.map((item: IVerticalCardsGrid) => {
    return {
      ['@type']: 'PropertyValue',
      name: item?.nearby_theatre_name,
      value: item?.theatre_info,
      url: item?.redirect_url.url,
    };
  });

  const eventSchemaMarkup = uniqueDateTimeSlots
    ?.slice(0, 30)
    ?.map((slot) => {
      const { endTime, startDate } = slot || {};
      return `
      {
        "@context": "https://schema.org",
        "@type": "PerformingArtsTheater",
        "name": "${theatreName}", 
        "address": {
          "@type": "PostalAddress",
          "name": "${theatreLocationCta}"
          },
        "maximumAttendeeCapacity" : "${seatingCapacity}",
        "url": "${selfCanonicalLink}",
        "amenityFeature": ${JSON.stringify([...amenitiesSchema])},
        "event": [
          {
            "@type": "Event",
            "name": "${availableShowsData[0]?.name}",
            "startDate": "${startDate}",
            "endDate": "${startDate}T${endTime}",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": "${theatreName}",
              "address": {
                "@type": "PostalAddress",
                "name": "${theatreLocationCta}"
              }
            },
            "offers": {
              "@type": "Offer",
              "url":"${selfCanonicalLink}",
              "price": "${availableShowsData[0]?.listingPrice?.finalPrice}",
              "priceCurrency": "${
                availableShowsData[0]?.listingPrice?.currencyCode
              }",
              "availability": "https://schema.org/InStock"
            }
          }
        ],
        "additionalProperty": ${JSON.stringify([
          ...(additionalProperty || []),
        ])},
          "subjectOf": {
          "@type": "CreativeWork",
          "mainEntity": {
            "@type": "FAQPage", 
            "mainEntity": ${JSON.stringify([...(faqSchema || [])])}
          }
        }
      }`;
    })
    ?.join(',');

  return (
    <>
      <PopulateMeta
        {...{
          prismicData: {
            ...CMSContent,
            canonical_link: selfCanonicalLink,
            title: metaTitle,
          },
          datePublished,
          dateModified,
          serverRequestStartTimestamp,
          languages: alternateLanguages,
          isMobile,
          bannerImages: [],
          faviconUrl,
          logoUrl: logoUrl,
          breadcrumbsDetails: {
            breadcrumbs,
          },
        }}
      />
      <Head>
        <script
          dangerouslySetInnerHTML={{ __html: `[${eventSchemaMarkup}]` }}
          type="application/ld+json"
        />
      </Head>
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
        headerSlices={commonHeader?.data?.body}
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
        <Conditional if={automatedBreadcrumbsExists && !isMobile}>
          <Breadcrumbs
            breadcrumbs={breadcrumbs}
            isVenuePage={true}
            isMobile={false}
          />
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
        content={modifiedDescriptionSlices}
        uid={uid}
        isMobile={isMobile}
        availableShowsData={availableShowsData}
        nowPlayingShows={nowPlayingShows}
        upcomingShows={upcomingShows}
        pastShows={pastShows}
        allShowPageUids={allShowPageUids}
        isVenuePage={true}
        redirectUrlForTabDataContent={redirectUrlForTabDataContent}
        findBestSeatsCallback={
          tgidForFirstShow ? onFindBestSeatsCtaClicked : null
        }
      />
      <VenuePageContainer>
        <Conditional if={automatedBreadcrumbsExists && isMobile}>
          <Breadcrumbs
            breadcrumbs={breadcrumbs}
            isVenuePage={true}
            isMobile={true}
          />
        </Conditional>
      </VenuePageContainer>
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
      />
    </>
  );
};

export default VenuePage;
