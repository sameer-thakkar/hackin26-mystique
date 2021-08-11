import React, { useState, useContext, ComponentType } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { ProductsContextProvider } from 'contexts/Products';
import { MBContext } from 'contexts/MBContext';
import Footer from 'components/common/Footer';
import sliceHandler from 'components/Slices';
import Header from 'components/MicrositeV2/Header';
import LttSafetyBanner from 'components/ShowPages/SafetyBanner';
import LttFeatureCard from 'components/ShowPages/FeatureCard';
import Conditional from 'components/common/Conditional';
import TextBanner from 'components/TextBanner';
import DismissAlert from 'UI/DismissAlert';
import SafeDFBannerWrapper from 'UI/SafeDFBannerWrapper';
import { LOCATION } from 'assets/SvgIcons';
import { THEMES } from 'const/index';
import { strings } from 'const/strings';
import { SIZES, SOLEIL } from 'const/ui-constants';
import { isSafetyIncluded } from 'utils';
import { groupSlices, getTGIDListForMonth } from 'utils/helper';
import Image from 'UI/Image';

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

const V2MicrositeWrapper = styled.div`
  .alert-wrapper {
    margin-top: 40px;
  }
  .hero-slice-section {
    margin-bottom: 24px;
    margin-top: 56px;
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
    font-family: ${SOLEIL.FONT_STACK};
  }

  @media (max-width: 768px) {
    ${LttSafetyBanner} {
      ${({ isEntertainmentMb }) => isEntertainmentMb && `margin-bottom: 0;`}
    }
    .hero-slice-section {
      margin-top: 48px;
      margin-bottom: 48px;
    }
    .main-wrapper {
      padding-left: 16px;
      padding-right: 16px;
      width: calc(100% - 32px);
    }
  }
`;

const BannerWrapper = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  overflow: hidden;
  h1 {
    position: absolute;
    margin-left: 120px;
    z-index: 11;
    font-style: normal;
    font-weight: 600;
    font-size: 36px;
    line-height: 44px;
    display: flex;
    align-items: center;
    letter-spacing: -0.5px;
    color: #ffffff;
  }
  @media (max-width: 768px) {
    h1 {
      margin-left: 16px;
      font-size: 20px;
    }
  }
`;

const BannerImage = styled.div`
  width: 100%;
  height: 400px;
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
  } = props;

  let { categoryProps } = props;

  if (isListicle) {
    let categoryListicle = [];

    if (displayMonths === 'ALL') {
      categoryListicle = [
        {
          id: 1,
          name: displayMonths,
          rank: 0,
          ranking: {
            popularity: Object.keys(allTours),
          },
        },
      ];
    } else {
      const allowedTours = getTGIDListForMonth(allTours, displayMonths);
      categoryListicle = [
        {
          id: 1,
          name: displayMonths,
          rank: 0,
          ranking: {
            popularity: allowedTours,
          },
        },
      ];
    }

    categoryProps = {
      active: 0,
      categories: categoryListicle,
      hideSortBySelector: false,
    };
  }

  const [covid19AlertOpen, setCovid19AlertOpen] = useState(true);
  const { dropdownLinks, enableDropdownLinks } = header;
  const selectorLinkChangeHandler = (option) => {
    window.location.href = option.value;
  };
  const slices = contentFramework?.body;
  const contentFWSlices = (slices && groupSlices(slices)) || [];
  const longFormSlices = [...contentFWSlices, ...longFormContent];
  const { currentLanguage } = props.header.languageProps;
  const hasToursSection = categoryProps?.categories?.length > 0;
  const { secondaryFooter } = footer;
  const footerLogoURL = footer?.logo?.url;
  const footerLogoAlt = footer?.footer_logo_alt || footer.footer_logo?.alt;
  const themeOverride = footer?.themeOverride;
  const hasDropdownLinks = enableDropdownLinks && dropdownLinks?.length;
  const { mbTheme } = useContext(MBContext);
  const { bannerHeading } = heroProps;
  const hasSafe = Object.values(allTours).some((tour: any) =>
    isSafetyIncluded(tour.allTags)
  );

  return (
    <V2MicrositeWrapper isEntertainmentMb={isEntertainmentMb}>
      <Header
        {...header}
        host={host}
        changePage={changePage}
        isMobile={isMobile}
        allTours={allTours}
        isEntertainmentMb={isEntertainmentMb}
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
          {...heroProps}
          isMobile={isMobile}
          ready={true}
          isEntertainmentMb={isEntertainmentMb}
        />
      </Conditional>
      <Conditional if={isListicle && heroProps.banners.length}>
        <BannerWrapper>
          <h1>{bannerHeading}</h1>
          <BannerImage>
            <Image
              url={heroProps.banners[0]?.url}
              alt={heroProps.banners[0]?.alt}
              objectFit="cover"
            />
          </BannerImage>
        </BannerWrapper>
      </Conditional>
      <Conditional if={mbTheme === THEMES.MIN_BLUE}>
        <TextBanner bannerHeading={bannerHeading ? bannerHeading : null} />
      </Conditional>
      <Conditional if={alertPopup?.uid}>
        <div className="alert-wrapper">
          <Alert popupUID={alertPopup?.uid} currentLanguage={currentLanguage} />
        </div>
      </Conditional>
      <Conditional if={!isEntertainmentMb}>
        <SafeDFBannerWrapper hasSafe={hasSafe} marginTop={40} />
      </Conditional>
      <Conditional if={isEntertainmentMb}>
        <LttSafetyBanner marginTop={isListicle ? 32 : 0} />
      </Conditional>
      <Conditional if={heroSectionSlice.length}>
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
          isListicle={isListicle}
        />
      </Conditional>
      <Conditional if={isEntertainmentMb}>
        <div className="main-wrapper">
          <LttFeatureCard />
        </div>
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
      <Footer
        currentLanguage={currentLanguage}
        attraction={footer.attraction || 'attraction'}
        logoURL={footerLogoURL}
        logoAlt={footerLogoAlt}
        hasPoweredByHeadoutLogo={footer.powered_by_superbrand || false}
        showDisclaimer={footer.show_disclaimer}
        disclaimerText={footer.disclaimer_text}
        microbrandType={footer.microbrand_type || ''}
        slices={footer.body || []}
        invertLogoColor={footer.invert_logo_color}
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
