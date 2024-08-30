import { ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { asText } from '@prismicio/helpers';
import Mailer from 'components/CityPageContainer/Mailer';
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import LastMinuteFilters from 'components/common/LastMinuteFilters';
import LazyComponent from 'components/common/LazyComponent';
import PopulateMeta from 'components/common/NextSeoMeta';
import F1TrustBoosters from 'components/F1TrustBoosters/index';
import { BannerPlaceholder } from 'components/StaticBanner/styles';
import { InteractionContextProvider } from 'contexts/Interaction';
import { ProductsContextProvider } from 'contexts/Products';
import useABTesting from 'hooks/useABTesting';
import useOnScreen from 'hooks/useOnScreen';
import useWindowWidth from 'hooks/useWindowWidth';
import {
  checkIfHarryPotterPage,
  displayBannerTrustBoosters,
  displayProductTrustBoosters,
  getAlternateLanguages,
  getAnalyticsPageType,
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
import {
  sendVariablesToDataLayer,
  sendVariableToDataLayer,
  trackEvent,
} from 'utils/analytics';
import {
  checkIfCategoryHeaderExists,
  csvTgidToArray,
  findVideoUrlFromMediaData,
  getBannerDescriptors,
  getLangObject,
  groupSlices,
} from 'utils/helper';
import { getStructure } from 'utils/lookerUtils';
import { getFinalUncategorizedTours } from 'utils/productUtils';
import renderShortCodes from 'utils/shortCodes';
import { titleCase } from 'utils/stringUtils';
import { convertUidToUrl, getLogoRedirectionUrl } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { gtmAtom } from 'store/atoms/gtm';
import { AIRPORT_TRANSFER_SEARCH_ENABLED_UIDS_AIRPORT_MAP } from 'const/airportTransfers';
import { BOOKING_FLOW_TYPE } from 'const/booking';
import { VARIANTS } from 'const/experiments';
import {
  ALLOW_IMMEDIATE_NESTING,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BOOLEAN_STATES,
  CRUISE_CATEGORY_ID,
  CRUISES_REVAMP_UIDS,
  EMAIL_SUBCRIPTION,
  LFC_IMPACT_EXPERIMENT_EXCLUDED_UIDS,
  MB_CATEGORISATION,
  MB_TYPES,
  PAGE_TYPES,
  PAGE_URL_STRUCTURE,
  RANKING_EXPERIMENT_UIDS,
  SLICE_TYPES,
  TEMPLATES,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import Location from 'assets/location';
import { DEFAULT_MAGIC_WAND, HOVERED_MAGIC_WAND } from 'assets/magicWand';
import { TAirportTransfersProductSectionProps } from './AirportTransfers/AirportTransferProductsSection/interface';
import { AirportTransferHeroSection } from './AirportTransfers/HeroSection';
import { TCityInfo, TTour } from './AirportTransfers/interface';
import { AirportTransferLFAndStaticContent } from './AirportTransfers/LongFormAndStaticContent';
import { PopulateAirportTransfersProducts } from './AirportTransfers/PopulateAirportTransferProducts';
import SubCategoryFilters from './Cruises/SubcategoryFilters';
import { SUBCATEGORY_PILLS } from './Cruises/SubcategoryFilters/constants';

const AirportTransferProductsSection =
  dynamic<TAirportTransfersProductSectionProps>(() =>
    import(
      /* webpackChunkName: "AirportTransferProductsSection" */ './AirportTransfers/AirportTransferProductsSection'
    ).then((m) => m.AirportTransferProductsSection)
  );

const LongForm = dynamic(() => import('components/common/LongForm'));
const FreeTourPopup = dynamic(() => import('./FreeTourPopup'), { ssr: false });
const GroupBooking = dynamic(() => import('./GroupBooking'), { ssr: false });
const Alert = dynamic(() => import('UI/Alert'), { ssr: false });
const DismissAlert = dynamic(() => import('UI/DismissAlert'), { ssr: false });
const CollectionCarousel = dynamic(
  () =>
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

const StaticBanner = dynamic(
  () =>
    import(/* webpackChunkName: "StaticBanner" */ 'components/StaticBanner'),
  {
    loading: function BannerSkeleton() {
      return <BannerPlaceholder />;
    },
  }
);

const CityPageContainer = dynamic(
  () =>
    import(
      /* webpackChunkName: "CityPageContainer" */ 'components/CityPageContainer'
    )
);

const Banner = dynamic(
  () => import(/* webpackChunkName: "Banner" */ 'components/Banner')
);
const PopulateProducts = dynamic(() => import('components/PopulateProducts'));
const CategoryHeader = dynamic(
  () =>
    import(/* webpackChunkName: "CategoryHeader" */ 'components/CategoryHeader')
);
const Breadcrumbs = dynamic(
  () => import(/* webpackChunkName: "Breadcrumbs" */ 'components/Breadcrumbs')
);
const Loader = dynamic(
  () => import(/* webpackChunkName: "Loader" */ 'components/common/Loader')
);
const CatAndSubCatPage = dynamic(
  () =>
    import(
      /* webpackChunkName: "CatAndSubCatPage" */ 'components/CatAndSubCatPage'
    )
);

const CoverSlicesWrapper = styled.div`
  margin-bottom: 32px;
`;

const StyledMicrositeContainer = styled.div<{ $isHarryPotterPage: boolean }>`
  ${({ $isHarryPotterPage }) =>
    $isHarryPotterPage &&
    `
      & {
        cursor: url("${DEFAULT_MAGIC_WAND}") 0 0,
        auto !important;
      }
      
      .custom-hover,
      button,
      .active,
      .main-menu-item,
      .menu-item,
      a,
      span[role='button'],
      .rating-count .underline,
      .free-cancellation,
      div[role='button'],
      button > svg,
      .tabs div,
      div[role='button'].question,
      div[role='button'] > .question-text,
      .chevron-icon,
      .chevron-icon svg,
      .menu-items-container > div > div,
      .content-layer > div,
      .locale-button-wrapper, .locale-popover-header > div {
        cursor: url("${HOVERED_MAGIC_WAND}") 10 8,
          auto !important;
      }`}
`;

const MicrositeV1 = (props: any) => {
  const {
    toursList: uncategorizedToursList,
    tgidToScroll,
    data: microsite,
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
    catAndSubCatPageData,
    isCatOrSubCatPage,
    airportTransfersLPExperimentVariant = VARIANTS.CONTROL,
    categoryTourListDataWithRankingExperiment,
    categoryDescriptors,
    subcategoryDescriptors,
  } = props;
  const [isMobile, setIsMobile] = useState(props?.isMobile);
  const currency = useRecoilValue(currencyAtom);
  const { eventsReady } = useRecoilValue(gtmAtom);
  const [freeTourPopupOpen, toggleFreeTourPopup] = useState(false);
  const [covidAlertActive, toggleCovidAlert] = useState(false);
  const [groupBookingModalActive, toggleGroupBookingModal] = useState(false);
  const windowWidth = useWindowWidth();
  const [showLfcTimer, setShowLfcTimer] = useState(false);
  const [newVerticalsTimer, setNewVerticalsTimer] = useState(false);
  const [activeSubCat, setActiveSubCat] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNewVerticalsTimer(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLfcTimer(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const currentIsMobile = (windowWidth as number) < 768;
    if (isMobile !== currentIsMobile) {
      setIsMobile(currentIsMobile);
    }
  }, [windowWidth]);

  const {
    uid,
    lang,
    first_publication_date: datePublished,
    last_publication_date: dateModified,
    alternate_languages,
    data: micrositeData,
  } = microsite ?? {};

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
    content_framework: contentFramework,
    common_header_ref: commonHeader,
    footer_ref: commonFooter,
    secondary_footer: secondaryFooter,
    localisedCategoryTourListV1,
    customBanner,
    baseLangCustomBanner,
  } = micrositeData ?? {};

  const [isTourListFiltered, setIsTourListFiltered] = useState(false);
  const lfcRef = useRef(null);
  const footerRef = useRef(null);
  const isLfcIntersecting = useOnScreen({
    ref: lfcRef,
    unobserve: true,
  });
  const isFooterIntersecting = useOnScreen({
    ref: footerRef,
    unobserve: true,
  });

  const { isCityPageMB, cityPageData, mbLocationData } = cityPageParams || {};

  const {
    tagged_city: taggedCity,
    tagged_category: taggedCategoryName,
    tagged_sub_category: taggedSubCategoryName,
    tagged_mb_type: taggedMbType,
    shoulder_page_type: shoulderPageType,
    subattraction_type: subattractionType,
    tagged_page_type: taggedPageType,
  } = (baseLangCategorisationMetadata as TCategorisationMetadata) || {};

  const { COVID19_ALERT, READ_MORE } = strings;

  const pageUrl = convertUidToUrl({ uid, lang: getHeadoutLanguagecode(lang) });
  const isSubdomain =
    getStructure(new URL(pageUrl)) === PAGE_URL_STRUCTURE.SUBDOMAIN;

  const alternateLanguages = getAlternateLanguages(
    alternate_languages,
    isDev,
    host,
    uid
  );

  const { data: commonFooterData } = commonFooter || {};
  const { data: secondaryFooterData } = secondaryFooter || {};

  const productCardData =
    localisedCategoryTourListV1?.primary?.product_cards?.data ?? {};
  const { template } = productCardData || {};
  const isHOHO = template === TEMPLATES.HOHO;
  const isAirportTransfersMB = template === TEMPLATES.AIRPORT_TRANSFERS;
  const currentLanguage = getLangObject(lang).code;
  const isCruisesExperimentMB = CRUISES_REVAMP_UIDS.includes(uid);

  const {
    isEligible: isCruisesExpEligible,
    isExperimentResolving: isCruisesExpResolving,
    variant: cruisesVariant,
  } = useABTesting({
    experimentId: 'CRUISES_REVAMP',
    noTrack: false,
    customEligibilityCheckFn: () => isCruisesExperimentMB,
  });

  const {
    isEligible: isLFCImpactExpEligible,
    isExperimentResolving: isLFCExperimentResolving,
    variant: lfcExpVariant,
  } = useABTesting({
    experimentId: 'LFC_IMPACT',
    noTrack: true,
    customEligibilityCheckFn: () =>
      isSubdomain && !LFC_IMPACT_EXPERIMENT_EXCLUDED_UIDS.includes(uid),
  });

  const showHohoRevamp = isHOHO && isMobile;

  const {
    isEligible: shouldRunCustomCTAExperiment,
    isExperimentResolving: isCustomCTAExperimentResolving,
    variant: customCTAExperimentVariant,
  } = useABTesting({
    experimentId: 'C1_COLLECTION_LTT_BROADWAY_PRODUCT_CARD_CTA_EXPERIMENT',
    customEligibilityCheckFn: () =>
      taggedMbType === MB_TYPES.C1_COLLECTION &&
      (lang == 'it-it' || lang == 'de-de'),
  });

  const showCustomProductCardCTA =
    shouldRunCustomCTAExperiment &&
    customCTAExperimentVariant === VARIANTS.TREATMENT;

  const showCruisesRevamp =
    isCruisesExpEligible && cruisesVariant === VARIANTS.TREATMENT;

  const hideLFC =
    lfcExpVariant === VARIANTS.TREATMENT && isLFCImpactExpEligible;
  const showLFC = lfcExpVariant === VARIANTS.CONTROL && isLFCImpactExpEligible;

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
  const isCategorisedTours =
    Object.keys(categoryTourListData?.scorpioData ?? {})?.length > 0;

  const {
    isExperimentResolving: isRankingExperimentResolving,
    variant: rankingExperimentVariant,
    isEligible: isRankingExperimentEligible,
  } = useABTesting({
    experimentId: 'RANKING_EXPERIMENT_V2',
    customEligibilityCheckFn: () =>
      RANKING_EXPERIMENT_UIDS.includes(uid) &&
      categoryTourListDataWithRankingExperiment &&
      (lang === 'en-us' || lang === 'en'),
  });

  const {
    scorpioData: scorpioDataCategorised,
    orderedTours: categorizedToursList,
  } =
    (rankingExperimentVariant === VARIANTS.TREATMENT
      ? categoryTourListDataWithRankingExperiment
      : categoryTourListData) || {};

  const tourRanking = uncategorizedTours?.[0]?.primary?.ranking;
  const hasTours = isCategorisedTours
    ? categorizedToursList
    : uncategorizedToursList?.length > 0;

  const scorpioData = isCategorisedTours
    ? scorpioDataCategorised
    : scorpioDataUncategorised;

  const {
    faviconUrl,
    logo: { logoUrl = '', showPoweredLogo = true } = {},
    name: whiteLabelName,
  } = domainConfig || {};

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

  const orderedTGIDRanking = useMemo(() => {
    return csvTgidToArray(tourRanking);
  }, [tourRanking]);

  const orderedUncategorizedTours = useMemo(() => {
    return isCategorisedTours
      ? sortTours(tgidToScroll, categorizedToursList, isCategorisedTours)
      : sortTours(tgidToScroll, uncategorizedToursList, isCategorisedTours);
  }, [
    isCategorisedTours,
    tgidToScroll,
    categorizedToursList,
    uncategorizedToursList,
  ]);

  const orderedTours = useMemo(() => {
    return isCategorisedTours || tgidToScroll
      ? orderedUncategorizedTours
      : orderedTGIDRanking?.length
      ? [...orderedUncategorizedTours]?.sort((tourA, tourB) => {
          return (
            orderedTGIDRanking?.indexOf(parseInt(tourA.tgid)) -
            orderedTGIDRanking?.indexOf(parseInt(tourB.tgid))
          );
        })
      : orderedUncategorizedTours;
  }, [
    isCategorisedTours,
    tgidToScroll,
    orderedUncategorizedTours,
    orderedTGIDRanking,
  ]);

  const [orderedFilteredTours, setOrderedFilteredTours] =
    useState(orderedTours);

  useEffect(() => {
    if (rankingExperimentVariant !== VARIANTS.TREATMENT) return;
    setOrderedFilteredTours(orderedTours);
  }, [rankingExperimentVariant]);

  const [productsLoading, setProductsLoading] = useState(false);

  const orderedTgids = orderedTours?.length
    ? orderedTours?.map((tour: any) => tour.tgid)
    : [];

  const finalUncategorizedTours = getFinalUncategorizedTours({
    orderedFilteredTours,
    scorpioData,
    showCruisesRevamp,
    showHohoRevamp,
  });

  const subCatArray = finalUncategorizedTours.reduce(
    (acc: number[], item: Record<string, any>) => {
      const subCatId = scorpioData[item.tgid]?.primarySubCategory?.id;
      if (!acc.includes(subCatId)) {
        acc.push(subCatId);
      }
      return acc;
    },
    []
  );

  const subcategoryPills = SUBCATEGORY_PILLS().filter(
    (item) => !item.subCatId || subCatArray?.includes(item.subCatId)
  );

  useEffect(() => {
    if (tgidToScroll) {
      scroller.scrollTo(tgidToScroll, {
        duration: 1500,
        delay: 100,
        offset: isMobile ? -80 : -100,
        smooth: 'easeInOutQuint',
      });
    }

    const renderedBaseLangPageTitle =
      renderShortCodes(baseLangPageTitle)?.join?.('');

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
    const renderedBaseLangPageTitle =
      renderShortCodes(baseLangPageTitle)?.join?.('');

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
      [ANALYTICS_PROPERTIES.IS_BANNER_SLICE_PRESENT]: customBanner
        ? BOOLEAN_STATES['YES']
        : BOOLEAN_STATES['NO'],
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: getAnalyticsPageType({
        isCityPageMB,
        isHOHO,
        isAirportTransferMB: isAirportTransfersMB,
        defaultType: PAGE_TYPES.COLLECTION,
        isCatOrSubCatPage,
        isSubCategoryPage: isSubCategoryMicrobrand,
        isCruises: isCruisesExpEligible,
      }),
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGIDS]: orderedTgids,
      [ANALYTICS_PROPERTIES.PAGE_TITLE]: renderedBaseLangPageTitle,
      [ANALYTICS_PROPERTIES.IS_DATE_FILTER]:
        isA1orC1MB(taggedMbType) && isMobile
          ? BOOLEAN_STATES['YES']
          : BOOLEAN_STATES['NO'],
      [ANALYTICS_PROPERTIES.NUMBER_OF_PRODUCTS]: orderedTgids?.length ?? 0,
      [ANALYTICS_PROPERTIES.NUMBER_OF_SLICES]: contentFWSlices?.length ?? 0,
      [ANALYTICS_PROPERTIES.FIRST_SLICE_TYPE]: contentFWSlices?.find(
        (slice: Record<string, any>) =>
          slice?.slice_type !== SLICE_TYPES.BREADCRUMBS
      )?.slice_type,
      [ANALYTICS_PROPERTIES.IS_LANDING_PAGE]:
        taggedPageType === MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE,
      ...(isAirportTransfersMB && {
        [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.IS_SEARCH_PRESENT]:
          isAirportTransfersSubCategory || isAirportTransfersSearchEnabledUID
            ? BOOLEAN_STATES['YES']
            : BOOLEAN_STATES['NO'],
        [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.NUMBER_OF_PRODUCTS]:
          orderedFilteredTours.filter(
            (tour: TTour) =>
              tour.flowType !== BOOKING_FLOW_TYPE.PRIVATE_AIRPORT_TRANSFER
          ).length,
        [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.PRIVATE_TRANSFERS_PRESENT]:
          orderedFilteredTours.filter(
            (tour: TTour) =>
              tour.flowType === BOOKING_FLOW_TYPE.PRIVATE_AIRPORT_TRANSFER
          )?.length ?? 0,
      }),
      ...(subattractionType && {
        [ANALYTICS_PROPERTIES.SUBATTRACTION_TYPE]: subattractionType,
      }),
      ...(showCruisesRevamp && {
        [ANALYTICS_PROPERTIES.FILTERS_PRESENT]: subcategoryPills?.map(
          (pill) => pill.label
        ),
        [ANALYTICS_PROPERTIES.PRIMARY_PRODUCTS_PRESENT]:
          finalUncategorizedTours?.filter(
            (tour: Record<string, any>) =>
              scorpioData[tour.tgid]?.primaryCategory?.id === CRUISE_CATEGORY_ID
          )?.length,
      }),
    });
  }, [eventsReady]);

  const uncategorizedToursHeading = hasTours
    ? isCategorisedTours
      ? ''
      : uncategorizedTours?.[0].primary
    : '';

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
  const disclaimerText = disclaimerTextCFoot || asText(disclaimerCMS);
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

  const slices = contentFramework?.data?.body;
  const contentFWSlices = (slices && groupSlices(slices)) || [];
  const hasTourListContentFW: boolean = !!contentFWSlices.find(
    (slice: any) => slice.slice_type === 'tours_list'
  );

  const isReady = Object.values(scorpioData || {})?.length > 0;

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
  const isCollectionMicrobrand = isCollectionMB(taggedMbType);
  const isCategoryMicrobrand = isCategoryMB(taggedMbType);
  const isSubCategoryMicrobrand = isSubCategoryMB(taggedMbType);
  const showNewBanner =
    mbTheme !== THEMES.MIN_BLUE &&
    (isCollectionMicrobrand || isCategoryMicrobrand || isSubCategoryMicrobrand);

  //Subcategory/category MBs will always be non-POI irrespective of the config on Prismic
  const isNonPoiMB =
    isCategoryMicrobrand || isSubCategoryMicrobrand ? true : !baseLangIsPoiMb;
  const isNonPoiCollectionMB = isNonPoiMB && isCollectionMicrobrand;

  const showPopupNonPOI =
    !isMobile &&
    ((isNonPoiMB &&
      (taggedMbType === MB_TYPES.A1_CATEGORY ||
        taggedMbType === MB_TYPES.A2_CATEGORY ||
        taggedMbType === MB_TYPES.A1_SUB_CATEGORY ||
        taggedMbType === MB_TYPES.A2_SUB_CATEGORY)) ||
      (isNonPoiCollectionMB &&
        (taggedMbType === MB_TYPES.A1_COLLECTION ||
          taggedMbType === MB_TYPES.B1_GLOBAL ||
          taggedMbType === MB_TYPES.C1_COLLECTION)));

  const showPopup =
    !isMobile &&
    (((isA1orC1MB(taggedMbType) || taggedMbType === MB_TYPES.B1_GLOBAL) &&
      baseLangIsPoiMb) ||
      showHohoRevamp ||
      taggedSubCategoryName === 'Day Trips' ||
      showPopupNonPOI);

  const isPoiMwebCard = isMobile && isA1orC1MB(taggedMbType) && baseLangIsPoiMb;

  const showItineraries =
    !(taggedSubCategoryName === 'HOHO' || taggedCategoryName === 'Cruises') &&
    !!scorpioData?.itineraryData?.itineraries?.length;

  const categoryHeaderMenuExists = checkIfCategoryHeaderExists({
    mbDesign: design,
    mbType: taggedMbType,
  });

  const automatedBreadcrumbsExists = Object.keys(breadcrumbs ?? {}).length > 0;
  const breadcrumbsDetails = {
    breadcrumbs,
    taggedCity,
    primaryCity,
  };

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
  const firstProduct = orderedTgids?.[0];
  const { primarySubCategory: firstProductSubCategory } =
    scorpioData?.[firstProduct] || {};
  const bannerDescriptors = getBannerDescriptors({
    taggedMbType,
    taggedCategoryName,
    taggedSubCategoryName,
    firstProductSubCategory,
    categoryDescriptors,
    subcategoryDescriptors,
    lang,
    cityName: primaryCity?.displayName,
  });

  const availableTours = orderedTours?.filter(
    (tour: any) => scorpioData?.[tour?.tgid]?.available
  );

  const isToursAvailable = availableTours?.length > 0;
  const closeGroupBookingModal = () => toggleGroupBookingModal(false);
  const bannerVideo = findVideoUrlFromMediaData(
    bannerImageData?.resourceEntityMedias?.[0]?.medias
  );

  const tourListSection = (
    <PopulateProducts
      // @ts-ignore
      currency={currency}
      uncategorizedTours={finalUncategorizedTours}
      scorpioData={
        rankingExperimentVariant === VARIANTS.TREATMENT
          ? categoryTourListDataWithRankingExperiment?.scorpioData
          : scorpioData
      }
      uncategorizedToursHeading={uncategorizedToursHeading.list_heading}
      uid={uid}
      currentLanguage={currentLanguage}
      bookNowText={bookNowText}
      shouldRunCustomCTAExperiment={shouldRunCustomCTAExperiment}
      showCustomProductCardCTA={showCustomProductCardCTA}
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
      isPoiMwebCard={isPoiMwebCard}
      isNonPoi={isNonPoiMB}
      isAirportTransfersMB={isAirportTransfersMB}
      isModifiedProductCard={!isMobile && !showCruisesRevamp}
      isTourListFiltered={isTourListFiltered}
      showPopup={showPopup}
      isHOHORevamp={showHohoRevamp}
      isNVResolving={isCruisesExpEligible && !newVerticalsTimer}
      showItineraries={showItineraries}
      isCruisesRevamp={showCruisesRevamp}
      isNewVerticalsProductCard={showHohoRevamp || showCruisesRevamp}
      activeSubCat={activeSubCat}
      customBanner={customBanner?.primary}
      baseLangCustomBanner={baseLangCustomBanner?.primary}
    />
  );

  const shouldDisplayProductTrustBoosters =
    displayProductTrustBoosters(micrositeData);
  const shouldDisplayBannerTrustBoosters =
    displayBannerTrustBoosters(micrositeData);

  const showAirportTransferProducts =
    hasTours &&
    !hasTourListContentFW &&
    isToursAvailable &&
    isAirportTransfersMB;

  const isAirportTransfersSubCategory =
    taggedSubCategoryName === 'Airport Transfers' &&
    taggedMbType === MB_TYPES.A1_SUB_CATEGORY;

  const isAirportTransfersSearchEnabledUID =
    !!AIRPORT_TRANSFER_SEARCH_ENABLED_UIDS_AIRPORT_MAP[uid];

  useEffect(() => {
    if (isLfcIntersecting && showLFC && showLfcTimer) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION_TYPE]: 'Long-Form Content',
        [ANALYTICS_PROPERTIES.SLICE_TYPE]: contentFWSlices[0]?.slice_type,
      });
    }
  }, [isLfcIntersecting, showLFC, showLfcTimer, contentFWSlices]);

  useEffect(() => {
    if (isFooterIntersecting && showLFC && showLfcTimer) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: 'Footer',
        [ANALYTICS_PROPERTIES.SECTION_TYPE]: 'Footer',
      });
    }
  }, [isFooterIntersecting, showLFC, showLfcTimer]);

  useEffect(() => {
    if (
      !eventsReady ||
      !isAirportTransfersMB ||
      !['LONDON', 'ROME'].includes(primaryCity?.cityCode)
    )
      return;

    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIMENT_VIEWED,
      [ANALYTICS_PROPERTIES.EXPERIMENT_NAME]: 'Airport Transfers Landing Page',
      [ANALYTICS_PROPERTIES.EXPERIMENT_VARIANT]:
        airportTransfersLPExperimentVariant,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.IS_SEARCH_PRESENT]:
        isAirportTransfersSubCategory || isAirportTransfersSearchEnabledUID
          ? BOOLEAN_STATES['YES']
          : BOOLEAN_STATES['NO'],
    });
  }, [eventsReady, isAirportTransfersMB]);

  const isHarryPotterPage = checkIfHarryPotterPage(uid);

  if (
    (isCruisesExpEligible && isCruisesExpResolving) ||
    (isLFCImpactExpEligible && isLFCExperimentResolving) ||
    (isRankingExperimentEligible && isRankingExperimentResolving) ||
    (shouldRunCustomCTAExperiment && isCustomCTAExperimentResolving)
  )
    return <Loader />;

  return (
    <div>
      <StyledMicrositeContainer
        $isHarryPotterPage={isHarryPotterPage}
        className="microsite-container"
      >
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
          logoRedirectionURL={logoRedirectionUrl || pageUrl}
          host={host}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
          slices={finalHeaderSlices}
          dropdownLinks={!isHeaderInherited ? dropdownLinks : null}
          hasDropdownLinks={
            !isHeaderInherited && !showHohoRevamp ? hasDropdownLinks : null
          }
          headerCurrencies={headerCurrencies}
          primaryCity={primaryCity}
          taggedCity={taggedCity}
          categoryHeaderMenu={categoryHeaderMenu}
          categoryHeaderMenuExists={categoryHeaderMenuExists}
          isCityPageMB={isCityPageMB}
          isDarkTheme={showHohoRevamp}
          isAirportTransfersMB={isAirportTransfersMB}
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
            showShadowOnSticky={!isAirportTransfersMB}
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
        <Conditional if={isMobile && hasDropdownLinks && !showHohoRevamp}>
          <div className="main-wrapper city-selector">
            <ResponsiveSelector
              options={dropdownLinks}
              host={host}
              isMobile={isMobile}
              onChange={(option: any) => {
                window.location.href = option.value;
              }}
              iconPosition={'left'}
              icon={Location}
              addPadding={true}
              toggleIcon={false}
            />
          </div>
        </Conditional>

        <Conditional if={!showNewBanner && !isCityPageMB && !isCatOrSubCatPage}>
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

        <Conditional if={isCityPageMB && !isCatOrSubCatPage}>
          <CityPageContainer
            cityPageData={cityPageData}
            isMobile={isMobile}
            lang={lang}
            host={host}
            isDev={isDev}
            prismicBannerImages={finalBannerImages}
            pageUrl={pageUrl}
          />
        </Conditional>

        <Conditional
          if={
            isAirportTransfersMB &&
            airportTransfersLPExperimentVariant === VARIANTS.TREATMENT
          }
        >
          <AirportTransferHeroSection
            cityName={primaryCity?.displayName}
            isMobile={isMobile}
            tours={orderedFilteredTours}
            tgidScorpioDataMap={scorpioData}
            shouldShowSearch={
              isAirportTransfersSubCategory ||
              isAirportTransfersSearchEnabledUID
            }
          />
        </Conditional>

        <Conditional
          if={
            showNewBanner &&
            !isCatOrSubCatPage &&
            (airportTransfersLPExperimentVariant === VARIANTS.CONTROL ||
              !isAirportTransfersMB)
          }
        >
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
            isNonPoiCollectionMB={isNonPoiCollectionMB}
            bannerDescriptors={bannerDescriptors}
            isHOHORevamp={showHohoRevamp}
            isHOHO={isHOHO}
            cityName={primaryCity?.displayName}
            city={
              isAirportTransfersMB
                ? (productCardData?.city as TCityInfo)?.city
                : null
            }
            isCruisesRevamp={showCruisesRevamp}
          />
        </Conditional>
        <Conditional
          if={isA1orC1MB(taggedMbType) && isMobile && !isAirportTransfersMB}
        >
          <LastMinuteFilters
            setOrderedFilteredTours={setOrderedFilteredTours}
            orderedTours={orderedTours}
            setProductsLoading={setProductsLoading}
            changeTourListFilterStatus={(state) => {
              if (state !== isTourListFiltered) setIsTourListFiltered(state);
            }}
          />
        </Conditional>
        <Conditional if={mbTheme === THEMES.MIN_BLUE && !isCatOrSubCatPage}>
          <TextBanner bannerHeading={bannerHeading || null} />
        </Conditional>

        <Conditional if={alertPopup}>
          <Alert popupUID={alertPopup?.uid} currentLanguage={currentLanguage} />
        </Conditional>

        <Conditional
          if={coverSlices?.length && !isCatOrSubCatPage && !showCruisesRevamp}
        >
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
        <Conditional if={showCruisesRevamp && subcategoryPills?.length > 2}>
          <SubCategoryFilters
            isMobile={isMobile}
            subCategoryPills={subcategoryPills}
            setActiveSubCat={(subCatId) => {
              setActiveSubCat(subCatId);
              setProductsLoading(true);
              setTimeout(() => {
                setProductsLoading(false);
              }, 500);
            }}
          />
        </Conditional>
        <Conditional
          if={
            hasTours &&
            !hasTourListContentFW &&
            isToursAvailable &&
            !isCatOrSubCatPage &&
            !isAirportTransfersMB
          }
        >
          {tourListSection}
        </Conditional>

        {showAirportTransferProducts &&
        airportTransfersLPExperimentVariant === VARIANTS.CONTROL ? (
          <PopulateAirportTransfersProducts
            uncategorizedTours={orderedFilteredTours}
            isMobile={isMobile}
            scorpioData={scorpioData}
            city={productCardData?.city as TCityInfo}
            sharedTransferProducts={tourListSection}
            uid={uid}
            currentLanguage={currentLanguage}
          />
        ) : null}

        <Conditional
          if={
            showAirportTransferProducts &&
            airportTransfersLPExperimentVariant === VARIANTS.TREATMENT
          }
        >
          <AirportTransferProductsSection
            isMobile={isMobile}
            tgidScorpioDataMap={scorpioData}
            uncategorizedTours={orderedFilteredTours}
            enableEarliestAvailability={enableEarliestAvailability}
            currency={currency}
            isSubCategoryPage={isAirportTransfersSubCategory}
            hasCategoryHeaderMenu={Object.keys(categoryHeaderMenu).length > 0}
          />
        </Conditional>

        <Conditional
          if={
            automatedBreadcrumbsExists &&
            !isCatOrSubCatPage &&
            !isAirportTransfersMB
          }
        >
          <LazyComponent placeHolderHeight="3rem">
            <Breadcrumbs
              breadcrumbs={breadcrumbs}
              taggedCity={taggedCity}
              primaryCity={primaryCity}
              isMobile={isMobile}
            />
          </LazyComponent>
        </Conditional>

        <Conditional if={isCatOrSubCatPage}>
          <CatAndSubCatPage
            catAndSubCatPageData={catAndSubCatPageData}
            breadcrumbs={breadcrumbs}
            primaryCity={primaryCity}
            isMobile={isMobile}
          />
        </Conditional>

        <Conditional if={isAirportTransfersMB && longFormContent}>
          <AirportTransferLFAndStaticContent
            airportTransferVariant={airportTransfersLPExperimentVariant}
            isMobile={isMobile}
            content={contentFWSlices}
          />
        </Conditional>

        <Conditional
          if={isA1orC1MB(taggedMbType) && categoryHeaderMenu.CITY_ATTRACTIONS}
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

        <div ref={lfcRef}>
          <Conditional if={!hideLFC}>
            <ProductsContextProvider ready={isReady}>
              <InteractionContextProvider>
                <Conditional if={longFormContent}>
                  <LongForm
                    tourListSection={tourListSection}
                    content={[...longFormContent, ...contentFWSlices]}
                    automatedBreadcrumbsExists={automatedBreadcrumbsExists}
                    isRevampedDesign={isCatOrSubCatPage}
                    isMobile={isMobile}
                    isHOHORevamp={showHohoRevamp}
                    isAirportTransfersMB={isAirportTransfersMB}
                    isCatAndSubCatPage={isCatOrSubCatPage}
                  />
                </Conditional>
              </InteractionContextProvider>
            </ProductsContextProvider>
          </Conditional>
        </div>

        <Conditional if={isCatOrSubCatPage}>
          <LazyComponent>
            <Mailer
              isMobile={isMobile}
              heading={strings.formatString(
                strings.CITY_PAGE.MAILER.HEADING,
                titleCase(taggedCity || primaryCity?.displayName || '')
              )}
              subHeading={strings.CITY_PAGE.MAILER.SUBHEADING}
              eventName={EMAIL_SUBCRIPTION.CAT_SUBCAT_PAGE_EVENT}
              isCatOrSubCatPage={true}
            />
          </LazyComponent>
        </Conditional>

        <div ref={footerRef}>
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
            secondarySlices={
              !isSecondaryFooterInherited ? slicesSFoot || [] : []
            }
            isCatOrSubCatPage={isCatOrSubCatPage}
            isDarkPurps={showHohoRevamp}
          />
        </div>
        <Conditional if={hasOffer}>
          <FreeTourPopup
            popupState={freeTourPopupOpen}
            togglePopup={onTogglePopup}
            productOffer={offerPopup}
            scorpioData={scorpioData}
            isMobile={isMobile}
          />
        </Conditional>
      </StyledMicrositeContainer>
    </div>
  );
};

export default MicrositeV1;
