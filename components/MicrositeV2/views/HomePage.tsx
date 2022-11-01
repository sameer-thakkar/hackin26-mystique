import React, { useState, useContext, ComponentType, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { ProductsContextProvider } from 'contexts/Products';
import { MBContext } from 'contexts/MBContext';
import Footer from 'components/common/Footer';
import sliceHandler from 'components/Slices';
import Header from 'components/MicrositeV2/Header';
import LttFeatureCard from 'components/ShowPages/FeatureCard';
import Conditional from 'components/common/Conditional';
import TextBanner from 'components/TextBanner';
import MonthTabs from 'components/slices/MonthTabs';
import DismissAlert from 'UI/DismissAlert';
import MultiBannerWrapper from 'UI/MultiBannerWrapper';
import { LOCATION } from 'assets/SvgIcons';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, THEMES } from 'const/index';
import { strings } from 'const/strings';
import { SIZES } from 'const/ui-constants';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { isSafetyIncluded } from 'utils';
import {
  groupSlices,
  getTGIDListForMonth,
  getDiscountedProducts,
  getPriceSortedDiscountedProducts,
  getPriceSortedListicleTgids,
  withShortcodes,
  checkLTT,
} from 'utils/helper';
import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { gtmAtom } from 'store/atoms/gtm';
import { expandFontToken } from 'const/typography';
import { hsidAtom } from 'store/atoms/hsid';
import { getABTestingVariant } from 'utils/experiments/experimentUtils';
import { EXPERIMENT_NAMES, VARIANTS } from 'const/experiments';

const Alert = dynamic(() => import('UI/Alert'), { ssr: false });
const ResponsiveSelector: ComponentType<any> = dynamic(
  () =>
    import('components/MicrositeV2/ResponsiveSelector').then(
      (m) => m.ResponsiveSelector
    ),
  { ssr: false }
);
const ProductsWrapper: ComponentType<any> = dynamic(() =>
  import('components/MicrositeV2/ProductsWrapper').then(
    (mod) => mod.ProductsWrapper
  )
);
const Banner: ComponentType<any> = dynamic(() =>
  import('components/MicrositeV2/Banner')
);
const LongForm: ComponentType<any> = dynamic(() =>
  import('components/MicrositeV2/LongForm')
);
const PinnedTour: ComponentType<any> = dynamic(() =>
  import('components/MicrositeV2/PinnedTour')
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

/*
TODO: Content Tabs with Category
TODO: Category with TGID and Category
*/

export const HomePage = (props) => {
  const {
    header,
    footer,
    host,
    isMobile,
    isEntertainmentMb,
    allTours,
    directTgidData,
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
  } = props;
  const pageMetaData = useRecoilValue(metaAtom);
  const { eventsReady } = useRecoilValue(gtmAtom);
  const isLTT = checkLTT(uid);

  let { categoryProps } = props;
  const isDiscountedPage = displayMonths === 'Discounted';
  const [showLtdCategoryHomepage, setShowLtdCategoryHomepage] = useState(false);
  const hsid = useRecoilValue(hsidAtom);
  useEffect(() => {
    const { categories } = categoryProps;
    if (isLTT && !isListicle && hsid && categories.length > 1) {
      const variant = getABTestingVariant(
        EXPERIMENT_NAMES.LTD_HOME_PAGE_EXPERIMENT,
        hsid
      );
      setShowLtdCategoryHomepage(variant === VARIANTS.CATEGORIES_HOMEPAGE);
    }
  }, [hsid]);

  if (isListicle || isDiscountedPage) {
    let singleCategory = [];
    let allowedTours;
    let priceSortTours;

    if (displayMonths === 'ALL') {
      allowedTours = Object.keys(allTours);
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

  useEffect(() => {
    if (eventsReady)
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_VIEWED,
        [ANALYTICS_PROPERTIES.LANGUAGE]: currentLanguage,
        [ANALYTICS_PROPERTIES.TGIDS]: Object.keys(allTours).map(Number),
        [ANALYTICS_PROPERTIES.PINNED_CARD_PRESENT]: directTgid ? true : false,
        ...getCommonEventMetaData(pageMetaData),
      });
  }, [eventsReady, directTgid]);

  const [covid19AlertOpen, setCovid19AlertOpen] = useState(true);
  const { dropdownLinks, enableDropdownLinks, languageProps } = header;
  const selectorLinkChangeHandler = (option) => {
    window.location.href = option.value;
  };
  const slices = contentFramework?.body;
  const contentFWSlices = (slices && groupSlices(slices)) || [];
  const longFormSlices = [...contentFWSlices, ...longFormContent];
  const { currentLanguage, languages } = languageProps || {};
  const hasLanguageSelector = languages?.length > 1;
  const hasToursSection = categoryProps?.categories?.length > 0;
  const { secondaryFooter } = footer;
  const footerLogoURL = footer?.logo?.url;
  const footerLogoAlt = footer?.footer_logo_alt || footer.footer_logo?.alt;
  const themeOverride = footer?.themeOverride;
  const hasDropdownLinks = enableDropdownLinks && dropdownLinks?.length;
  const { mbTheme } = useContext(MBContext);
  const coverHeading = withShortcodes(heroProps?.coverHeading);
  const hasSafe = Object.values(allTours).some((tour: any) =>
    isSafetyIncluded(tour.allTags)
  );
  const allTgids = Object.keys(allTours);
  const isEntertainmentMbListicle = isEntertainmentMb && isListicle;
  return (
    <V2MicrositeWrapper isEntertainmentMb={isEntertainmentMb}>
      <Header
        {...header}
        host={host}
        changePage={changePage}
        isMobile={isMobile}
        allTours={allTours}
        isEntertainmentMb={isEntertainmentMb}
        hasLanguageSelector={hasLanguageSelector}
        isEntertainmentMbListicle={isEntertainmentMbListicle}
        showLtdCategoryHomepage={showLtdCategoryHomepage}
      />
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
      <Conditional
        if={
          mbTheme === THEMES.DEFAULT && heroProps.banners.length && !isListicle
        }
      >
        <Banner
          bannerImages={heroProps.banners}
          isMobile={isMobile}
          ready={true}
          isEntertainmentMb={isEntertainmentMb}
          availableTours={allTgids}
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
      <Conditional if={!isEntertainmentMb}>
        <MultiBannerWrapper hasSafe={hasSafe} marginTop={40} />
      </Conditional>
      <Conditional if={heroSectionSlice.length && !isEntertainmentMbListicle}>
        <ProductsContextProvider allTours={allTours} ready={ready}>
          <div className="main-wrapper hero-slice-section">
            {heroSectionSlice
              .filter((slice) => slice?.slice_type)
              .map((slice, index) => (
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
      <Conditional
        if={
          directTgid &&
          showLtdCategoryHomepage &&
          directTgidData &&
          directTgidData.listingPrice
        }
      >
        <PinnedTour
          allTours={allTours}
          tour={directTgidData}
          isMobile={isMobile}
          host={host}
        />
      </Conditional>
      <Conditional if={hasToursSection}>
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
          showLtdCategoryHomepage={showLtdCategoryHomepage}
        />
      </Conditional>
      <ProductsContextProvider allTours={allTours} ready={ready}>
        <div className="main-wrapper v2-long-form">
          <Conditional if={longFormContent}>
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
      <Conditional if={isEntertainmentMb}>
        <div className="main-wrapper">
          <LttFeatureCard />
        </div>
      </Conditional>
      <Footer
        currentLanguage={currentLanguage}
        attraction={footer.attraction || 'attraction'}
        logoURL={footerLogoURL}
        logoAlt={footerLogoAlt}
        hasPoweredByHeadoutLogo={footer.powered_by_superbrand || false}
        showDisclaimer={!isLTT && footer.show_disclaimer}
        disclaimerText={footer.disclaimer_text}
        slices={footer.body || []}
        invertLogoColor={footer?.invertFooterLogoColor}
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
