import React from 'react';
import dynamic from 'next/dynamic';
import Header from '../Header';
import LongForm from '../LongForm';
import sliceHandler from '../../Slices';
const Banner = dynamic(() => import('../Banner'), { ssr: false });
const Footer = dynamic(() => import('../Footer'), { ssr: false });
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
    openCategory,
    uid,
    directTgid,
    heroSectionSlice,
    isFetched,
    customFooter,
    contentFramework,
    ready,
  } = props;
  const { dropdownLinks } = header;
  const selectorLinkChangeHandler = option => {
    window.location.href = option.value;
  };
  const slices = contentFramework?.body;
  const contentFWSlices = (slices && groupSlices(slices)) || [];
  const longFormSlices = [...contentFWSlices, ...longFormContent];
  const { currentLanguage } = props.header.languageProps;
  const hasToursSection = categoryProps.categories.length > 0;

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
      {heroProps.banners.length ? (
        <Banner {...heroProps} isMobile={isMobile} ready={ready} />
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

      <ProductsContextProvider allTours={allTours}>
        <div className="main-wrapper">
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
      <Footer {...footer} {...customFooter} isMobile={isMobile} />
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
          .long-form .slice-block.rich_text {
            max-width: ${SIZES.MAX_WIDTH};
            margin-left: auto;
            margin-right: auto;
            font-family: Graphik;
          }
        `}
      </style>
    </div>
  );
};
