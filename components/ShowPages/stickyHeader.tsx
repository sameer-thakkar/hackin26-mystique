import React, { useContext } from 'react';
import styled from 'styled-components';
import { MBContext } from 'contexts/MBContext';
import PriceBlock, { StyledPriceBlock } from 'UI/PriceBlock';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { createBookingURL } from 'utils';
import Conditional from 'components/common/Conditional';
import { expandFontToken } from 'const/typography';
import { checkLTT } from 'utils/helper';

const BannerContent = styled.div(
  ({ showComponent }) => `
  z-index: 3;
  background: ${COLORS.BRAND.WHITE};
  top: 80px;
  position: -webkit-sticky;

  ${showComponent ? `position: sticky;` : `display: none;`}
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);
  height: 78px;

  .heading-wrapper {
    display: grid;
    height: 100%;
    align-items: center;
    grid-template-columns: auto auto;
  }

  .top-text-wrapper {
    ${expandFontToken('UI/Label Regular')}
    color: ${COLORS.GRAY.G3};
    margin-bottom: 8px;
  }

  .heading {
    ${expandFontToken('Heading/Small')}
    color: ${COLORS.GRAY.G2};
  }

  .tags-wrapper {
    display: inline-block;
    border: 1px solid ${COLORS.GRAY.G6};
    color: ${COLORS.GRAY.G3};
    padding: 6px 8px;
    margin: 8px 8px 8px 0;
    border-radius: 2px;
    font-size: 12px;
  }

  .priceBlockWrapper {
    justify-content: flex-end;
    display: flex;
    border-right: 1px solid ${COLORS.GRAY.G6};
  }

  .right-pricing {
    text-align: right;
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: right;
  }

  .buy-button,
  .unavailable-button {
    margin: 0px 16px;
    color: #ffffff;
    border: none;
    ${expandFontToken('Button/Medium')}
    display: block;
    text-align: center;
    border-radius: 4px;
    width: 180px;
    padding: 12px 0;
    display: block;
  }

  .buy-button {
    color: ${COLORS.BRAND.WHITE};
    background: ${COLORS.BRAND.PURPS};
    cursor: pointer;
  }
  .unavailable-button {
    background: ${COLORS.GRAY.G5};
    color: ${COLORS.BRAND.WHITE};
  }
  .details-container {
    display: grid;
    grid-template-columns: auto auto auto auto;
  }

  .details-container .key {
    color: #666666;
    font-size: 12px;
  }

  .details-container .value {
    color: #444444;
    font-size: 15px;
  }

  .individual-container {
    padding: 10px;
  }

  ${StyledPriceBlock} {
    margin-right: 16px;
    .tour-price{
      color: ${COLORS.GRAY.G2};
      ${expandFontToken('Heading/Regular')}
    }
    .tour-scratch-price{
      ${expandFontToken('UI/Label Regular')}
      color: ${COLORS.GRAY.G4};
    }
  }

  @media (max-width: 768px) {
    .heading-wrapper {
      grid-template-columns: auto;
    }

    .right-pricing {
      margin-top: 20px;
      text-align: left;
      grid-template-columns: auto auto;
    }

    .buy-button {
      display: none;
    }

    .details-container {
      grid-template-columns: auto auto;
    }

    h1 {
      font-size: 21px;
    }

    .top-text-wrapper {
      font-size: 12px;
    }
  }
`
);

const BannerContentWrapper = styled.div`
  margin: 0 120px;
  height: 100%;
`;

const StickyHeader = ({
  tgid,
  tourGroupData,
  currentLanguage,
  nextAvailable,
  showComponent,
  isAvailable,
}) => {
  const { listingPrice, currency, name } = tourGroupData;

  const { localSymbol } = currency;

  const { nakedDomain, biLink, uid, redirectToHeadoutBookingFlow } = useContext(
    MBContext
  );

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain,
    lang: currentLanguage,
    tgid: tgid,
    biLink: biLink,
    redirectToHeadoutBookingFlow,
  });
  const isLTT = checkLTT(uid);
  const { NEXT_AVAILABLE } = strings || {};
  const REOPENING_STRING = `${NEXT_AVAILABLE}`;

  return (
    <>
      <BannerContent showComponent={showComponent}>
        <BannerContentWrapper>
          <div className="heading-wrapper">
            <div>
              <div className="top-text-wrapper">
                {isAvailable
                  ? `${REOPENING_STRING} ${nextAvailable}`
                  : strings.SHOWPAGE.SHOW_CLOSED}
              </div>
              <div className="heading">{name}</div>
            </div>
            <div className="right-pricing">
              <div className="priceBlockWrapper">
                <PriceBlock
                  price={listingPrice}
                  lang={currentLanguage}
                  showSavings={true}
                  showScratchPrice={true}
                  currencySymbolOverride={localSymbol ? localSymbol : '£'}
                  prefix={true}
                />
              </div>
              <Conditional if={isAvailable}>
                <div
                  role="button"
                  tabIndex={0}
                  className="buy-button"
                  onClick={() =>
                    window.open(bookingUrl, '_blank', 'noopener, noreferrer')
                  }
                >
                  {isLTT ? strings.CHECK_AVAIL : strings.BANNER_CTA}
                </div>
              </Conditional>
              <Conditional if={!isAvailable}>
                <button className="unavailable-button" disabled>
                  {strings.UNAVAILABLE}
                </button>
              </Conditional>
            </div>
          </div>
        </BannerContentWrapper>
      </BannerContent>
    </>
  );
};

export default StickyHeader;
