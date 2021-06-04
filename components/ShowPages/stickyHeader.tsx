import { REOPENING_STRING } from 'constants/index';

import { strings } from 'const/strings';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { createBookingURL } from 'utils';
import PriceBlock from 'UI/PriceBlock';

import { MBContext } from '../../contexts/MBContext';

const BannerContent = styled.div(
  ({ showComponent }) => `
  z-index: 3;
  background: #ffffff;
  padding: 10px 16px;
  top: 80px;
  position: -webkit-sticky;

  ${showComponent ? `position: sticky;` : `display: none;`}
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);

  .heading-wrapper {
    display: grid;
    grid-template-columns: 70% 30%;
  }

  .top-text-wrapper {
    font-size: 14px;
  }

  .heading {
    font-size: 18px;
    font-weight: 600;
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

  .right-pricing {
    text-align: right;
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
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

  .buy-button {
    padding: 12px 20px;
    background: #ec1943;
    border-radius: 8px;
    margin: 0px 16px;
    color: #ffffff;
    border: none;
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    letter-spacing: 0.8px;
    width: 160px;
    display: block;
    text-align: center;
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
`;

const StickyHeader = ({
  tgid,
  tourGroupData,
  currentLanguage,
  nextAvailable,
  showComponent,
}) => {
  const { listingPrice, currency, name } = tourGroupData;

  const { localSymbol } = currency;

  const { nakedDomain, biLink } = useContext(MBContext);

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain,
    lang: currentLanguage,
    tgid: tgid,
    biLink: biLink,
  });

  return (
    <>
      <BannerContent showComponent={showComponent}>
        <BannerContentWrapper>
          <div className="heading-wrapper">
            <div>
              <div className="top-text-wrapper">
                {REOPENING_STRING}
                {nextAvailable}
              </div>
              <div className="heading">{name}</div>
            </div>
            <div className="right-pricing">
              <div>
                <PriceBlock
                  price={listingPrice}
                  lang={currentLanguage}
                  showSavings={true}
                  showScratchPrice={true}
                  currencySymbolOverride={localSymbol ? localSymbol : '£'}
                  prefix={true}
                />
              </div>
              <div>
                <a className="buy-button" href={bookingUrl} target="blank">
                  {strings.BANNER_CTA}
                </a>
              </div>
            </div>
          </div>
        </BannerContentWrapper>
      </BannerContent>
    </>
  );
};

export default StickyHeader;
