import React, { useContext } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { MBContext } from 'contexts/MBContext';
import { newTabExpVariantAtom } from 'store/atoms/newTabExpVariant';
import PriceBlock, { StyledPriceBlock } from 'UI/PriceBlock';
import { COLORS } from 'const/ui-constants';
import { strings } from 'const/strings';
import { VARIANTS } from 'const/experiments';
import { createBookingURL } from 'utils';
import Conditional from 'components/common/Conditional';

const BannerContent = styled.div(
  ({ showComponent }) => `
  z-index: 3;
  background: #ffffff;
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
    font-size: 14px;
    font-style: normal;
    font-weight: normal;
    line-height: 16px;
    color: #666666;
    margin-bottom: 8px;
  }

  .heading {
    font-size: 18px;
    font-weight: 600;
    font-style: normal;
    line-height: 24px;
    color: #444444;
  }

  .tags-wrapper {
    display: inline-block;
    border: 1px solid #e2e2e2;
    color: #666666;
    padding: 6px 8px;
    margin: 8px 8px 8px 0;
    border-radius: 2px;
    font-size: 12px;
  }

  .priceBlockWrapper {
    justify-content: flex-end;
    display: flex;
    border-right: 1px solid #E2E2E2;
  }

  .right-pricing {
    text-align: right;
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: right;
  }

  .tour-price {
    color: #444444;
    font-weight: 600;
    font-size: 21px;
  }

  .tour-scratch-price {
    color: #888888;
    font-size: 14px;
    line-height: 16px;
    text-align: left;
  }

  .buy-button,
  .unavailable-button {
    margin: 0px 16px;
    color: #ffffff;
    border: none;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.6px;
    display: block;
    text-align: center;
    border-radius: 4px;
    width: 180px;
    padding: 12px 0;
    display: block;
  }

  .buy-button {
    color: ${COLORS.WHITE};
    background: ${COLORS.PURPS};
  }
  .unavailable-button {
    background: ${COLORS.GREY.G5};
    color: ${COLORS.WHITE};
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
      font-style: normal;
      font-weight: 600;
      font-size: 21px;
      line-height: 28px;
      color: #444444;
    }
    .tour-scratch-price{
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 16px;
      color: #888888;
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

  const { nakedDomain, biLink } = useContext(MBContext);
  const newTabExpVariant = useRecoilValue(newTabExpVariantAtom);

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain,
    lang: currentLanguage,
    tgid: tgid,
    biLink: biLink,
  });
  const { REOPENING, NEXT_AVAILABLE } = strings || {};
  const REOPENING_STRING = `${REOPENING} · ${NEXT_AVAILABLE}`;

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
                <a
                  className="buy-button"
                  href={bookingUrl}
                  target={
                    newTabExpVariant === VARIANTS.OPEN_SELECT_PAGE_IN_SAME_TAB
                      ? null
                      : '_blank'
                  }
                  rel="noreferrer"
                >
                  {strings.BANNER_CTA}
                </a>
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
