import {
  ComponentType,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { SliceZone } from '@prismicio/react';
import CategoryPage from 'components/CategoryPage';
import Mailer from 'components/CityPageContainer/Mailer';
import Conditional from 'components/common/Conditional';
import LazyComponent from 'components/common/LazyComponent';
import Loader from 'components/common/Loader';
import { CategoriesSection } from 'components/MicrositeV2/EntertainmentMBLandingPageV2/BrowseByCategoriesSection/style';
import Header, { StyledHeader } from 'components/MicrositeV2/Header';
import SeatMapPage from 'components/SeatMapPage';
import { sliceComponents } from 'components/slices/sliceManager';
import StaticBanner from 'components/StaticBanner';
import TextBanner from 'components/TextBanner';
import DismissAlert from 'UI/DismissAlert';
import { MBContext } from 'contexts/MBContext';
import { ProductsContextProvider } from 'contexts/Products';
import useABTesting from 'hooks/useABTesting';
import {
  getBannerAndFooterSubtext,
  isCategoryMB,
  isCollectionMB,
  isSubCategoryMB,
} from 'utils';
import {
  getCommonEventMetaData,
  sendVariablesToDataLayer,
  trackEvent,
} from 'utils/analytics';
import {
  checkIfBroadwayMBLandingPage,
  checkIfCategoryHeaderExists,
  checkIfLTTMB,
  checkIfLTTMBLandingPage,
  getBannerDescriptors,
  getDiscountedProducts,
  getPriceSortedDiscountedProducts,
  getPriceSortedListicleTgids,
  getTGIDListForMonth,
  groupSlices,
  isTheatreInSeatMapExperiment,
  withShortcodes,
} from 'utils/helper';
import { titleCase } from 'utils/stringUtils';
import { gtmAtom } from 'store/atoms/gtm';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
// import COLORS from 'const/colors';
import { EXPERIMENT_NAMES, VARIANTS } from 'const/experiments';
import { FONTS } from 'const/fonts';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  DESIGN,
  EMAIL_SUBCRIPTION,
  PAGE_TYPES,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';
import Location from 'assets/location';

const Alert = dynamic(
  () => import(/* webpackChunkName: "Alert" */ 'UI/Alert'),
  { ssr: false }
);
const ResponsiveSelector: ComponentType<any> = dynamic(
  () =>
    import(
      /* webpackChunkName: "ResponsiveSelector" */ 'components/MicrositeV2/ResponsiveSelector'
    ).then((m) => m.ResponsiveSelector),
  { ssr: false }
);
const ProductsWrapper: ComponentType<any> = dynamic(() =>
  import(
    /* webpackChunkName: "ProductsWrapper" */ 'components/MicrositeV2/ProductsWrapper'
  ).then((mod) => mod.ProductsWrapper)
);
const Banner: ComponentType<any> = dynamic(
  () => import(/* webpackChunkName: "Banner" */ 'components/MicrositeV2/Banner')
);
const LongForm: ComponentType<any> = dynamic(
  () =>
    import(/* webpackChunkName: "LongForm" */ 'components/MicrositeV2/LongForm')
);
const CategoryHeader = dynamic(
  () =>
    import(/* webpackChunkName: "CategoryHeader" */ 'components/CategoryHeader')
);
const Breadcrumbs = dynamic(
  () => import(/* webpackChunkName: "Breadcrumbs" */ 'components/Breadcrumbs')
);
const CatAndSubCatPage = dynamic(
  () =>
    import(
      /* webpackChunkName: "CatAndSubCatPage" */ 'components/CatAndSubCatPage'
    )
);
const MonthTabs = dynamic(
  () =>
    import(/* webpackChunkName: "Breadcrumbs" */ 'components/slices/MonthTabs')
);

const EntertainmentMBLandingPageV2 = dynamic(
  () =>
    import(
      /* webpackChunkName: "EntertainmentMBLandingPageV2" */ 'components/MicrositeV2/EntertainmentMBLandingPageV2'
    )
);
const MobileBannerV2 = dynamic(
  () =>
    import(
      /* webpackChunkName: "MobileBannerV2" */ 'components/MicrositeV2/MobileBannerV2'
    )
);
const LttFeatureCard = dynamic(
  () =>
    import(
      /* webpackChunkName: "LttFeatureCard" */ 'components/ShowPages/FeatureCard'
    )
);
const DesktopBannerV2 = dynamic(
  () =>
    import(
      /* webpackChunkName: "DesktopBannerV2" */ 'components/MicrositeV2/DesktopBannerV2'
    )
);
const Footer = dynamic(
  () => import(/* webpackChunkName: "Footer" */ 'components/common/Footer')
);
const MonthOnMonthPage = dynamic(
  () =>
    import(
      /* webpackChunkName: "MonthOnMonthPage"*/ 'components/MonthOnMonthPage'
    )
);

const V2MicrositeWrapper = styled.div<{
  $isCategoriesSectionSticking?: boolean;
}>`
  .alert-wrapper {
    margin-top: 40px;
  }
  .hero-slice-section {
    margin-top: 24px;
    margin-bottom: 36px;
  }
  .hero-slice-section:empty {
    margin: 0;
  }
  .city-selector {
    margin-bottom: 24px;
  }
  .main-wrapper.v2-long-form {
    max-width: unset;
    padding: unset;
    margin: unset;
    width: unset;
  }
  .long-form .slice-block.rich_text {
    max-width: ${SIZES.MAX_WIDTH};
    margin-left: auto;
    margin-right: auto;
  }

  ${CategoriesSection} {
    ${({ $isCategoriesSectionSticking }) =>
      $isCategoriesSectionSticking &&
      `
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.10), 0px 0px 1px 0px rgba(0, 0, 0, 0.10);
      `};
  }
  @media (min-width: 768px) {
    ${StyledHeader} {
      .fixed-wrap {
        ${({ $isCategoriesSectionSticking }) =>
          $isCategoriesSectionSticking &&
          `
        box-shadow: none;
        `};
      }
    }
  }
  @media (max-width: 768px) {
    .fixed-wrap {
      height: inherit;
    }
    .main-wrapper {
      padding-left: 16px;
      padding-right: 16px;
      width: calc(100% - 32px);
    }
    .hero-slice-section {
      margin-bottom: 32px;
      padding-right: unset;
      padding-left: unset;
      width: unset;
    }
  }
`;

const ListicleHeadingWrapper = styled.div`
  padding-top: 36px;
  color: ${COLORS.GRAY.G2};
  h1 {
    max-width: 550px;
    margin: unset;
    ${expandFontToken(FONTS.DISPLAY_REGULAR)}
  }

  @media (max-width: 768px) {
    padding-top: 32px;
    padding-left: 24px;
    h1 {
      ${expandFontToken(FONTS.HEADING_LARGE)}
    }
  }
`;

/*
TODO: Content Tabs with Category
TODO: Category with TGID and Category
*/

export const HomePage = (props: any) => {
  const {
    header,
    footer,
    host,
    isMobile,
    isEntertainmentMb,
    allTours,
    longFormContent,
    hasCategoryTourList,
    categoryTourListData,
    heroProps,
    changePage,
    uid,
    directTgid,
    heroSectionSlice,
    contentFramework,
    ready,
    alertPopup,
    showCovid19Alert,
    isListicle,
    displayMonths,
    isDev,
    domainConfig,
    mbDesign,
    mbType,
    primarySubCategoryId,
    primaryCity,
    taggedCity,
    taggedCategoryName,
    taggedSubCategoryName,
    taggedCollection,
    taggedMbType,
    shoulderPageType,
    categoryHeaderMenu,
    baseLangIsPoiMb,
    baseLangBannerAndFooterCombinations,
    breadcrumbs,
    alternateLanguages,
    isCatOrSubCatPage,
    catAndSubCatPageData,
    theatreType,
    isSeatingPlanPage,
  } = props;
  const { languageProps } = header;
  const { currentLanguage, languages } = languageProps || {};
  const isLTT = checkIfLTTMB(uid);

  const pageMetaData = useRecoilValue(metaAtom);
  const { eventsReady } = useRecoilValue(gtmAtom);
  const browseByCategorySectionRef = useRef<HTMLDivElement | null>(null);
  const [isCategoriesSectionSticking, setIsCategoriesSectionSticking] =
    useState(false);

  const { collectionId } = pageMetaData;

  const showLttTreatment =
    checkIfLTTMBLandingPage(uid) || checkIfBroadwayMBLandingPage(uid);

  const isTheatreInSeatingExperiment =
    isSeatingPlanPage && isTheatreInSeatMapExperiment(theatreType);
  const isCollectionMicrobrand = isCollectionMB(taggedMbType);
  const isEntertainmentMbListicle = isEntertainmentMb && isListicle;

  const isCategoryMicrobrand = isCategoryMB(mbType);
  const isSubCategoryMicrobrand = isSubCategoryMB(mbType);
  const isLttMonthOnMonthPage =
    isEntertainmentMbListicle &&
    !!displayMonths &&
    heroSectionSlice[0]?.items?.[0]?.month_label !== null;
  const isCategoryPage = !!primarySubCategoryId;

  const { isEligible: isSeatMapExpEligible, variant: SeatMapExpVariant } =
    useABTesting({
      experimentId: 'SEATMAP_EXPERIMENT',
      noTrack: false,
      customEligibilityCheckFn: () => isTheatreInSeatingExperiment,
    });

  const {
    isEligible: isImageQualityExpEligible,
    variant: imageQualityExpVariant,
    isExperimentResolving: isImageQualityExpResolving,
  } = useABTesting({
    experimentId: 'IMAGE_QUALITY_EXPERIMENT',
    noTrack: false,
    customEligibilityCheckFn: () => {
      return isLttMonthOnMonthPage || isCategoryPage || showLttTreatment;
    },
  });

  const isSeatMapExpControlAndEligible =
    isTheatreInSeatingExperiment && SeatMapExpVariant === VARIANTS.CONTROL;

  const showSeatMapExperiment =
    SeatMapExpVariant === VARIANTS.TREATMENT && isSeatMapExpEligible;
  const showHigherQualityImage =
    imageQualityExpVariant === VARIANTS.TREATMENT && isImageQualityExpEligible;

  let { categoryProps } = props;

  const isDiscountedPage = displayMonths === 'Discounted';
  const bannerAndFooterSubtext = getBannerAndFooterSubtext(
    baseLangIsPoiMb,
    baseLangBannerAndFooterCombinations
  );

  const firstTab = Object.values(categoryTourListData)?.[0] as Array<
    Record<string, any>
  >;
  const firstProduct = firstTab?.[0];

  const { primarySubCategory: firstProductSubCategory } = firstProduct || {};
  const bannerDescriptors = getBannerDescriptors({
    taggedMbType,
    taggedCategoryName,
    taggedSubCategoryName,
    firstProductSubCategory,
  });

  if (!isLttMonthOnMonthPage && (isListicle || isDiscountedPage)) {
    let singleCategory = [];
    let allowedTours;
    let priceSortTours;

    if (displayMonths === 'ALL') {
      allowedTours = Object.keys(allTours).map((tgid) => parseInt(tgid));
      priceSortTours = getPriceSortedListicleTgids(allTours, allowedTours);
    } else if (isDiscountedPage) {
      allowedTours = getDiscountedProducts(allTours);
      priceSortTours = getPriceSortedDiscountedProducts(allTours);
    } else {
      allowedTours = getTGIDListForMonth(allTours, displayMonths);
      priceSortTours = getPriceSortedListicleTgids(allTours, allowedTours);
    }
    singleCategory = [
      {
        id: 1,
        name: isDiscountedPage
          ? categoryProps?.categories?.[0]?.name
          : displayMonths,
        rank: 0,
        ranking: {
          popularity: allowedTours?.length ? allowedTours : [],
          price: priceSortTours?.length ? priceSortTours : [],
        },
      },
    ];

    categoryProps = {
      active: 0,
      categories: singleCategory,
      hideSortBySelector: false,
    };
  }

  const [covid19AlertOpen, setCovid19AlertOpen] = useState(true);

  const { dropdownLinks, enableDropdownLinks } = header;
  const selectorLinkChangeHandler = (option: any) => {
    window.location.href = option.value;
  };
  const slices = contentFramework?.body;
  const contentFWSlices = (slices && groupSlices(slices, undefined, uid)) || [];
  let longFormSlices = [...contentFWSlices, ...longFormContent];
  const hasLanguageSelector = languages?.length > 0;
  const hasToursSection = categoryProps?.categories?.length > 0;
  const { secondaryFooter } = footer;
  const themeOverride = footer?.themeOverride;
  const hasDropdownLinks = enableDropdownLinks && dropdownLinks?.length;
  const { mbTheme } = useContext(MBContext);
  const coverHeading = withShortcodes(heroProps?.coverHeading);
  const allTgids = Object.keys(allTours);
  const {
    logo: { logoUrl = '', showPoweredLogo = true } = {},
    name: whiteLabelName,
  } = domainConfig || {};
  const categoryHeaderMenuExists = checkIfCategoryHeaderExists({
    mbDesign,
    mbType: taggedMbType,
  });
  const automatedBreadcrumbsExists = Object.keys(breadcrumbs).length > 0;
  //Subcategory/category MBs will always be non-POI irrespective of the config on Prismic
  const isNonPoiMB =
    isCategoryMicrobrand || isSubCategoryMicrobrand ? true : !baseLangIsPoiMb;

  useEffect(() => {
    if (eventsReady) {
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
        [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
        [ANALYTICS_PROPERTIES.TGIDS]: Object.keys(allTours).map(Number),
        ...getCommonEventMetaData(pageMetaData),
        ...(isTheatreInSeatingExperiment
          ? {
              [ANALYTICS_PROPERTIES.THEATRE_NAME]: theatreType,
              [ANALYTICS_PROPERTIES.HAS_ACTIVE_SHOWS]: 'Yes',
              [ANALYTICS_PROPERTIES.NUMBER_OF_PRODUCTS]: 1,
              [ANALYTICS_PROPERTIES.EXPERIMENT_NAME]:
                EXPERIMENT_NAMES.SEATMAP_EXPERIMENT,
              [ANALYTICS_PROPERTIES.VARIANT]: SeatMapExpVariant,
              [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.VENUE_SEATS_PAGE,
            }
          : {}),
      });
    }
  }, [eventsReady]);

  useEffect(() => {
    const observeCategoriesSection = () => {
      const top =
        browseByCategorySectionRef.current?.getBoundingClientRect?.()?.top ?? 0;
      setIsCategoriesSectionSticking(top === (isMobile ? 61 : 80));
    };
    window.addEventListener('scroll', observeCategoriesSection);

    return () => window.removeEventListener('scroll', observeCategoriesSection);
  }, []);

  const finalSlices = heroSectionSlice.filter(
    (slice: any) => slice?.slice_type
  );

  const components = useMemo(() => {
    return sliceComponents();
  }, []);

  if (showSeatMapExperiment) {
    longFormSlices = longFormSlices.splice(3);
    header.enableSearch = false;
  } else if (isSeatMapExpControlAndEligible) {
    longFormSlices = longFormSlices.filter(
      ({ slice_type }, index) => slice_type !== 'rich_text' || index !== 3
    );
  }

  const addVenueSeatsPageSectionViewedDataEvents = ({
    sectionName,
    rank,
  }: {
    sectionName: string;
    rank: number;
  }) => {
    trackEvent({
      eventName:
        ANALYTICS_EVENTS.SEATMAP_EXPERIMENT.VENUE_SEATS_PAGE_SECTION_VIEWED,
      [ANALYTICS_PROPERTIES.SECTION]: sectionName,
      [ANALYTICS_PROPERTIES.RANK]: rank,
    });
  };

  if (isImageQualityExpEligible && isImageQualityExpResolving)
    return <Loader />;

  return (
    <V2MicrositeWrapper
      $isCategoriesSectionSticking={isCategoriesSectionSticking}
    >
      <Header
        {...header}
        host={host}
        changePage={changePage}
        isMobile={isMobile}
        allTours={allTours}
        isEntertainmentMb={isEntertainmentMb}
        hasLanguageSelector={showSeatMapExperiment || hasLanguageSelector}
        hideCurrencySelector
        isEntertainmentMbListicle={isEntertainmentMbListicle}
        logoUrl={logoUrl}
        logoAltText={whiteLabelName || ''}
        hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
        isCategoryPage={isCategoryPage}
        isMonthOnMonthPage={isLttMonthOnMonthPage}
        isEntertainmentLandingPageVisible={
          showLttTreatment || isCategoryPage || isLttMonthOnMonthPage
        }
        primaryCity={primaryCity}
        taggedCity={taggedCity}
        categoryHeaderMenu={categoryHeaderMenu}
        categoryHeaderMenuExists={categoryHeaderMenuExists}
        uid={uid}
        showSeatMapExperiment={showSeatMapExperiment}
      />
      <Conditional if={!showSeatMapExperiment && isLttMonthOnMonthPage}>
        <MonthOnMonthPage
          heroProps={heroProps}
          isMobile={isMobile}
          breadcrumbs={breadcrumbs}
          browseByCategoriesRef={browseByCategorySectionRef}
          taggedCollection={taggedCollection}
          categoryTourListData={categoryTourListData}
          categoryProps={categoryProps}
          allTours={allTours}
          pageTabsSlice={heroSectionSlice[0]}
          displayMonth={displayMonths}
          showHigherQualityImage={showHigherQualityImage}
        />
      </Conditional>
      <Conditional
        if={
          !showSeatMapExperiment &&
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
      <Conditional if={!showSeatMapExperiment && isMobile && hasDropdownLinks}>
        <div className="main-wrapper city-selector">
          <ResponsiveSelector
            options={dropdownLinks}
            host={host}
            isMobile={isMobile}
            onChange={selectorLinkChangeHandler}
            iconPosition={'left'}
            icon={Location}
            toggleIcon={false}
          />
        </div>
      </Conditional>
      <Conditional
        if={
          !showSeatMapExperiment &&
          showCovid19Alert &&
          covid19AlertOpen &&
          !isEntertainmentMb &&
          !isCatOrSubCatPage
        }
      >
        <DismissAlert
          readMoreLink={strings.COVID19_ALERT.LINK}
          readMore={strings.READ_MORE}
          keyText={strings.COVID19_ALERT.KEY_TEXT}
          text={strings.COVID19_ALERT.TEXT}
          handleClose={() => {
            setCovid19AlertOpen(false);
          }}
        />
      </Conditional>
      <Conditional
        if={
          !showSeatMapExperiment &&
          isMobile &&
          showLttTreatment &&
          !isCatOrSubCatPage
        }
      >
        <MobileBannerV2 bannerImages={heroProps.banners} allTours={allTours} />
      </Conditional>
      <Conditional
        if={
          !showSeatMapExperiment &&
          !isMobile &&
          showLttTreatment &&
          !isCatOrSubCatPage
        }
      >
        <DesktopBannerV2 bannerImages={heroProps.banners} allTours={allTours} />
      </Conditional>
      <Conditional
        if={
          !showSeatMapExperiment &&
          mbTheme === THEMES.DEFAULT &&
          !isListicle &&
          !showLttTreatment &&
          !isCatOrSubCatPage &&
          !isCategoryPage &&
          mbDesign === DESIGN.V3
        }
      >
        <StaticBanner
          bannerImages={heroProps?.banners}
          bannerHeading={heroProps?.banners?.[0].bannerHeading}
          bannerSubText={bannerAndFooterSubtext}
          isMobile={isMobile}
          isNonPoiMB={isNonPoiMB}
          bannerDescriptors={bannerDescriptors}
        />
      </Conditional>
      <Conditional
        if={
          !showSeatMapExperiment &&
          mbTheme === THEMES.DEFAULT &&
          heroProps.banners.length &&
          !isListicle &&
          !showLttTreatment &&
          !isCatOrSubCatPage &&
          !isCategoryPage &&
          mbDesign !== DESIGN.V3 &&
          !showSeatMapExperiment
        }
      >
        <Banner
          bannerImages={heroProps.banners}
          isMobile={isMobile}
          ready={true}
          isEntertainmentMb={isEntertainmentMb}
          availableTours={allTgids}
          uid={uid}
        />
      </Conditional>
      <Conditional if={showSeatMapExperiment}>
        <SeatMapPage
          breadcrumbs={breadcrumbs}
          theatreType={theatreType}
          isMobile={isMobile}
          addVenueSeatsPageSectionViewedDataEvents={
            addVenueSeatsPageSectionViewedDataEvents
          }
        />
      </Conditional>
      <Conditional if={!showSeatMapExperiment && isCategoryPage}>
        <CategoryPage
          allTours={allTours}
          heroProps={heroProps}
          isMobile={isMobile}
          breadcrumbs={breadcrumbs}
          categoryProps={categoryProps}
          categoryTourListData={categoryTourListData}
          primarySubCategoryId={primarySubCategoryId}
          browseByCategoriesRef={browseByCategorySectionRef}
          showHigherQualityImage={showHigherQualityImage}
        />
      </Conditional>
      <Conditional
        if={
          !showSeatMapExperiment &&
          isEntertainmentMbListicle &&
          !isCatOrSubCatPage &&
          !isLttMonthOnMonthPage
        }
      >
        <ListicleHeadingWrapper className="main-wrapper">
          <h1>{coverHeading}</h1>
        </ListicleHeadingWrapper>
      </Conditional>
      <Conditional
        if={
          !showSeatMapExperiment &&
          mbTheme === THEMES.MIN_BLUE &&
          !isCatOrSubCatPage
        }
      >
        <TextBanner bannerHeading={coverHeading ? coverHeading : null} />
      </Conditional>
      <Conditional if={alertPopup?.uid}>
        <div className="alert-wrapper">
          <Alert popupUID={alertPopup?.uid} currentLanguage={currentLanguage} />
        </div>
      </Conditional>
      <Conditional
        if={
          heroSectionSlice.length &&
          !isEntertainmentMbListicle &&
          !isCatOrSubCatPage
        }
      >
        <ProductsContextProvider allTours={allTours} ready={ready}>
          <div className="main-wrapper hero-slice-section">
            <SliceZone
              slices={finalSlices}
              components={components}
              context={{ isMobile, wrapperType: 'v2-homepage' }}
              defaultComponent={() => null}
            />
          </div>
        </ProductsContextProvider>
      </Conditional>
      <Conditional
        if={
          isEntertainmentMbListicle &&
          !isCatOrSubCatPage &&
          !isLttMonthOnMonthPage
        }
      >
        <ProductsContextProvider allTours={allTours} ready={ready}>
          <div className="main-wrapper hero-slice-section">
            <MonthTabs
              tabs={heroSectionSlice[0].items}
              isMobile={isMobile}
              {...categoryProps}
            />
          </div>
        </ProductsContextProvider>
      </Conditional>
      <Conditional
        if={
          hasToursSection &&
          !showLttTreatment &&
          !isCatOrSubCatPage &&
          !isCategoryPage &&
          !isLttMonthOnMonthPage
        }
      >
        <ProductsWrapper
          availableTGIDs={Object.keys(allTours)}
          hasCategoryTourList={hasCategoryTourList}
          directTgid={parseInt(directTgid)}
          allTours={allTours}
          isMobile={isMobile}
          isEntertainmentMb={isEntertainmentMb}
          currentLanguage={currentLanguage}
          categoryProps={categoryProps}
          changePage={changePage}
          host={host}
          uid={uid}
          isDev={isDev}
          isListicle={isListicle}
          isDiscountedPage={isDiscountedPage}
          categoryHeaderMenuExists={categoryHeaderMenuExists}
        />
      </Conditional>
      <Conditional if={showLttTreatment && !isCatOrSubCatPage}>
        <EntertainmentMBLandingPageV2
          isMobile={isMobile}
          allTours={allTours}
          categoryProps={categoryProps}
          browseByCategoriesRef={browseByCategorySectionRef}
          directTgid={directTgid}
          collectionId={Number(collectionId!)}
          showHigherQualityImage={showHigherQualityImage}
        />
      </Conditional>
      {/* Don't need Breadcrumbs for Entertainment Category page and MoM Page because we have separate one in there banner*/}
      <Conditional
        if={
          automatedBreadcrumbsExists &&
          !isCategoryPage &&
          isCatOrSubCatPage &&
          !isEntertainmentMbListicle
        }
      >
        <LazyComponent>
          <Breadcrumbs
            breadcrumbs={breadcrumbs}
            taggedCity={taggedCity}
            primaryCity={primaryCity}
            isV2MB={true}
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

      <ProductsContextProvider allTours={allTours} ready={ready}>
        <div className="main-wrapper v2-long-form">
          <Conditional if={longFormContent && longFormSlices?.length}>
            <LongForm
              slicesArray={longFormSlices}
              props={{
                allTours,
                isMobile,
                hasCategoryTourList,
                categoryTourListData,
                changePage,
                host,
                uid,
                isEntertainmentMb,
                automatedBreadcrumbsExists,
                isCategoryPage,
                isRevampedDesign: isCatOrSubCatPage,
              }}
              hasToursSection={hasToursSection}
              showSeatMapExperiment={showSeatMapExperiment}
              addVenueSeatsPageSectionViewedDataEvents={
                addVenueSeatsPageSectionViewedDataEvents
              }
              isSeatMapExpControlAndEligible={isSeatMapExpControlAndEligible}
              isTheatreInSeatingExperiment={isTheatreInSeatingExperiment}
            />
          </Conditional>
        </div>
      </ProductsContextProvider>

      <Conditional
        if={
          isEntertainmentMb &&
          !showLttTreatment &&
          !isCatOrSubCatPage &&
          !isCategoryPage &&
          !isLttMonthOnMonthPage
        }
      >
        <div className="main-wrapper">
          <LazyComponent>
            <LttFeatureCard />
          </LazyComponent>
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
      <LazyComponent>
        <Footer
          currentLanguage={currentLanguage}
          attraction={footer.attraction || 'attraction'}
          logoURL={logoUrl}
          logoAlt={whiteLabelName || ''}
          hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
          disclaimerText={
            isCollectionMicrobrand
              ? bannerAndFooterSubtext
              : footer.disclaimer_text
          }
          slices={footer.body || []}
          themeOverride={themeOverride}
          secondarySlices={secondaryFooter?.data?.body}
          secondaryHeading={secondaryFooter?.data?.footer_heading}
          primaryHeading={footer?.footer_heading}
          isEntertainmentMb={isEntertainmentMb}
          isCatOrSubCatPage={isCatOrSubCatPage}
          isLTT={isLTT}
          isDarkPurps={showLttTreatment}
        />
      </LazyComponent>
    </V2MicrositeWrapper>
  );
};

export default HomePage;
