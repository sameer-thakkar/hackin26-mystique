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
import Conditional from 'components/common/Conditional';
import Footer from 'components/common/Footer';
import DesktopBannerV2 from 'components/MicrositeV2/DesktopBannerV2';
import Header from 'components/MicrositeV2/Header';
import LttLandingPageV2 from 'components/MicrositeV2/LttLandingPageV2';
import ReviewSection from 'components/MicrositeV2/LttLandingPageV2/ReviewSection';
import MobileBannerV2 from 'components/MicrositeV2/MobileBannerV2';
import LttFeatureCard from 'components/ShowPages/FeatureCard';
import sliceHandler from 'components/Slices';
import MonthTabs from 'components/slices/MonthTabs';
import TextBanner from 'components/TextBanner';
import DismissAlert from 'UI/DismissAlert';
import { MBContext } from 'contexts/MBContext';
import { ProductsContextProvider } from 'contexts/Products';
import useOnScreen from 'hooks/useOnScreen';
import { getBannerAndFooterSubtext, isCollectionMB } from 'utils';
import {
  getCommonEventMetaData,
  sendVariablesToDataLayer,
  trackEvent,
} from 'utils/analytics';
import {
  checkIfCategoryHeaderExists,
  checkIfLTTMBLandingPage,
  getDiscountedProducts,
  getPriceSortedDiscountedProducts,
  getPriceSortedListicleTgids,
  getTGIDListForMonth,
  groupSlices,
  withShortcodes,
} from 'utils/helper';
import { gtmAtom } from 'store/atoms/gtm';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, THEMES } from 'const/index';
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
const LongForm: ComponentType<any> = dynamic(() =>
  import(/* webpackChunkName: "LongForm" */ 'components/MicrositeV2/LongForm')
);
const CategoryHeader = dynamic(() =>
  import(/* webpackChunkName: "CategoryHeader" */ 'components/CategoryHeader')
);

const V2MicrositeWrapper = styled.div`
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

  @media (max-width: 768px) {
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
    primaryCity,
    taggedCity,
    taggedCategoryName,
    taggedSubCategoryName,
    taggedMbType,
    categoryHeaderMenu,
    baseLangIsPoiMb,
    baseLangBannerAndFooterCombinations,
    alternateLanguages,
  } = props;
  const { languageProps } = header;
  const { currentLanguage, languages } = languageProps || {};

  const pageMetaData = useRecoilValue(metaAtom);
  const { eventsReady } = useRecoilValue(gtmAtom);

  const isLtt = checkIfLTTMBLandingPage(uid);

  let { categoryProps } = props;
  const isDiscountedPage = displayMonths === 'Discounted';
  const bannerAndFooterSubtext = getBannerAndFooterSubtext(
    baseLangIsPoiMb,
    baseLangBannerAndFooterCombinations
  );

  const isCollectionMicrobrand = isCollectionMB(mbType);

  if (isListicle || isDiscountedPage) {
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
  const { mbTheme, isExperimentalBot } = useContext(MBContext);
  const coverHeading = withShortcodes(heroProps?.coverHeading);
  const allTgids = Object.keys(allTours);
  const isEntertainmentMbListicle = isEntertainmentMb && isListicle;
  const {
    logo: { logoUrl = '', showPoweredLogo = true } = {},
    name: whiteLabelName,
  } = domainConfig || {};
  const categoryHeaderMenuExists = checkIfCategoryHeaderExists({
    mbDesign,
    mbType,
  });

  const v2LongFormRef = useRef(null);
  const lttFeatureCardRef = useRef(null);

  const isV2LongFormIntersecting = useOnScreen({
    ref: v2LongFormRef,
    unobserve: true,
  });
  const isLTTFeatureCardIntersecting = useOnScreen({
    ref: lttFeatureCardRef,
    unobserve: true,
  });

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

  return (
    // @ts-expect-error TS(2769): No overload matches this call.
    <V2MicrositeWrapper isEntertainmentMb={isEntertainmentMb}>
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
        isNewLTTLandingPageVisible={isLtt}
        primaryCity={primaryCity}
        taggedCity={taggedCity}
        categoryHeaderMenu={categoryHeaderMenu}
        categoryHeaderMenuExists={categoryHeaderMenuExists}
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
        if={showCovid19Alert && covid19AlertOpen && !isEntertainmentMb}
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
      <Conditional if={isMobile && isLtt}>
        <MobileBannerV2
          bannerImages={heroProps.banners}
          allTours={allTours}
          pinnedTgid={directTgid}
        />
      </Conditional>
      <Conditional if={!isMobile && isLtt}>
        <DesktopBannerV2
          bannerImages={heroProps.banners}
          allTours={allTours}
          pinnedTgid={directTgid}
        />
      </Conditional>
      <Conditional
        if={
          mbTheme === THEMES.DEFAULT &&
          heroProps.banners.length &&
          !isListicle &&
          !isLtt
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

      <Conditional if={isEntertainmentMbListicle}>
        <ListicleHeadingWrapper className="main-wrapper">
          <h1>{coverHeading}</h1>
        </ListicleHeadingWrapper>
      </Conditional>
      <Conditional if={mbTheme === THEMES.MIN_BLUE}>
        <TextBanner bannerHeading={coverHeading ? coverHeading : null} />
      </Conditional>
      <Conditional if={alertPopup?.uid}>
        <div className="alert-wrapper">
          <Alert popupUID={alertPopup?.uid} currentLanguage={currentLanguage} />
        </div>
      </Conditional>
      <Conditional if={heroSectionSlice.length && !isEntertainmentMbListicle}>
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

      <Conditional if={isEntertainmentMbListicle}>
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
      <Conditional if={hasToursSection && !isLtt}>
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
      <Conditional if={isLtt}>
        <LttLandingPageV2
          isMobile={isMobile}
          allTours={allTours}
          categoryProps={categoryProps}
        />
      </Conditional>
      <ProductsContextProvider allTours={allTours} ready={ready}>
        <div className="main-wrapper v2-long-form" ref={v2LongFormRef}>
          <Conditional
            if={
              longFormContent &&
              longFormSlices?.length &&
              (isExperimentalBot || isV2LongFormIntersecting)
            }
          >
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
              }}
              hasToursSection={hasToursSection}
            />
          </Conditional>
        </div>
      </ProductsContextProvider>
      <Conditional if={isLtt && currentLanguage === 'en'}>
        <StyledReviewSectionWrapper showMargin={!longFormContent.length}>
          <ReviewSection isMobile={isMobile} />
        </StyledReviewSectionWrapper>
      </Conditional>

      <Conditional if={isEntertainmentMb && !isLtt}>
        <div className="main-wrapper" ref={lttFeatureCardRef}>
          <Conditional if={isExperimentalBot || isLTTFeatureCardIntersecting}>
            <LttFeatureCard />
          </Conditional>
        </div>
      </Conditional>

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
      />
    </V2MicrositeWrapper>
  );
};

export default HomePage;
