import React, { useState } from 'react';
import Header from '../Header';
import LongForm from '../LongForm';
import sliceHandler from '../../Slices';
import Banner from '../Banner';
import DismissAlert from '../../UI/DismissAlert';
import Alert from '../../UI/Alert';
import Footer from '../../common/Footer';
import * as labels from '../../../public/static/localization/labels';
import { ProductsContextProvider } from '../../../contexts/Products';
import { ProductsWrapper } from '../ProductsWrapper';
import { ResponsiveSelector } from '../ResponsiveSelector';
import { LOCATION } from '../../../public/static/svg-icons';
import { SIZES } from '../../../constants/ui-constants';
import { groupSlices } from '../../../utils/helper';

export const HomePage = props => {
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
    _openCategory,
    uid,
    directTgid,
    heroSectionSlice,
    _isFetched,
    contentFramework,
    ready,
    alertPopup,
    showCovid19Alert,
  } = props;

  const [covid19AlertOpen, setCovid19AlertOpen] = useState(true);

  const { dropdownLinks } = header;
  const selectorLinkChangeHandler = option => {
    window.location.href = option.value;
  };
  const slices = contentFramework?.body;
  const contentFWSlices = (slices && groupSlices(slices)) || [];
  const longFormSlices = [...contentFWSlices, ...longFormContent];
  const { currentLanguage } = props.header.languageProps;
  const hasToursSection = categoryProps.categories.length > 0;
  const footerLogoURL = footer.logo.url;
  const footerLogoAlt = footer.footer_logo_alt || footer.footer_logo?.alt;

  return (
    <div className="microsite-v2-wrapper">
      <Header
        {...header}
        host={host}
        changePage={changePage}
        isMobile={isMobile}
        allTours={allTours}
      />
      {isMobile ? (
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
      {true && covid19AlertOpen ? (
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
        <Banner {...heroProps} isMobile={isMobile} ready={ready} />
      ) : null}

      {alertPopup?.uid ? (
        <div className="alert-wrapper">
          <Alert popupUID={alertPopup?.uid} currentLanguage={currentLanguage} />
        </div>
      ) : null}
      {heroSectionSlice.length ? (
        <div className="main-wrapper hero-slice-section">
          {heroSectionSlice.map((slice, index) => (
            <div key={index} className={`slice-block ${slice.slice_type}`}>
              {sliceHandler(slice, { isMobile })}
            </div>
          ))}
        </div>
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
        microbrandType={footer.microbrand_type || ''}
        slices={footer.body || []}
        invertLogoColor={footer.invert_logo_color}
      />
      <style jsx>
        {`
          .alert-wrapper {
            margin-top: 40px;
          }
        `}
      </style>
      <style jsx global>
        {`
          // TODO: Handle Space Between Slices Elsewhere.
          .hero-slice-section {
            margin-top: 24px;
            margin-bottom: 56px;
          }
          .select-wrapper {
            all: unset;
          }
          .city-selector {
            margin-bottom: 24px;
          }
          .main-wrapper.v2-long-form {
            max-width: unset;
            padding: unset;
            margin: unset;
          }
          .long-form .slice-block.rich_text {
            max-width: ${SIZES.MAX_WIDTH};
            margin-left: auto;
            margin-right: auto;
            font-family: Graphik;
          }
          @media (max-width: 768px) {
            .hero-slice-section {
              margin-top: 48px;
              margin-bottom: 48px;
            }
          }
        `}
      </style>
    </div>
  );
};
