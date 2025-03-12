import { ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { asText } from '@prismicio/helpers';
import Mailer from 'components/CityPageContainer/Mailer';
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import LastMinuteFilters from 'components/common/LastMinuteFilters';
import LazyComponent from 'components/common/LazyComponent';
import PopulateMeta from 'components/common/NextSeoMeta';
import F1TrustBoosters from 'components/F1TrustBoosters/index';
import LfcQna from 'components/QnA/LfcQnA';
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
  checkIfBroadwayMB,
  checkIfCategoryHeaderExists,
  checkIfLTTMB,
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
import { appAtom } from 'store/atoms/app';
import { currencyAtom } from 'store/atoms/currency';
import { gtmAtom } from 'store/atoms/gtm';
import { DAY_TRIPS_COLLECTION_MBS } from 'const/daytrips';
import { VARIANTS } from 'const/experiments';
import {
  ALLOW_IMMEDIATE_NESTING,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BOOLEAN_STATES,
  BOOSTER_EXPERIMENT_UIDS,
  C1_COLLECTION_EXCLUDED,
  CRUISE_CATEGORY_ID,
  CRUISE_FORMAT_SUBCAT_IDS,
  CRUISES_REVAMP_UIDS,
  DT_LISTICLE_EXPERIMENT_UIDS,
  DUBAI_DESERT_SAFARI,
  EMAIL_SUBCRIPTION,
  LFC_IMPACT_EXPERIMENT_EXCLUDED_UIDS,
  MB_CATEGORISATION,
  MB_TYPES,
  PAGE_TYPES,
  PAGE_URL_STRUCTURE,
  QNA_EXP_UIDS,
  SLICE_TYPES,
  TEMPLATES,
  TGIDS_WITH_CANCELLATION_INSURANCE,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import Location from 'assets/location';
import { DEFAULT_MAGIC_WAND, HOVERED_MAGIC_WAND } from 'assets/magicWand';
import { AirportTransferLFAndStaticContent } from './AirportTransfers/LongFormAndStaticContent';
import { PopulateAirportTransfersProducts } from './AirportTransfers/PopulateAirportTransferProducts';
import CommonHeader from './common/Header';
import { POIFilters } from './common/POIFilters';
import { TPOIFilterType } from './common/POIFilters/constant';
import { poiFiltersWrapperStyle } from './common/POIFilters/styles';
import {
  filterToursByPOIFilter,
  getAvailablePOIFilterTypes,
} from './common/POIFilters/utils';
import { getFilteredTgids } from './DayTripsCollection/utils';
import DesktopBannerV2 from './MicrositeV2/DesktopBannerV2';
import EntertainmentHeader from './MicrositeV2/Header';
import MobileBannerV2 from './MicrositeV2/MobileBannerV2';
import { ICollectionCarousel } from './slices/CollectionCarousel/interface';

const PopulateProducts = dynamic(() => import('components/PopulateProducts'));
const POICollectionsSection = dynamic<ICollectionCarousel>(() =>
  import(
    /* webpackChunkName: "POICollectionsSection" */ './POICollectionsSection'
  ).then((m) => m.POICollectionsSection)
);
const LongForm = dynamic(() => import('components/common/LongForm'));
const FreeTourPopup = dynamic(() => import('./FreeTourPopup'), { ssr: false });
const GroupBooking = dynamic(() => import('./GroupBooking'), { ssr: false });
const DismissAlert = dynamic(() => import('UI/DismissAlert'), { ssr: false });
const CollectionCarousel = dynamic(
  () =>
    import(
      /* webpackChunkName: "CollectionCarousel" */ 'components/slices/CollectionCarousel'
    )
);

const ResponsiveSelector: ComponentType<React.PropsWithChildren<any>> = dynamic(
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

const DayTripsCollectionPage = dynamic(
  () =>
    import(
      /* webpackChunkName: "DayTripsCollectionPage" */ 'components/DayTripsCollection'
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
    categoryDescriptors,
    subcategoryDescriptors,
    isEntertainmentBanner,
    bannerTrustBoosters,
    collectionReviews,
    catSubCatReviews,
    categoryId,
    subCategoryId,
    botReviewsByTGID,
    qnaSnippets,
    qnaSections,
    isRankingExperimentResolving,
    isNotUsingAutomatedRanking = true,
    bannerV3Data,
    dayTripCollectionData,
  } = props;
  const [isMobile, setIsMobile] = useState(props?.isMobile);
  const currency = useRecoilValue(currencyAtom);
  const { eventsReady } = useRecoilValue(gtmAtom);
  const [freeTourPopupOpen, toggleFreeTourPopup] = useState(false);
  const [covidAlertActive, toggleCovidAlert] = useState(false);
  const [groupBookingModalActive, toggleGroupBookingModal] = useState(false);
  const windowWidth = useWindowWidth();
  const [showLfcTimer, setShowLfcTimer] = useState(false);
  const router = useRouter();
  const { isBot } = useRecoilValue(appAtom);

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
    banner_subtext: customBannerSubtext,
    banner_cta_text: bannerCtaText,
    auto_banner: autoBanner,
    hide_banner_cta: hideBannerCTA,
    banner_limit: bannerLimit,
    body1: uncategorizedTours,
    show_covid19_alert: showCovid19Alert,
    body4: coverSlices,
    currencies_list,
    group_booking_excluded_tgids: groupBookingExcludedTgids,
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
    tagged_collection,
    customBanner,
    baseLangCustomBanner,
    dropdownMenu,
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

  const isLfcInView = useOnScreen({
    ref: lfcRef,
  });

  const isFooterInView = useOnScreen({
    ref: footerRef,
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
    tagged_collection: _taggedCollection,
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

  const cruiseFormatTest = router.query.cruiseFormatTest;
  const productCardData =
    localisedCategoryTourListV1?.primary?.product_cards?.data ?? {};
  const showSightsCoveredItineraryLayout =
    localisedCategoryTourListV1?.primary?.show_sights_covered_itinerary_layout;
  const { template } = productCardData || {};
  const isHOHO = template === TEMPLATES.HOHO;
  const isAirportTransfersMB = template === TEMPLATES.AIRPORT_TRANSFERS;
  const isDesertSafariMB = uid === DUBAI_DESERT_SAFARI;

  const {
    isEligible: isCruisesCombosExpEligible,
    isExperimentResolving: isCruisesCombosExpResolving,
    variant: cruisesCombosVariant,
  } = useABTesting({
    experimentId: 'CRUISES_COMBO_REVAMP',
    noTrack: false,
    customEligibilityCheckFn: () => CRUISES_REVAMP_UIDS.includes(uid),
  });

  const showCruisesCombosRevamp =
    isCruisesCombosExpEligible && cruisesCombosVariant === VARIANTS.TREATMENT;
  const showCruisesFormat =
    CRUISES_REVAMP_UIDS.includes(uid) ||
    template === TEMPLATES.CRUISES ||
    !!cruiseFormatTest;
  const currentLanguage = getLangObject(lang).code;
  const showLastMinFilters =
    isA1orC1MB(taggedMbType) &&
    isMobile &&
    !isAirportTransfersMB &&
    !showCruisesFormat;

  const isLangEn = lang === 'en-us' || lang === 'en';

  const {
    isEligible: isQnaExpEligible,
    isExperimentResolving: isQnaExpResolving,
    variant: qnaExpVariant,
  } = useABTesting({
    experimentId: 'QNA_EXPERIMENT',
    customEligibilityCheckFn: () => QNA_EXP_UIDS.includes(uid) && isLangEn,
  });

  const showQnaExperiment =
    ((qnaExpVariant === VARIANTS.TREATMENT && isQnaExpEligible) ||
      (isBot && isLangEn)) &&
    qnaSections?.length &&
    qnaSnippets?.length;

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

  const {
    isEligible: shouldRunCustomEnglishCTAExperiment,
    isExperimentResolving: isCustomEnglishCTAExperimentResolving,
    variant: customCTAEnglishExperimentVariant,
  } = useABTesting({
    experimentId: 'C1_COLLECTION_PRODUCT_CARD_CTA_EXPERIMENT_ENGLISH',
    customEligibilityCheckFn: () =>
      taggedMbType === MB_TYPES.C1_COLLECTION &&
      !C1_COLLECTION_EXCLUDED.includes(Number(tagged_collection)) &&
      (lang === 'en-us' || lang === 'en'),
  });

  const {
    isEligible: shouldRunHohoRevampExperiment,
    isExperimentResolving: isHohoExperimentResolving,
    variant: hohoExperimentVariant,
  } = useABTesting({
    experimentId: 'HOHO_REVAMP_PARIS_BARCELONA',
    customEligibilityCheckFn: () => isMobile && isHOHO,
  });

  const showHohoRevamp =
    shouldRunHohoRevampExperiment && hohoExperimentVariant === VARIANTS.CONTROL;

  const isBoosterExpEligible = BOOSTER_EXPERIMENT_UIDS.has(uid);

  const showCustomProductCardEnglishCTA =
    shouldRunCustomEnglishCTAExperiment &&
    customCTAEnglishExperimentVariant === VARIANTS.TREATMENT;

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
    scorpioData: scorpioDataCategorised,
    orderedTours: categorizedToursList,
  } = categoryTourListData || {};

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

  const [activePOIFilter, setActivePOIFilter] = useState<TPOIFilterType | null>(
    null
  );

  const { filteredOutTours, filteredTours: finalOrderedFilteredTours } =
    useMemo(() => {
      return filterToursByPOIFilter(
        orderedFilteredTours,
        activePOIFilter,
        scorpioData
      );
    }, [orderedFilteredTours, scorpioData, activePOIFilter]);

  const poiFilterTypes = useMemo(
    () => getAvailablePOIFilterTypes(orderedTours, scorpioData),
    [orderedTours.length]
  );

  useEffect(() => {
    if (isNotUsingAutomatedRanking) return;
    setOrderedFilteredTours(orderedTours);
  }, [isNotUsingAutomatedRanking]);

  const [productsLoading, setProductsLoading] = useState(false);

  const orderedTgids = orderedTours?.length
    ? orderedTours?.map((tour: any) => tour.tgid)
    : [];

  const finalUncategorizedTours = getFinalUncategorizedTours({
    orderedFilteredTours: finalOrderedFilteredTours,
    scorpioData,
    sortNonCruiseTours: showCruisesFormat && !showCruisesCombosRevamp,
    showHohoRevamp,
  });

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

  const isDayTripCollectionPage = collectionDetails.type === 'DAY_TRIP';

  const {
    isEligible: shouldRunDayTripsCollectionExperimentDWeb,
    variant: dayTripsCollectionExperimentDWebVariant,
    isExperimentResolving: isDayTripsCollectionExperimentDWebResolving,
  } = useABTesting({
    experimentId: 'DAY_TRIPS_COLLECTION_DWEB',
    customEligibilityCheckFn: () =>
      !isMobile &&
      isDayTripCollectionPage &&
      DAY_TRIPS_COLLECTION_MBS.includes(uid),
    additionalEventProps: () => {
      const productCardIds = getFilteredTgids(dayTripCollectionData);
      return {
        [ANALYTICS_PROPERTIES.NUMBER_OF_PRODUCTS]: productCardIds.length,
      };
    },
  });

  const {
    isEligible: shouldRunDayTripsCollectionExperimentMWeb,
    variant: dayTripsCollectionExperimentMwebVariant,
    isExperimentResolving: isDayTripsCollectionExperimentMWebResolving,
  } = useABTesting({
    experimentId: 'DAY_TRIPS_COLLECTION_MWEB',
    customEligibilityCheckFn: () =>
      isMobile &&
      isDayTripCollectionPage &&
      DAY_TRIPS_COLLECTION_MBS.includes(uid),
    additionalEventProps: () => {
      const productCardIds = getFilteredTgids(dayTripCollectionData);
      return {
        [ANALYTICS_PROPERTIES.NUMBER_OF_PRODUCTS]: productCardIds.length,
      };
    },
  });

  const revampedDayTripsCollectionDweb =
    shouldRunDayTripsCollectionExperimentDWeb &&
    dayTripsCollectionExperimentDWebVariant === VARIANTS.TREATMENT &&
    isDayTripCollectionPage;

  const revampedDayTripsCollectionMweb =
    shouldRunDayTripsCollectionExperimentMWeb &&
    dayTripsCollectionExperimentMwebVariant === VARIANTS.TREATMENT &&
    isDayTripCollectionPage;

  const revampedDayTripsCollection =
    revampedDayTripsCollectionDweb || revampedDayTripsCollectionMweb;

  useEffect(() => {
    if (!eventsReady) return;
    if (
      isDayTripCollectionPage &&
      (isDayTripsCollectionExperimentDWebResolving ||
        isDayTripsCollectionExperimentMWebResolving)
    )
      return;
    let numberOfProducts = orderedTgids?.length ?? 0;
    let tgids = orderedTgids;

    if (revampedDayTripsCollection) {
      const productCardIds = getFilteredTgids(dayTripCollectionData);
      tgids = productCardIds;
      numberOfProducts = tgids?.length ?? 0;
    }

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
        isCruises: showCruisesFormat,
      }),
      ...(revampedDayTripsCollection
        ? { [ANALYTICS_PROPERTIES.LAYOUT_TYPE]: 'Day Trips' }
        : {}),
      [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
      [ANALYTICS_PROPERTIES.TGIDS]: tgids,
      [ANALYTICS_PROPERTIES.PAGE_TITLE]: renderedBaseLangPageTitle,
      [ANALYTICS_PROPERTIES.IS_DATE_FILTER]:
        isA1orC1MB(taggedMbType) && isMobile
          ? BOOLEAN_STATES['YES']
          : BOOLEAN_STATES['NO'],
      [ANALYTICS_PROPERTIES.NUMBER_OF_PRODUCTS]: numberOfProducts,
      [ANALYTICS_PROPERTIES.NUMBER_OF_SLICES]: contentFWSlices?.length ?? 0,
      [ANALYTICS_PROPERTIES.FIRST_SLICE_TYPE]: contentFWSlices?.find(
        (slice: Record<string, any>) =>
          slice?.slice_type !== SLICE_TYPES.BREADCRUMBS
      )?.slice_type,
      [ANALYTICS_PROPERTIES.IS_LANDING_PAGE]:
        taggedPageType === MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE,
      ...(subattractionType && {
        [ANALYTICS_PROPERTIES.SUBATTRACTION_TYPE]: subattractionType,
      }),
      ...(showCruisesFormat && {
        [ANALYTICS_PROPERTIES.PRIMARY_PRODUCTS_PRESENT]:
          finalUncategorizedTours?.filter(
            (tour: Record<string, any>) =>
              scorpioData[tour.tgid]?.primaryCategory?.id ===
                CRUISE_CATEGORY_ID ||
              CRUISE_FORMAT_SUBCAT_IDS?.includes(
                scorpioData[tour.tgid]?.primarySubCategory?.id
              )
          )?.length,
      }),
    });
  }, [
    eventsReady,
    isDayTripsCollectionExperimentDWebResolving,
    isDayTripsCollectionExperimentMWebResolving,
    revampedDayTripsCollection,
    isDayTripCollectionPage,
  ]);

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

  const {
    isEligible: isPOIFiltersExpEligible,
    isExperimentResolving: isPOIFiltersExpResolving,
    variant: poiFiltersVariant,
  } = useABTesting({
    experimentId: 'POI_FILTERS_EXPERIMENT',
    customEligibilityCheckFn: () =>
      !isNonPoiMB &&
      !QNA_EXP_UIDS.includes(uid) &&
      !checkIfLTTMB(uid) &&
      !checkIfBroadwayMB(uid) &&
      !orderedTgids?.some((tgid: number) =>
        TGIDS_WITH_CANCELLATION_INSURANCE.includes(tgid)
      ) &&
      !DAY_TRIPS_COLLECTION_MBS.includes(uid),
  });

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
    !(taggedCategoryName === 'Cruises') &&
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
    baseLangBannerAndFooterCombinations,
    customBannerSubtext
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

  const qnaExperimentData = {
    qnaSnippets: showQnaExperiment ? qnaSnippets : [],
    qnaSections: showQnaExperiment ? qnaSections : [],
    collectionId: collectionDetails?.id,
    showQnaExperiment,
  };

  const isPOIFiltersEnabled =
    isPOIFiltersExpEligible && poiFiltersVariant === VARIANTS.TREATMENT;

  const longFormContentArr = [
    ...(Array.isArray(longFormContent) ? longFormContent : []),
    ...(Array.isArray(contentFWSlices) ? contentFWSlices : []),
  ];

  const tourListSection = (
    <PopulateProducts
      // @ts-ignore
      currency={currency}
      scrollOnLoading={isNonPoiMB || poiFilterTypes.size <= 1}
      uncategorizedTours={finalUncategorizedTours}
      filteredOutTours={filteredOutTours}
      scorpioData={scorpioData}
      uncategorizedToursHeading={uncategorizedToursHeading.list_heading}
      uid={uid}
      currentLanguage={currentLanguage}
      bookNowText={bookNowText}
      showCustomProductCardEnglishCTA={showCustomProductCardEnglishCTA}
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
      setProductsLoading={setProductsLoading}
      isPoiMwebCard={isPoiMwebCard}
      isNonPoi={isNonPoiMB}
      isAirportTransfersMB={isAirportTransfersMB}
      isModifiedProductCard={!isMobile && !showCruisesFormat}
      isTourListFiltered={isTourListFiltered}
      showPopup={showPopup}
      isHOHORevamp={showHohoRevamp}
      showItineraries={showItineraries}
      isCruisesRevamp={showCruisesFormat}
      showCruisesCombosRevamp={showCruisesCombosRevamp}
      isNewVerticalsProductCard={showHohoRevamp || showCruisesFormat}
      customBanner={customBanner?.primary}
      baseLangCustomBanner={baseLangCustomBanner?.primary}
      shouldRunHohoRevampExperiment={shouldRunHohoRevampExperiment}
      isRankingExperimentResolving={isRankingExperimentResolving}
      isQnaExpResolving={isQnaExpResolving}
      showSightsCoveredItineraryLayout={showSightsCoveredItineraryLayout}
      showBoosters={isBoosterExpEligible || isPOIFiltersEnabled}
      isPOIFiltersEnabled={isPOIFiltersEnabled}
      botReviewsByTGID={botReviewsByTGID}
      showLastMinFilters={showLastMinFilters}
      activePOIFilter={activePOIFilter}
      {...qnaExperimentData}
      // @ts-expect-error TS(2322): Type 'Element' is not assignable to type 'any'.
      poiCollectionsSection={
        isPOIFiltersEnabled ? (
          <LazyComponent>
            <POICollectionsSection
              allCollectionsData={categoryHeaderMenu.CITY_ATTRACTIONS}
              isMobile={isMobile}
              primaryCity={primaryCity}
              taggedCity={taggedCity}
            />
          </LazyComponent>
        ) : null
      }
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

  const isHarryPotterPage = checkIfHarryPotterPage(uid);

  const {
    isEligible: shouldRunDayTripsListicleExperiment,
    variant: dayTripsListicleExperimentVariant,
  } = useABTesting({
    experimentId: 'DAY_TRIPS_LISTICLE',
    customEligibilityCheckFn: () => DT_LISTICLE_EXPERIMENT_UIDS.includes(uid),
  });
  const hideDtProductCards =
    shouldRunDayTripsListicleExperiment &&
    dayTripsListicleExperimentVariant === VARIANTS.TREATMENT;

  if (
    (isQnaExpEligible && isQnaExpResolving) ||
    (isCruisesCombosExpEligible && isCruisesCombosExpResolving) ||
    (isLFCImpactExpEligible && isLFCExperimentResolving) ||
    (shouldRunCustomEnglishCTAExperiment &&
      isCustomEnglishCTAExperimentResolving) ||
    (shouldRunHohoRevampExperiment && isHohoExperimentResolving) ||
    (isPOIFiltersExpEligible && isPOIFiltersExpResolving) ||
    (shouldRunDayTripsCollectionExperimentDWeb &&
      isDayTripsCollectionExperimentDWebResolving) ||
    (shouldRunDayTripsCollectionExperimentMWeb &&
      isDayTripsCollectionExperimentMWebResolving)
  )
    return <Loader />;

  const heroProps = {
    banners: bannerImages?.reduce((accum: [], image: Record<string, any>) => {
      const {
        uploaded_image: {
          url: uploadedImageUrl = '',
          alt: uploadedImageAlt = '',
        } = {},
        image_src: { url: imageSrcUrl = '' } = {},
        mobile_banner_uploaded: { url: mobileBannerUploadedUrl = '' } = {},
        mobile_banner_url: { url: mobileBannerUrl = '' } = {},
        interaction,
        image_alt_: imageAlt = '',
        onclick_url: showPageUrl,
        main_heading: bannerHeading,
        sub_text: bannerSubText,
        desktop_video_link: { url: desktopVideoLink = '' } = {},
        mobile_video_link: { url: mobileVideoLink = '' } = {},
      } = image;

      return [
        ...accum,
        {
          url: uploadedImageUrl || imageSrcUrl,
          mobile_url: mobileBannerUploadedUrl || mobileBannerUrl,
          interaction,
          alt: uploadedImageAlt || imageAlt,
          showPageUrl,
          bannerHeading,
          bannerSubText,
          desktopVideoLink: desktopVideoLink,
          mobileVideoLink: mobileVideoLink,
        },
      ];
    }, []),
    coverHeading: bannerHeading,
  };

  const languageProps = {
    uid,
    currentLanguage,
    languages: alternateLanguages,
  };

  const dropdownLinksArray =
    dropdownMenu?.reduce((acc: any, item: any) => {
      if (item.link)
        return [...acc, { value: item.link.url, label: item.link_text }];
      else return acc;
    }, []) ?? [];

  const overriddenHeaderData = { ...micrositeData, ...commonHeader?.data };
  const {
    enable_group_booking,
    enable_buy_tickets_shortcut,
    enable_search,
    search_recommend_csv,
    enable_dropdown,
  } = overriddenHeaderData;

  const headerProps = {
    showGroupBooking: enable_group_booking === 'Yes',
    headerLinks,
    logoRedirectionURL:
      getLogoRedirectionUrl({ uid, lang: currentLanguage, isDev, host }) || '/',
    enableBuyTickets: enable_buy_tickets_shortcut === 'Yes',
    enableSearch: enable_search === 'Yes',
    recommendedTours:
      (search_recommend_csv &&
        search_recommend_csv
          ?.split?.(',')
          ?.map?.((tgid: any) => parseInt(tgid))) ||
      [],
    enableDropdownLinks: enable_dropdown === 'Yes',
    dropdownLinks: dropdownLinksArray,
  };

  const header = {
    ...headerProps,
    headerSlices: commonHeader?.data?.body,
    languageProps,
  };

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
        <Conditional if={!isEntertainmentBanner}>
          <CommonHeader
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
            hideHeaderBoxShadow={isAirportTransfersMB || isPOIFiltersEnabled}
          />
        </Conditional>
        <Conditional
          if={
            !isEntertainmentBanner &&
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
        <Conditional if={isEntertainmentBanner}>
          <EntertainmentHeader
            {...header}
            host={host}
            changePage={false}
            isMobile={isMobile}
            allTours={orderedTours}
            isEntertainmentMb={isEntertainmentBanner}
            hasLanguageSelector={isEntertainmentBanner}
            hideCurrencySelector
            isEntertainmentMbListicle={isEntertainmentBanner}
            logoUrl={logoUrl}
            logoAltText={whiteLabelName || ''}
            hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
            isCategoryPage={false}
            isMonthOnMonthPage={false}
            isEntertainmentLandingPageVisible={true}
            primaryCity={primaryCity}
            taggedCity={taggedCity as string}
            categoryHeaderMenu={categoryHeaderMenu}
            categoryHeaderMenuExists={categoryHeaderMenuExists}
            uid={uid}
            showSeatMapExperiment={false}
            isEntertainmentBanner={isEntertainmentBanner}
          />
          <Conditional if={!isMobile}>
            <DesktopBannerV2
              allTours={orderedTours}
              trustBoosters={bannerTrustBoosters}
              bannerImages={heroProps.banners}
              isEntertainmentBanner={isEntertainmentBanner}
            />
          </Conditional>
          <Conditional if={isMobile}>
            <MobileBannerV2
              trustBoosters={bannerTrustBoosters}
              bannerImages={heroProps.banners}
              allTours={orderedTours}
              isEntertainmentBanner={isEntertainmentBanner}
            />
          </Conditional>
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
        <Conditional
          if={
            !isEntertainmentBanner &&
            !showNewBanner &&
            !isCityPageMB &&
            !isCatOrSubCatPage
          }
        >
          <Banner
            bannerImages={finalBannerImages || null}
            bannerHeading={bannerHeading || null}
            bannerCtaText={bannerCtaText || null}
            bannerSubtext={customBannerSubtext}
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
            showNewBanner &&
            !isCatOrSubCatPage &&
            !isEntertainmentBanner &&
            !revampedDayTripsCollection
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
            isCruisesRevamp={showCruisesFormat}
            reducedMwebMarginOnDisclaimer={isPOIFiltersEnabled}
            isAirportTransfersMB={isAirportTransfersMB}
            {...qnaExperimentData}
          />
        </Conditional>
        <Conditional if={revampedDayTripsCollection}>
          <DayTripsCollectionPage
            collection={collectionDetails}
            isMobile={isMobile}
            primaryCity={primaryCity}
            currency={currency}
            lang={lang}
            collectionReviews={collectionReviews}
            banners={bannerV3Data}
            categoryTourListData={categoryTourListData}
            uncategorizedTours={finalUncategorizedTours}
            scorpioData={scorpioData}
            uncategorizedToursHeading={uncategorizedToursHeading.list_heading}
            uid={uid}
            currentLanguage={currentLanguage}
            bookNowText={bookNowText}
            showCustomProductCardEnglishCTA={false} // explicitly passing false to avoid showing the custom product card english cta
            readMoreText={readMoreText}
            showLessText={showLessText}
            productOffer={productOffer}
            hasOffer={hasOffer}
            togglePopup={onTogglePopup}
            pageUrl={pageUrl}
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
            isModifiedProductCard={!isMobile && !showCruisesFormat}
            isTourListFiltered={isTourListFiltered}
            showPopup={showPopup}
            isHOHORevamp={showHohoRevamp}
            showItineraries={showItineraries}
            isCruisesRevamp={showCruisesFormat}
            isNewVerticalsProductCard={showHohoRevamp || showCruisesFormat}
            customBanner={customBanner?.primary}
            baseLangCustomBanner={baseLangCustomBanner?.primary}
            shouldRunHohoRevampExperiment={shouldRunHohoRevampExperiment}
            isRankingExperimentResolving={isRankingExperimentResolving}
            showSightsCoveredItineraryLayout={showSightsCoveredItineraryLayout}
            showBoosters={isBoosterExpEligible}
            micrositeData={micrositeData}
            dayTripCollectionData={dayTripCollectionData}
          />
        </Conditional>
        <Conditional
          if={
            isA1orC1MB(taggedMbType) &&
            !isAirportTransfersMB &&
            !showCruisesFormat &&
            !revampedDayTripsCollection
          }
        >
          <div
            className={poiFiltersWrapperStyle}
            id="POI_FILTERS"
            data-enable-sticky={
              isPOIFiltersEnabled && !isLfcInView && !isFooterInView
            }
          >
            <Conditional if={isMobile}>
              <LastMinuteFilters
                setOrderedFilteredTours={setOrderedFilteredTours}
                orderedTours={orderedTours}
                scorpioData={scorpioData}
                setProductsLoading={setProductsLoading}
                inventoryFilteredTours={orderedFilteredTours}
                changeTourListFilterStatus={(state) => {
                  if (state !== isTourListFiltered)
                    setIsTourListFiltered(state);
                }}
                singlePillUI={isPOIFiltersEnabled}
                existingFilterTypes={poiFilterTypes}
                isTourListFiltered={isTourListFiltered}
                poiFilteredTours={
                  filterToursByPOIFilter(
                    orderedTours,
                    activePOIFilter,
                    scorpioData
                  )?.filteredTours
                }
              />
            </Conditional>

            <Conditional if={isPOIFiltersEnabled}>
              <POIFilters
                isMobile={isMobile}
                activeFilter={activePOIFilter}
                setActiveFilter={setActivePOIFilter}
                inventoryFilteredTours={orderedFilteredTours}
                scorpioData={scorpioData}
                setProductsLoading={setProductsLoading}
                existingFilterTypes={poiFilterTypes}
                isTourListFiltered={isTourListFiltered}
                allTours={orderedTours}
              />
            </Conditional>
          </div>
        </Conditional>
        <Conditional
          if={
            !isEntertainmentBanner &&
            mbTheme === THEMES.MIN_BLUE &&
            !isCatOrSubCatPage
          }
        >
          <TextBanner bannerHeading={bannerHeading || null} />
        </Conditional>

        <Conditional
          if={
            !isEntertainmentBanner &&
            coverSlices?.length &&
            !isCatOrSubCatPage &&
            !showCruisesFormat
          }
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
        <Conditional
          if={
            hasTours &&
            !hasTourListContentFW &&
            isToursAvailable &&
            !isCatOrSubCatPage &&
            !isAirportTransfersMB &&
            !hideDtProductCards &&
            !revampedDayTripsCollection
          }
        >
          {tourListSection}
        </Conditional>

        <Conditional if={showAirportTransferProducts}>
          <PopulateAirportTransfersProducts
            uncategorizedTours={orderedFilteredTours}
            isMobile={isMobile}
            scorpioData={scorpioData}
            city={primaryCity}
            sharedTransferProducts={tourListSection}
            uid={uid}
            currentLanguage={currentLanguage}
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
            isMobile={isMobile}
            content={contentFWSlices}
          />
        </Conditional>

        <Conditional if={showQnaExperiment}>
          <LfcQna
            qnaSections={qnaExperimentData.qnaSections}
            isMobile={isMobile}
            collectionId={qnaExperimentData.collectionId}
          />
        </Conditional>

        <Conditional
          if={
            isA1orC1MB(taggedMbType) &&
            !isDesertSafariMB &&
            !isPOIFiltersEnabled &&
            categoryHeaderMenu.CITY_ATTRACTIONS
          }
        >
          <CollectionCarousel
            allCollectionsData={categoryHeaderMenu.CITY_ATTRACTIONS}
            isMobile={isMobile}
            primaryCity={primaryCity}
            taggedCity={taggedCity}
          />
        </Conditional>

        <Conditional if={longFormContentArr?.length}>
          <div ref={lfcRef}>
            <Conditional if={!hideLFC}>
              <ProductsContextProvider ready={isReady}>
                <InteractionContextProvider>
                  <LongForm
                    tourListSection={tourListSection}
                    content={longFormContentArr}
                    automatedBreadcrumbsExists={automatedBreadcrumbsExists}
                    isRevampedDesign={isCatOrSubCatPage}
                    isMobile={isMobile}
                    isHOHORevamp={showHohoRevamp}
                    isAirportTransfersMB={isAirportTransfersMB}
                    isCatAndSubCatPage={isCatOrSubCatPage}
                    collectionReviews={collectionReviews}
                    isDayTrips={revampedDayTripsCollection}
                    catSubCatReviews={catSubCatReviews}
                    collectionDetails={collectionDetails}
                    categoryId={categoryId}
                    subCategoryId={subCategoryId}
                    isDesertSafariMB={isDesertSafariMB}
                    allCollectionsData={categoryHeaderMenu.CITY_ATTRACTIONS}
                    primaryCity={primaryCity}
                    taggedCity={taggedCity}
                  />
                </InteractionContextProvider>
              </ProductsContextProvider>
            </Conditional>
          </div>
        </Conditional>

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
          isCatOrSubCatPage={isCatOrSubCatPage}
          isDarkPurps={showHohoRevamp}
          footerRef={footerRef}
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
      </StyledMicrositeContainer>
    </div>
  );
};

export default MicrositeV1;
