import React, { useState } from 'react';
import Header from '../Header';
import LongForm from '../LongForm';
import sliceHandler from '../../Slices';
import Banner from '../Banner';
import DismissAlert from 'UI/DismissAlert';
import Alert from 'UI/Alert';
import Footer from '../../common/Footer';
import * as labels from 'constants/localization/labels';
import { ProductsContextProvider } from 'contexts/Products';
import { ProductsWrapper } from '../ProductsWrapper';
import { ResponsiveSelector } from '../ResponsiveSelector';
import { LOCATION } from 'assets/SvgIcons';
import { groupSlices } from 'utils/helper';
import styled from 'styled-components';
import { SIZES, SOLEIL } from 'constants/ui-constants';

const V2MicrositeWrapper = styled.div`
  .alert-wrapper {
    margin-top: 40px;
  }
  .hero-slice-section {
    margin-bottom: 24px;
    margin-top: 56px;
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
  const footerLogoURL = footer.logo.url;
  const footerLogoAlt = footer.footer_logo_alt || footer.footer_logo?.alt;
  const hasDropdownLinks = enableDropdownLinks && dropdownLinks.length;

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
      {heroProps.banners.length ? (
        <Banner {...heroProps} isMobile={isMobile} ready={true} />
      ) : null}

      {alertPopup?.uid ? (
        <div className="alert-wrapper">
          <Alert popupUID={alertPopup?.uid} currentLanguage={currentLanguage} />
        </div>
      ) : null}
      {heroSectionSlice.length ? (
        <ProductsContextProvider allTours={allTours} ready={ready}>
          <div className="main-wrapper hero-slice-section">
            {heroSectionSlice.map((slice, index) => (
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
        hasPoweredByHeadoutLogo={footer.powered_by_headout || false}
        showDisclaimer={footer.show_disclaimer}
        disclaimerText={footer.disclaimer_text}
        microbrandType={footer.microbrand_type || ''}
        slices={footer.body || []}
        invertLogoColor={footer.invert_logo_color}
      />
    </V2MicrositeWrapper>
  );
};
