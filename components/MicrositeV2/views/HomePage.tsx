import React, {
  ComponentType,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import CategoryPage from 'components/CategoryPage';
import Mailer from 'components/CityPageContainer/Mailer';
import Conditional from 'components/common/Conditional';
import LazyComponent from 'components/common/LazyComponent';
import Header, { StyledHeader } from 'components/MicrositeV2/Header';
import { CategoriesSection } from 'components/MicrositeV2/LttLandingPageV2/BrowseByCategoriesSection/style';
import sliceHandler from 'components/Slices';
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
  checkIfCategoryHeaderExists,
  checkIfLTTMBLandingPage,
  getBannerDescriptors,
  getDiscountedProducts,
  getPriceSortedDiscountedProducts,
  getPriceSortedListicleTgids,
  getTGIDListForMonth,
  groupSlices,
  withShortcodes,
} from 'utils/helper';
import { titleCase } from 'utils/stringUtils';
import { gtmAtom } from 'store/atoms/gtm';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
// import COLORS from 'const/colors';
import { VARIANTS } from 'const/experiments';
import { FONTS } from 'const/fonts';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  DESIGN,
  EMAIL_SUBCRIPTION,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';
import { LOCATION } from 'assets/SvgIcons';

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
const Banner: ComponentType<any> = dynamic(() =>
  import(/* webpackChunkName: "Banner" */ 'components/MicrositeV2/Banner')
);
const Loader: ComponentType<any> = dynamic(() =>
  import(/* webpackChunkName: "Loader" */ 'components/common/Loader')
);
const LongForm: ComponentType<any> = dynamic(() =>
  import(/* webpackChunkName: "LongForm" */ 'components/MicrositeV2/LongForm')
);
const CategoryHeader = dynamic(() =>
  import(/* webpackChunkName: "CategoryHeader" */ 'components/CategoryHeader')
);
const Breadcrumbs = dynamic(() =>
  import(/* webpackChunkName: "Breadcrumbs" */ 'components/Breadcrumbs')
);
const CatAndSubCatPage = dynamic(() =>
  import(
    /* webpackChunkName: "CatAndSubCatPage" */ 'components/CatAndSubCatPage'
  )
);
const MonthTabs = dynamic(() =>
  import(/* webpackChunkName: "Breadcrumbs" */ 'components/slices/MonthTabs')
);

const LttLandingPageV2 = dynamic(() =>
  import(
    /* webpackChunkName: "LttLandingPageV2" */ 'components/MicrositeV2/LttLandingPageV2'
  )
);
const ReviewSection = dynamic(() =>
  import(
    /* webpackChunkName: "ReviewSection" */ 'components/MicrositeV2/LttLandingPageV2/ReviewSection'
  )
);
const MobileBannerV2 = dynamic(() =>
  import(
    /* webpackChunkName: "MobileBannerV2" */ 'components/MicrositeV2/MobileBannerV2'
  )
);
const LttFeatureCard = dynamic(() =>
  import(
    /* webpackChunkName: "LttFeatureCard" */ 'components/ShowPages/FeatureCard'
  )
);
const DesktopBannerV2 = dynamic(() =>
  import(
    /* webpackChunkName: "DesktopBannerV2" */ 'components/MicrositeV2/DesktopBannerV2'
  )
);
const Footer = dynamic(() =>
  import(/* webpackChunkName: "Footer" */ 'components/common/Footer')
);
const MonthOnMonthPage = dynamic(() =>
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
  @media (min-width: 768px) {
    ${CategoriesSection} {
      ${({ $isCategoriesSectionSticking }) =>
        $isCategoriesSectionSticking &&
        `
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.10), 0px 0px 1px 0px rgba(0, 0, 0, 0.10);
        `};
    }

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
    overflow: hidden;
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

const StyledReviewSectionWrapper = styled.div<{ showMargin: boolean }>`
  margin-top: ${({ showMargin }) => (showMargin ? '4rem' : '0')};
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
    categoryHeaderMenu,
    baseLangIsPoiMb,
    baseLangBannerAndFooterCombinations,
    breadcrumbs,
    alternateLanguages,
    isCatOrSubCatPage,
    catAndSubCatPageData,
  } = props;

  const { languageProps } = header;
  const { currentLanguage, languages } = languageProps || {};

  const pageMetaData = useRecoilValue(metaAtom);
  const { eventsReady } = useRecoilValue(gtmAtom);
  const browseByCategorySectionRef = useRef<HTMLDivElement | null>(null);
  const [
    isCategoriesSectionSticking,
    setIsCategoriesSectionSticking,
  ] = useState(false);

  const {
    isEligible: isLTTRevampExpEligible,
    variant: lttRevampExpVariant,
    isExperimentResolving: isLTTRevampExpResolving,
  } = useABTesting({
    experimentId: 'LTT_LP_REVAMP_EXPERIMENT',
    noTrack: false,
    customEligibilityCheckFn: () => {
      return checkIfLTTMBLandingPage(uid);
    },
  });

  const showLttTreatment =
    lttRevampExpVariant === VARIANTS.TREATMENT && isLTTRevampExpEligible;

  let { categoryProps } = props;

  const isDiscountedPage = displayMonths === 'Discounted';
  const bannerAndFooterSubtext = getBannerAndFooterSubtext(
    baseLangIsPoiMb,
    baseLangBannerAndFooterCombinations
  );

  const isCollectionMicrobrand = isCollectionMB(mbType);
  const isEntertainmentMbListicle = isEntertainmentMb && isListicle;
  const isLttMonthOnMonthPage =
    isEntertainmentMbListicle &&
    !!displayMonths &&
    heroSectionSlice[0]?.items?.[0]?.month_label !== null;
  const isCategoryMicrobrand = isCategoryMB(mbType);
  const isSubCategoryMicrobrand = isSubCategoryMB(mbType);

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
  const isCategoryPage = !!primarySubCategoryId;

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
  const contentFWSlices = (slices && groupSlices(slices)) || [];
  const longFormSlices = [...contentFWSlices, ...longFormContent];
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
    mbType,
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
      });

      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,
        [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
        [ANALYTICS_PROPERTIES.TGIDS]: Object.keys(allTours).map(Number),
        ...getCommonEventMetaData(pageMetaData),
      });
    }
  }, [eventsReady]);

  useEffect(() => {
    const observeCategoriesSection = () => {
      const top =
        browseByCategorySectionRef.current?.getBoundingClientRect?.()?.top ?? 0;
      setIsCategoriesSectionSticking(top === 80);
    };
    window.addEventListener('scroll', observeCategoriesSection);

    return () => window.removeEventListener('scroll', observeCategoriesSection);
  }, []);

  if (isLTTRevampExpResolving && isLTTRevampExpEligible) return <Loader />;

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
        hasLanguageSelector={hasLanguageSelector}
        hideCurrencySelector
        isEntertainmentMbListicle={isEntertainmentMbListicle}
        logoUrl={logoUrl}
        logoAltText={whiteLabelName || ''}
        hasPoweredByHeadoutLogo={showPoweredLogo ?? true}
        isCategoryPage={isCategoryPage}
        isMonthOnMonthPage={isLttMonthOnMonthPage}
        isNewLTTLandingPageVisible={
          showLttTreatment || isCategoryPage || isLttMonthOnMonthPage
        }
        primaryCity={primaryCity}
        taggedCity={taggedCity}
        categoryHeaderMenu={categoryHeaderMenu}
        categoryHeaderMenuExists={categoryHeaderMenuExists}
      />
      <Conditional if={isLttMonthOnMonthPage}>
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
        />
      </Conditional>
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
      <Conditional if={isMobile && hasDropdownLinks}>
        <div className="main-wrapper city-selector">
          <ResponsiveSelector
            options={dropdownLinks}
            host={host}
            isMobile={isMobile}
            onChange={selectorLinkChangeHandler}
            iconPosition={'left'}
            icon={LOCATION}
            toggleIcon={false}
          />
        </div>
      </Conditional>
      <Conditional
        if={
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
      <Conditional if={isMobile && showLttTreatment && !isCatOrSubCatPage}>
        <MobileBannerV2 bannerImages={heroProps.banners} allTours={allTours} />
      </Conditional>
      <Conditional if={!isMobile && showLttTreatment && !isCatOrSubCatPage}>
        <DesktopBannerV2 bannerImages={heroProps.banners} allTours={allTours} />
      </Conditional>
      <Conditional
        if={
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
          mbTheme === THEMES.DEFAULT &&
          heroProps.banners.length &&
          !isListicle &&
          !showLttTreatment &&
          !isCatOrSubCatPage &&
          !isCategoryPage &&
          mbDesign !== DESIGN.V3
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
      <Conditional if={isCategoryPage}>
        <CategoryPage
          allTours={allTours}
          heroProps={heroProps}
          isMobile={isMobile}
          breadcrumbs={breadcrumbs}
          categoryProps={categoryProps}
          categoryTourListData={categoryTourListData}
          primarySubCategoryId={primarySubCategoryId}
          browseByCategoriesRef={browseByCategorySectionRef}
        />
      </Conditional>
      <Conditional
        if={
          isEntertainmentMbListicle &&
          !isCatOrSubCatPage &&
          !isLttMonthOnMonthPage
        }
      >
        <ListicleHeadingWrapper className="main-wrapper">
          <h1>{coverHeading}</h1>
        </ListicleHeadingWrapper>
      </Conditional>
      <Conditional if={mbTheme === THEMES.MIN_BLUE && !isCatOrSubCatPage}>
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
            {heroSectionSlice
              .filter((slice: any) => slice?.slice_type)
              .map((slice: any, index: number) => (
                <div
                  key={`${slice?.slice_type}-${index}`}
                  className={`slice-block ${slice.slice_type}`}
                >
                  {sliceHandler(slice, { isMobile })}
                </div>
              ))}
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
        />
      </Conditional>
      <Conditional if={showLttTreatment && !isCatOrSubCatPage}>
        <LttLandingPageV2
          isMobile={isMobile}
          allTours={allTours}
          categoryProps={categoryProps}
          browseByCategoriesRef={browseByCategorySectionRef}
          directTgid={directTgid}
        />
      </Conditional>
      {/* Don't need Breadcrumbs for Entertainment Category page and MoM Page because we have separate one in there banner */}
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
            />
          </Conditional>
        </div>
      </ProductsContextProvider>
      <Conditional if={showLttTreatment && currentLanguage === 'en'}>
        <LazyComponent>
          <StyledReviewSectionWrapper showMargin={!longFormContent.length}>
            <ReviewSection isMobile={isMobile} />
          </StyledReviewSectionWrapper>
        </LazyComponent>
      </Conditional>
      <Conditional
        if={isEntertainmentMb && !showLttTreatment && !isCatOrSubCatPage}
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
        />
      </LazyComponent>
    </V2MicrositeWrapper>
  );
};

export default HomePage;
