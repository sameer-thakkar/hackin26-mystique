import { ComponentType, useEffect, useState } from 'react';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { useWindowWidth } from '@react-hook/window-size';
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import LastMinuteFilters from 'components/common/LastMinuteFilters';
import LazyComponent from 'components/common/LazyComponent';
import PopulateMeta from 'components/common/NextSeoMeta';
import F1TrustBoosters from 'components/F1TrustBoosters/index';
import { InteractionContextProvider } from 'contexts/Interaction';
import { ProductsContextProvider } from 'contexts/Products';
import {
  displayBannerTrustBoosters,
  displayProductTrustBoosters,
  getAlternateLanguages,
  getBannerAndFooterSubtext,
  getF1MBTrustBoosters,
  getFinalisedBannerImages,
  getHeadoutLanguagecode,
  isA1orC1MB,
  isCategoryMB,
  isCollectionMB,
  isSubCategoryMB,
  legacyBooleanCheck,
} from 'utils';
import { calculateAvgRatingAndTotalReviews } from 'utils/airportTransfersUtils';
import allToursParser from 'utils/allToursParser';
import {
  sendVariablesToDataLayer,
  sendVariableToDataLayer,
  trackEvent,
} from 'utils/analytics';
import {
  checkIfCategoryHeaderExists,
  csvTgidToArray,
  getBannerDescriptors,
  getLangObject,
  groupSlices,
} from 'utils/helper';
import renderShortCodes from 'utils/shortCodes';
import { convertUidToUrl, getLogoRedirectionUrl } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { gtmAtom } from 'store/atoms/gtm';
import { AIRPORT_TRANSFER_PRODUCT_CARD_TEMPLATE } from 'const/airportTransfers';
import { BOOKING_FLOW_TYPE } from 'const/booking';
import {
  ALLOW_IMMEDIATE_NESTING,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BOOLEAN_STATES,
  PAGE_TYPES,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import { LOCATION } from 'assets/SvgIcons';
import { LongFormAndStaticContent } from './AirportTransfers/LongFormAndStaticContent';
import { PopulateAirportTransfersProducts } from './AirportTransfers/PopulateAirportTransferProducts';
import { TTour } from './AirportTransfers/PopulateAirportTransferProducts/interfaces';

const LongForm = dynamic(() => import('components/common/LongForm'));
const FreeTourPopup = dynamic(() => import('./FreeTourPopup'), { ssr: false });
const GroupBooking = dynamic(() => import('./GroupBooking'), { ssr: false });
const Alert = dynamic(() => import('UI/Alert'), { ssr: false });
const DismissAlert = dynamic(() => import('UI/DismissAlert'), { ssr: false });
const CollectionCarousel = dynamic(() =>
  import(
    /* webpackChunkName: "CollectionCarousel" */ 'components/slices/CollectionCarousel'
  )
);

const ResponsiveSelector: ComponentType<any> = dynamic(
  () =>
    import('components/MicrositeV2/ResponsiveSelector').then(
      (m) => m.ResponsiveSelector
    ),
  { ssr: false }
);
const TextBanner = dynamic(() => import('components/TextBanner'));
const StaticBanner = dynamic(() =>
  import(/* webpackChunkName: "StaticBanner" */ 'components/StaticBanner')
);

const CityPageContainer = dynamic(() =>
  import(
    /* webpackChunkName: "CityPageContainer" */ 'components/CityPageContainer'
  )
);

const Banner = dynamic(() =>
  import(/* webpackChunkName: "Banner" */ 'components/Banner')
);
const PopulateProducts = dynamic(() => import('components/PopulateProducts'));
const CategoryHeader = dynamic(() =>
  import(/* webpackChunkName: "CategoryHeader" */ 'components/CategoryHeader')
);
const Breadcrumbs = dynamic(() =>
  import(/* webpackChunkName: "Breadcrumbs" */ 'components/Breadcrumbs')
);

const CoverSlicesWrapper = styled.div`
  margin-bottom: 32px;
`;

const MicrositeV1 = (props: any) => {
  const {
    toursList: uncategorizedToursList,
    tgidToScroll,
    data,
    offerData,
    mbTheme,
    scorpioData: scorpioDataUncategorised,
    host,
    isDev,
    serverRequestStartTimestamp,
    categoryTourListData,
    domainConfig,
    collectionDetails,
    bannerImageData,
    primaryCity,
    categoryHeaderMenu,
    breadcrumbs,
    cityPageParams,
  } = props;

  const [isMobile, setIsMobile] = useState(props?.isMobile);
  const windowWidth = useWindowWidth();
  const currency = useRecoilValue(currencyAtom);
  const { eventsReady } = useRecoilValue(gtmAtom);
  const [freeTourPopupOpen, toggleFreeTourPopup] = useState(false);
  const [covidAlertActive, toggleCovidAlert] = useState(false);
  const [groupBookingModalActive, toggleGroupBookingModal] = useState(false);

  const {
    refs,
    uid,
    lang,
    first_publication_date: datePublished,
    last_publication_date: dateModified,
    data: micrositeData,
    alternate_languages,
    mbType,
  } = data;

  const { isCityPageMB, cityPageData, mbLocationData } = cityPageParams;

  const {
    contentFramework,
    commonFooter,
    secondaryFooter,
    commonHeader,
    productCardData,
  } = refs;

  const {
    attraction: attractionCMS,
    images: bannerImages,
    heading: bannerHeading,
    banner_subtext: bannerSubtext,
    banner_cta_text: bannerCtaText,
    auto_banner: autoBanner,
    hide_banner_cta: hideBannerCTA,
    banner_limit: bannerLimit,
    body1: uncategorizedTours,
    show_covid19_alert: showCovid19Alert,
    body4: coverSlices,
    currencies_list,
    group_booking_excluded_tgids: groupBookingExcludedTgids,
    alert_popup: alertPopupCMS,
    disclaimer: disclaimerCMS,
    theme_override: themeOverrideCMS,
    instant_checkout: instantCheckout = false,
    enable_earliest_availability: enableEarliestAvailability,
    baseLangPageTitle,
    design,
    baseLangIsPoiMb,
    baseLangBannerAndFooterCombinations,
    baseLangCategorisationMetadata,
  } = micrositeData || {};
  const {
    tagged_city: taggedCity,
    tagged_category: taggedCategoryName,
    tagged_sub_category: taggedSubCategoryName,
    tagged_mb_type: taggedMbType,
  } = (baseLangCategorisationMetadata as TCategorisationMetadata) || {};

  const { COVID19_ALERT, READ_MORE } = strings;

  const pageUrl = convertUidToUrl({ uid, lang: getHeadoutLanguagecode(lang) });

  const alternateLanguages = getAlternateLanguages(
    alternate_languages,
    isDev,
    host,
    uid
  );

  const { data: commonFooterData } = commonFooter || {};
  const { data: secondaryFooterData } = secondaryFooter || {};
  const {
    attraction: attractionCFoot,
    body: slicesCFoot,
    footer_heading: footerHeadingCFoot,
    theme_override: themeOverrideCFoot,
    disclaimer_text: disclaimerTextCFoot,
  } = commonFooterData || {};
  const { footer_heading: footerHeadingSFoot, body: slicesSFoot } =
    secondaryFooterData || {};

  const headerCurrencies = currencies_list.filter((c: any) => c?.currency);

  const currentLanguage = getLangObject(lang).code;
  const isCategorisedTours =
    Object.keys(categoryTourListData?.scorpioData ?? {})?.length > 0;
  const {
    scorpioData: scorpioDataCategorised,
    orderedTours: categorizedToursList,
  } = categoryTourListData || {};

  const tourRanking = uncategorizedTours[0]?.primary?.ranking;
  const hasTours = isCategorisedTours
    ? categorizedToursList
    : uncategorizedToursList.length > 0;
  const uncategorizedToursHeading = hasTours
    ? isCategorisedTours
      ? ''
      : uncategorizedTours[0].primary
    : '';
  const scorpioData = isCategorisedTours
    ? scorpioDataCategorised
    : scorpioDataUncategorised;

  const {
    faviconUrl,
    logo: { logoUrl = '', showPoweredLogo = true } = {},
    name: whiteLabelName,
  } = domainConfig || {};

  const footerAttractionName = attractionCFoot || attractionCMS || 'attraction';
  let footerThemeOverride = themeOverrideCFoot || THEMES.INHERIT;
  footerThemeOverride = themeOverrideCMS || THEMES.INHERIT;

  const isHeaderInherited =
    commonHeader?.lang !== getLangObject(currentLanguage).locale;
  const isFooterInherited =
    commonFooter?.lang !== getLangObject(currentLanguage).locale;
  const isSecondaryFooterInherited =
    secondaryFooter?.lang !== getLangObject(currentLanguage).locale;
  const withCommonHeaderOverrides = {
    ...micrositeData,
    ...commonHeader?.data,
  };
  let {
    body2: longFormContent,
    book_now_text: bookNowText,
    read_more_text: readMoreText,
    show_less_text: showLessText,
    enable_group_booking: enableGroupBooking,
    enable_buy_tickets: enableBuyTickets,
    blackout_start_date: blackoutStartDate,
    blackout_end_date: blackoutEndDate,
    block_n_days_group_booking: blockNDaysGroupBooking,
    minimum_pax: minimumPax,
    maximum_pax: maximumPax,
    group_form_blocked_days: blockedDays,
    group_booking_disclaimer: groupBookingDisclaimer,
    body: headerSlices,
    header_links: headerLinks,
    enable_dropdown: enableDropdownLinks,
    dropdown_menu,
  } = withCommonHeaderOverrides;
  const logoRedirectionUrl = getLogoRedirectionUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
    isDev,
    host,
  });

  const dropdownLinks =
    dropdown_menu?.reduce((acc: any, item: any) => {
      if (item.link)
        return [...acc, { value: item.link.url, label: item.link_text }];
      else return acc;
    }, []) || [];
  const hasDropdownLinks =
    legacyBooleanCheck(enableDropdownLinks) && dropdownLinks.length;

  const showGroupBooking = legacyBooleanCheck(enableGroupBooking);
  const { results: productOffer } = offerData ? offerData : { results: [] };
  const hasOffer = productOffer.length > 0;
  const offerPopup = hasOffer ? productOffer[0] : null;
  const disclaimerText = disclaimerTextCFoot || RichText.asText(disclaimerCMS);
  let groupBookingTourTitles: any = [];

  let alertPopup = null;
  if (alertPopupCMS?.id) {
    alertPopup = alertPopupCMS;
  }

  if (showGroupBooking) {
    uncategorizedToursList
      .filter(function (tour: any) {
        return !groupBookingExcludedTgids.find(function (excludedTour: any) {
          return tour.tgid === excludedTour.tgid;
        });
      })
      .forEach((tour: any) => {
        groupBookingTourTitles.push({
          value:
            (tour.tour_title_override || scorpioData[tour.tgid]?.title) +
            ` [${tour.tgid}]`,
          label: tour.tour_title_override || scorpioData[tour.tgid]?.title,
        });
      });
  }

  const sortTours = (
    tgidToScroll: any,
    toursArray: any,
    isCategorisedTours: any
  ) => {
    if (!tgidToScroll) return toursArray;
    if (tgidToScroll) {
      return toursArray?.reduce((accum = [], item: any) => {
        const tgid = isCategorisedTours ? +tgidToScroll : tgidToScroll;
        if (item.tgid === tgid) {
          return [item, ...accum];
        } else {
          return [...accum, item];
        }
      }, []);
    }
  };

  const orderedTGIDRanking = csvTgidToArray(tourRanking);
  const orderedUncategorizedTours = isCategorisedTours
    ? sortTours(tgidToScroll, categorizedToursList, isCategorisedTours)
    : sortTours(tgidToScroll, uncategorizedToursList, isCategorisedTours);

  const orderedTours =
    isCategorisedTours || tgidToScroll
      ? orderedUncategorizedTours
      : orderedTGIDRanking?.length
      ? [...orderedUncategorizedTours]?.sort((tourA, tourB) => {
          return (
            orderedTGIDRanking?.indexOf(parseInt(tourA.tgid)) -
            orderedTGIDRanking?.indexOf(parseInt(tourB.tgid))
          );
        })
      : orderedUncategorizedTours;

  const [orderedFilteredTours, setOrderedFilteredTours] = useState(
    orderedTours
  );

  const [productsLoading, setProductsLoading] = useState(false);

  const orderedTgids = orderedTours?.length
    ? orderedTours?.map((tour: any) => tour.tgid)
    : [];

  const slices = contentFramework?.data?.body;
  const contentFWSlices = (slices && groupSlices(slices)) || [];

  const hasTourListContentFW: boolean = !!contentFWSlices.find(
    (slice: any) => slice.slice_type === 'tours_list'
  );

  const isReady = Object.values(scorpioData || {})?.length > 0;
  const pricingData = {
    isFetched: isReady,
    cardPrices: scorpioData,
  };

  const allTours = allToursParser(micrositeData, scorpioData, pricingData);

  let finalBannerImages = getFinalisedBannerImages(bannerImages);

  if (autoBanner) {
    const tgidArray = csvTgidToArray(tourRanking);
    finalBannerImages = tgidArray
      .map((tgid: any) => {
        let tour = scorpioData[tgid];
        if (tour)
          return {
            url: `https:${tour.images[0]?.url}`,
            alt: `https:${tour.images[0]?.alt}`,
          };
      })
      .slice(0, bannerLimit || orderedUncategorizedTours.length);
  }

  const finalHeaderSlices = !isHeaderInherited
    ? groupSlices(headerSlices || [], ALLOW_IMMEDIATE_NESTING)
    : [];
  const finalHeaderLinks =
    headerLinks && !isHeaderInherited ? headerLinks : null;
  const isCollectionMicrobrand = isCollectionMB(mbType);
  const isCategoryMicrobrand = isCategoryMB(mbType);
  const isSubCategoryMicrobrand = isSubCategoryMB(mbType);
  const showNewBanner =
    mbTheme !== THEMES.MIN_BLUE &&
    (isCollectionMicrobrand || isCategoryMicrobrand || isSubCategoryMicrobrand);

  //Subcategory/category MBs will always be non-POI irrespective of the config on Prismic
  const isNonPoiMB =
    isCategoryMicrobrand || isSubCategoryMicrobrand ? true : !baseLangIsPoiMb;

  const categoryHeaderMenuExists = checkIfCategoryHeaderExists({
    mbDesign: design,
    mbType,
  });

  const automatedBreadcrumbsExists = Object.keys(breadcrumbs).length > 1;
  const breadcrumbsDetails = {
    breadcrumbs,
    taggedCity,
    primaryCity,
  };

  useEffect(() => {
    setIsMobile(windowWidth < 768);
  }, [windowWidth]);

  useEffect(() => {
    if (tgidToScroll) {
      scroller.scrollTo(tgidToScroll, {
        duration: 1500,
        delay: 100,
        offset: isMobile ? -80 : -100,
        smooth: 'easeInOutQuint',
      });
    }

    const renderedBaseLangPageTitle = renderShortCodes(
      baseLangPageTitle
    )?.join?.('');

    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.LANGUAGE,
      value: currentLanguage,
    });

    sendVariableToDataLayer({
      name: ANALYTICS_PROPERTIES.PAGE_TITLE,
      value: renderedBaseLangPageTitle,
    });

    if (isCityPageMB) {
      const { mbCity, mbCountry } = mbLocationData;

      sendVariablesToDataLayer({
        [ANALYTICS_PROPERTIES.COUNTRY]: mbCountry,
        [ANALYTICS_PROPERTIES.CITY]: mbCity,
      });
    }
  }, []);

  useEffect(() => {
    if (!eventsReady) return;
    const renderedBaseLangPageTitle = renderShortCodes(
      baseLangPageTitle
    )?.join?.('');

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
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: isCityPageMB
        ? PAGE_TYPES.CITY_PAGE
        : PAGE_TYPES.COLLECTION,
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGIDS]: orderedTgids,
      [ANALYTICS_PROPERTIES.PAGE_TITLE]: renderedBaseLangPageTitle,
      [ANALYTICS_PROPERTIES.IS_DATE_FILTER]:
        isA1orC1MB(mbType) && isMobile
          ? BOOLEAN_STATES['YES']
          : BOOLEAN_STATES['NO'],
    });
  }, [eventsReady]);

  const onTogglePopup = () => {
    toggleFreeTourPopup(!freeTourPopupOpen);
  };

  const onCovidAlertClose = () => {
    toggleCovidAlert(false);
  };

  const openGroupBookingModal = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.GROUP_FORM_VIEWED,
    });

    toggleGroupBookingModal(true);
  };
  const bannerAndFooterSubText = getBannerAndFooterSubtext(
    baseLangIsPoiMb,
    baseLangBannerAndFooterCombinations
  );
  const { primarySubCategory: firstProductSubCategory } =
    (Object.values(scorpioData ?? {})?.[0] as Record<string, any>) || {};
  const bannerDescriptors = getBannerDescriptors({
    taggedMbType,
    taggedCategoryName,
    taggedSubCategoryName,
    firstProductSubCategory,
  });

  const availableTours = orderedTours?.filter(
    (tour: any) => scorpioData?.[tour?.tgid]?.available
  );

  const isToursAvailable = availableTours?.length > 0;
  const closeGroupBookingModal = () => toggleGroupBookingModal(false);
  const bannerVideo: string | undefined =
    bannerImageData?.resourceEntityMedias?.[0]?.medias?.[0]?.url;

  const isAirportTransfersMB =
    productCardData?.template === AIRPORT_TRANSFER_PRODUCT_CARD_TEMPLATE;

  const tourListSection = (
    <PopulateProducts
      currency={currency}
      uncategorizedTours={orderedFilteredTours.filter(
        (tour: TTour) => tour.flowType !== BOOKING_FLOW_TYPE.AIRPORT_TRANSFER
      )}
      scorpioData={scorpioData}
      uncategorizedToursHeading={uncategorizedToursHeading.list_heading}
      uid={uid}
      currentLanguage={currentLanguage}
      bookNowText={bookNowText}
      readMoreText={readMoreText}
      showLessText={showLessText}
      productOffer={productOffer}
      hasOffer={hasOffer}
      togglePopup={onTogglePopup}
      pageUrl={pageUrl}
      isMobile={isMobile}
      host={host}
      mbTheme={mbTheme}
      instantCheckout={instantCheckout}
      enableEarliestAvailability={enableEarliestAvailability}
      bannerVideo={bannerVideo}
      isCollectionMB={isCollectionMicrobrand}
      productsLoading={productsLoading}
      isNonPoi={isNonPoiMB}
      isAirportTransfersMB={isAirportTransfersMB}
    />
  );

  const shouldDisplayProductTrustBoosters = displayProductTrustBoosters(data);
  const shouldDisplayBannerTrustBoosters = displayBannerTrustBoosters(data);
  const finalEnableBuyTickets =
    enableBuyTickets === null ? 'Yes' : enableBuyTickets;

  const showAirportTransferProducts =
    hasTours &&
    !hasTourListContentFW &&
    isToursAvailable &&
    isAirportTransfersMB;

  return (
    <div>
      <div className="microsite-container">
        <Conditional if={groupBookingModalActive}>
          <GroupBooking
            closeGroupBookingModal={() => closeGroupBookingModal}
            groupBookingTourTitles={groupBookingTourTitles}
            blackoutStartDate={blackoutStartDate}
            blackoutEndDate={blackoutEndDate}
            blockNDaysGroupBooking={blockNDaysGroupBooking}
            minimumPax={minimumPax ? minimumPax : 10}
            maximumPax={maximumPax ? maximumPax : undefined}
            blockedDays={blockedDays || ''}
            isMobile={isMobile}
            disclaimer={groupBookingDisclaimer}
            theme={mbTheme}
          />
        </Conditional>
        <PopulateMeta
          {...{
            prismicData: micrositeData,
            datePublished,
            dateModified,
            serverRequestStartTimestamp,
            languages: alternateLanguages,
            isMobile,
            bannerImages: finalBannerImages,
            faviconUrl,
            logoUrl: logoUrl,
            collectionDetails,
            breadcrumbsDetails,
          }}
        />
        <Header
          languages={alternateLanguages}
          headerLinks={finalHeaderLinks}
          logoUrl={logoUrl}
          logoAltText={whiteLabelName || ''}
          currentLanguage={currentLanguage ? currentLanguage : null}
          uid={uid}
          openGroupBookingModal={openGroupBookingModal}
          isMobile={isMobile}
          showGroupBooking={showGroupBooking}
          enableBuyTickets={isToursAvailable ? finalEnableBuyTickets : false}
          logoRedirectionURL={logoRedirectionUrl || pageUrl}
          host={host}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
          slices={finalHeaderSlices}
          dropdownLinks={!isHeaderInherited ? dropdownLinks : null}
          hasDropdownLinks={!isHeaderInherited ? hasDropdownLinks : null}
          headerCurrencies={headerCurrencies}
          primaryCity={primaryCity}
          taggedCity={taggedCity}
          categoryHeaderMenu={categoryHeaderMenu}
          categoryHeaderMenuExists={categoryHeaderMenuExists}
          isCityPageMB={isCityPageMB}
        />
        <Conditional
          if={
            categoryHeaderMenuExists &&
            Object.keys(categoryHeaderMenu).length > 0 &&
            !isMobile
          }
        >
          <CategoryHeader
            categoryHeaderMenu={categoryHeaderMenu}
            primaryCity={primaryCity}
            taggedCity={taggedCity}
            languages={alternateLanguages}
            currentLanguage={currentLanguage}
            isMobile={false}
          />
        </Conditional>
        <Conditional if={showCovid19Alert && covidAlertActive}>
          <DismissAlert
            readMoreLink={COVID19_ALERT.LINK}
            readMore={READ_MORE}
            keyText={COVID19_ALERT.KEY_TEXT}
            text={COVID19_ALERT.TEXT}
            handleClose={onCovidAlertClose}
          />
        </Conditional>
        <Conditional if={isMobile && hasDropdownLinks}>
          <div className="main-wrapper city-selector">
            <ResponsiveSelector
              options={dropdownLinks}
              host={host}
              isMobile={isMobile}
              onChange={(option: any) => {
                window.location.href = option.value;
              }}
              iconPosition={'left'}
              icon={LOCATION}
              addPadding={true}
              toggleIcon={false}
            />
          </div>
        </Conditional>
        <Conditional if={!showNewBanner && !isCityPageMB}>
          <Banner
            bannerImages={finalBannerImages || null}
            bannerHeading={bannerHeading || null}
            bannerCtaText={bannerCtaText || null}
            bannerSubtext={bannerSubtext}
            // @ts-expect-error TS(2322): Type 'string | null' is not assignable to type 'st... Remove this comment to see the full error message
            currentLanguage={currentLanguage ? currentLanguage : null}
            isMobile={isMobile}
            boxed={true}
            hideCTA={isToursAvailable ? hideBannerCTA : true}
            orderedTgids={orderedTgids}
          />
        </Conditional>
        <Conditional if={isCityPageMB}>
          <CityPageContainer
            cityPageData={cityPageData}
            isMobile={isMobile}
            lang={lang}
            host={host}
            isDev={isDev}
            prismicBannerImages={finalBannerImages}
          />
        </Conditional>
        <Conditional if={showNewBanner}>
          <StaticBanner
            bannerVideo={bannerVideo}
            bannerImages={finalBannerImages || null}
            bannerHeading={bannerHeading || null}
            bannerSubText={bannerAndFooterSubText}
            isMobile={isMobile}
            collectionDetails={collectionDetails}
            ratingsAndReviewsData={
              isAirportTransfersMB
                ? calculateAvgRatingAndTotalReviews(scorpioData)
                : undefined
            }
            shouldDisplayTrustBoosters={shouldDisplayBannerTrustBoosters}
            isNonPoiMB={isNonPoiMB}
            bannerDescriptors={bannerDescriptors}
            city={isAirportTransfersMB ? productCardData?.city?.city : null}
          />
        </Conditional>
        <Conditional if={isA1orC1MB(mbType) && isMobile}>
          <LastMinuteFilters
            setOrderedFilteredTours={setOrderedFilteredTours}
            orderedTours={orderedTours}
            setProductsLoading={setProductsLoading}
          />
        </Conditional>
        <Conditional if={mbTheme === THEMES.MIN_BLUE}>
          <TextBanner bannerHeading={bannerHeading || null} />
        </Conditional>

        <Conditional if={alertPopup}>
          <Alert popupUID={alertPopup?.uid} currentLanguage={currentLanguage} />
        </Conditional>

        <Conditional if={coverSlices?.length}>
          <CoverSlicesWrapper>
            <LongForm content={coverSlices} isMobile={isMobile} />
          </CoverSlicesWrapper>
        </Conditional>

        <Conditional if={shouldDisplayProductTrustBoosters}>
          <F1TrustBoosters
            f1TrustBooster={getF1MBTrustBoosters(false)}
            isMobile={isMobile}
          />
        </Conditional>

        <Conditional
          if={
            hasTours &&
            !hasTourListContentFW &&
            isToursAvailable &&
            !isAirportTransfersMB
          }
        >
          {tourListSection}
        </Conditional>

        {showAirportTransferProducts ? (
          <PopulateAirportTransfersProducts
            uncategorizedTours={orderedFilteredTours}
            isMobile={isMobile}
            scorpioData={scorpioData}
            city={productCardData.city}
            sharedTransferProducts={tourListSection}
            uid={uid}
            currentLanguage={currentLanguage}
          />
        ) : null}

        <Conditional if={automatedBreadcrumbsExists}>
          <LazyComponent placeHolderHeight="3rem">
            <Breadcrumbs
              breadcrumbs={breadcrumbs}
              taggedCity={taggedCity}
              primaryCity={primaryCity}
              isMobile={isMobile}
            />
          </LazyComponent>
        </Conditional>

        <Conditional if={isAirportTransfersMB && longFormContent}>
          <LongFormAndStaticContent
            isMobile={isMobile}
            content={contentFWSlices}
          />
        </Conditional>

        <Conditional
          if={isA1orC1MB(mbType) && categoryHeaderMenu.CITY_ATTRACTIONS}
        >
          <LazyComponent>
            <CollectionCarousel
              allCollectionsData={categoryHeaderMenu.CITY_ATTRACTIONS}
              isMobile={isMobile}
              primaryCity={primaryCity}
              taggedCity={taggedCity}
            />
          </LazyComponent>
        </Conditional>

        <ProductsContextProvider allTours={allTours} ready={isReady}>
          <InteractionContextProvider>
            <Conditional if={longFormContent && !isCityPageMB}>
              <LongForm
                tourListSection={tourListSection}
                content={[...longFormContent, ...contentFWSlices]}
                automatedBreadcrumbsExists={automatedBreadcrumbsExists}
                isMobile={isMobile}
              />
            </Conditional>
          </InteractionContextProvider>
        </ProductsContextProvider>

        <Footer
          currentLanguage={currentLanguage}
          attraction={footerAttractionName}
          logoURL={logoUrl}
          logoAlt={whiteLabelName || ''}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
          disclaimerText={
            isCollectionMicrobrand ? bannerAndFooterSubText : disclaimerText
          }
          slices={!isFooterInherited ? slicesCFoot || [] : []}
          themeOverride={footerThemeOverride}
          secondaryHeading={footerHeadingSFoot}
          primaryHeading={footerHeadingCFoot}
          secondarySlices={!isSecondaryFooterInherited ? slicesSFoot || [] : []}
        />
        <Conditional if={hasOffer}>
          <FreeTourPopup
            popupState={freeTourPopupOpen}
            togglePopup={onTogglePopup}
            productOffer={offerPopup}
            scorpioData={scorpioData}
            isMobile={isMobile}
          />
        </Conditional>
      </div>
    </div>
  );
};

export default MicrositeV1;
