import React, { useState, useContext } from 'react';
import dynamic from 'next/dynamic';
import Header from '../Header';
import LongForm from '../LongForm';
import sliceHandler from '../../Slices';
import Banner from '../Banner';
import DismissAlert from 'UI/DismissAlert';
import Footer from '../../common/Footer';
import * as labels from 'constants/localization/labels';
import { ProductsContextProvider } from 'contexts/Products';
import { ProductsWrapper } from '../ProductsWrapper';
import { ResponsiveSelector } from '../ResponsiveSelector';
import { LOCATION } from 'assets/SvgIcons';
import { groupSlices } from 'utils/helper';
import styled from 'styled-components';
import { SIZES, SOLEIL } from 'constants/ui-constants';
import SafeDFBannerWrapper from 'UI/SafeDFBannerWrapper';
import { isSafetyIncluded, getDFValidityFromTags } from 'utils';
import Conditional from 'components/common/Conditional';
import TextBanner from 'components/TextBanner';
import { MBContext } from 'contexts/MBContext';
import { THEMES } from 'constants/index';
import dayjs from 'dayjs';

const Alert = dynamic(() => import('UI/Alert'), { ssr: false });

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

export const HomePage = (props) => {
  const {
    header,
    footer,
    host,
    isMobile,
    allTours,
    longFormContent,
    categoryProps,
    heroProps,
    changePage,
    uid,
    directTgid,
    heroSectionSlice,
    contentFramework,
    ready,
    alertPopup,
    showCovid19Alert,
  } = props;
  const [covid19AlertOpen, setCovid19AlertOpen] = useState(true);
  const { dropdownLinks, enableDropdownLinks } = header;
  const selectorLinkChangeHandler = (option) => {
    window.location.href = option.value;
  };
  const slices = contentFramework?.body;
  const contentFWSlices = (slices && groupSlices(slices)) || [];
  const longFormSlices = [...contentFWSlices, ...longFormContent];
  const { currentLanguage } = props.header.languageProps;
  const hasToursSection = categoryProps.categories.length > 0;
  const { secondaryFooter } = footer;
  const footerLogoURL = footer.logo.url;
  const footerLogoAlt = footer.footer_logo_alt || footer.footer_logo?.alt;
  const themeOverride = footer.themeOverride;
  const hasDropdownLinks = enableDropdownLinks && dropdownLinks.length;
  const { mbTheme } = useContext(MBContext);
  const { bannerHeading } = heroProps;
  const hasSafe = Object.values(allTours).some((tour: any) =>
    isSafetyIncluded(tour.allTags)
  );
  const [dfExpiryDate, ..._others] = Object.values(allTours)
    .filter((tour: any) => tour && tour.dfListingPrice)
    .map((tour: any) => getDFValidityFromTags(tour.allTags))
    .filter((d) => d)
    .sort((a, b) => (dayjs(a).isAfter(b) ? -1 : 1));
  return (
    <V2MicrositeWrapper>
      <Header
        {...header}
        host={host}
        changePage={changePage}
        isMobile={isMobile}
        allTours={allTours}
      />
      {isMobile && hasDropdownLinks ? (
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
      ) : null}
      {showCovid19Alert && covid19AlertOpen ? (
        <DismissAlert
          readMoreLink={labels[currentLanguage].COVID19_ALERT.LINK}
          readMore={labels[currentLanguage].READ_MORE}
          keyText={labels[currentLanguage].COVID19_ALERT.KEY_TEXT}
          text={labels[currentLanguage].COVID19_ALERT.TEXT}
          handleClose={() => {
            setCovid19AlertOpen(false);
          }}
        />
      ) : null}
      <Conditional if={mbTheme === THEMES.DEFAULT && heroProps.banners.length}>
        <Banner {...heroProps} isMobile={isMobile} ready={true} />
      </Conditional>
      <Conditional if={mbTheme === THEMES.MIN_BLUE}>
        <TextBanner bannerHeading={bannerHeading ? bannerHeading : null} />
      </Conditional>

      {alertPopup?.uid ? (
        <div className="alert-wrapper">
          <Alert popupUID={alertPopup?.uid} currentLanguage={currentLanguage} />
        </div>
      ) : null}

      <SafeDFBannerWrapper
        hasSafe={hasSafe}
        dfExpiryDate={dfExpiryDate}
        marginTop={40}
      />

      {heroSectionSlice.length ? (
        <ProductsContextProvider allTours={allTours} ready={ready}>
          <div className="main-wrapper hero-slice-section">
            {heroSectionSlice
              .filter((slice) => slice?.slice_type)
              .map((slice, index) => (
                <div key={index} className={`slice-block ${slice.slice_type}`}>
                  {sliceHandler(slice, { isMobile })}
                </div>
              ))}
          </div>
        </ProductsContextProvider>
      ) : null}
      {hasToursSection ? (
        <ProductsWrapper
          availableTGIDs={Object.keys(allTours)}
          directTgid={parseInt(directTgid)}
          allTours={allTours}
          isMobile={isMobile}
          currentLanguage={currentLanguage}
          categoryProps={categoryProps}
          changePage={changePage}
          host={host}
          uid={uid}
        />
      ) : null}
      <ProductsContextProvider allTours={allTours} ready={ready}>
        <div className="main-wrapper v2-long-form">
          {longFormContent ? (
            <LongForm
              slicesArray={longFormSlices}
              props={{
                allTours,
                isMobile,
                changePage,
                host,
                uid,
              }}
              hasToursSection={hasToursSection}
            />
          ) : null}
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
      />
    </V2MicrositeWrapper>
  );
};
