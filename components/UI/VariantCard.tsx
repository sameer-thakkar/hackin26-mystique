import { useState } from 'react';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import Chevron from 'components/UI/Chevron';
import LocalisedPrice from 'components/UI/LPrice';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { strings } from 'const/strings';
import { ANALYTICS_EVENTS } from 'const/index';
import { addQueryParams } from 'utils/urlUtils';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';

const VariantCardWrapper = styled.div`
  width: 100%;
  height: inherit;
  display: grid;
  grid-template-rows: repeat(2, max-content) auto;
  background: ${COLORS.WHITE};
  border: 1px solid ${COLORS.GREY.G6};
  border-radius: 8px;
  padding: 14px 16px 16px;
  box-sizing: border-box;
  p {
    margin: 0;
    padding: 0;
  }
  a {
    text-decoration: none;
  }
  .more-details {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    column-gap: 4px;
    align-items: center;
    color: ${COLORS.PURPS3};
    font-size: 14px;
    line-height: 16px;
    font-weight: ${SOLEIL.REGULAR};
    margin-top: 16px;
  }
  .chevron::after,
  .chevron::before {
    background-color: ${COLORS.PURPS3};
  }
  ul {
    margin: 0;
  }
`;

const Name = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 20px;
  font-weight: ${SOLEIL.SEMIBOLD};
  ${({ isSkeleton }) => isSkeleton && `margin-bottom: 0;`}
`;

const PriceWrapper = styled.div`
  display: grid;
  grid-template-columns: ${({ isSkeleton }) =>
    isSkeleton ? `repeat(2, 1fr)` : `repeat(2, max-content)`};
  justify-content: space-between;
`;

const From = styled.div`
  text-transform: lowercase;
  color: ${COLORS.GREY.G4};
  font-size: 10px;
  line-height: 12px;
`;

const Price = styled.div`
  display: grid;
  row-gap: 2px;
  .variant-price {
    color: ${COLORS.GREY.G2};
    font-weight: ${SOLEIL.SEMIBOLD};
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    line-height: 20px;
    margin-right: 8px;
    @media (max-width: 768px) {
      font-size: 15px;
    }
  }
  .discount {
    color: ${COLORS.OKAY_GREEN};
    background-color: ${COLORS.SOOTHING_GREEN};
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.2px;
    font-weight: ${SOLEIL.REGULAR};
    padding: 2px 4px;
    border-radius: 2px;
  }
`;

const Button = styled.div`
  padding: 7px 12px 5px 12px;
  border: 1px solid ${COLORS.PURPS};
  border-radius: 4px;
  width: 65px;
  text-align: center;
  background-color: ${COLORS.WHITE};
  color: ${COLORS.PURPS};
  cursor: pointer;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.2px;
  @media (max-width: 768px) {
    padding: 8px 12px;
  }
  &:hover {
    background-color: ${COLORS.PURPS};
    color: ${COLORS.WHITE};
    border: none;
  }
`;

const Description = styled.div`
  border-top: 1px solid ${COLORS.GREY.G7};
  border-radius: 0 0 7px 7px;
  padding-top: 16px;
  margin-top: 16px;
  ${({ isSkeleton }) =>
    isSkeleton &&
    `
    @media(min-width: 768px) {
      padding-bottom: 112px;
    }
  `}
  .desc-list {
    list-style: initial;
    padding-left: 1.6rem;
  }

  .desc-text {
    white-space: pre-line;
    color: ${COLORS.GREY.G2};
  }
`;

export const VariantCardSkeleton = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <SkeletonTheme
      baseColor={COLORS.GREY.G6}
      highlightColor={COLORS.GREY.G6}
      borderRadius={0}
      enableAnimation={false}
      height="20px"
    >
      <VariantCardWrapper>
        <Name isSkeleton>
          <Skeleton />
          <Conditional if={!isMobile}>
            <Skeleton width="66.55%" />
          </Conditional>
        </Name>
        <PriceWrapper isSkeleton>
          <Price>
            <Skeleton width="30%" />
            <Skeleton width="80%" />
          </Price>
          <div style={{ alignSelf: 'end', textAlign: 'right' }}>
            <Skeleton
              width={isMobile ? '36%' : '52%'}
              height={isMobile ? 32 : 28}
            />
          </div>
        </PriceWrapper>

        <Description isSkeleton>
          <Skeleton width="75%" />
          <Conditional if={!isMobile}>
            <Skeleton width="66.55%" />
          </Conditional>
        </Description>
      </VariantCardWrapper>
    </SkeletonTheme>
  );
};

const formatDescription = (desc) =>
  desc?.includes('- ') ? (
    <ul className="desc-list">
      {desc?.split('- ')?.map((line) => (
        <Conditional key={line} if={line}>
          <li className="desc-text">{line}</li>
        </Conditional>
      ))}
    </ul>
  ) : (
    <div className="desc-text">{desc}</div>
  );

const VariantCard = ({
  currencySymbol,
  variantListingPrice,
  variantId,
  variantName,
  variantInfo,
  language,
  bookingUrl,
  analytics,
  tgid,
  hostname,
  isMobile,
}) => {
  const bookUrl = addQueryParams(bookingUrl, {
    variantId,
  });
  const { finalPrice: variantPrice, bestDiscount } = variantListingPrice || {};
  const [isContentOpen, toggleContentOpen] = useState(false);
  const trackVariantSelection = () => {
    analytics.setVariableInDataLayer({
      event: ANALYTICS_EVENTS.COMBO_VARIANT.VARIANT_CLICKED,
      'MB name': hostname,
      'Variant ID': variantId,
      TGID: tgid,
      Device: isMobile ? 'Mweb' : 'Desktop',
    });
  };

  const getMoreDetailsButton = () => {
    const keyPressedOnReadMore = (event) => {
      if (event.keyCode == 13 && !isMobile) {
        toggleContentOpen(!isContentOpen);
      }
    };
    const innerContent = (
      <>
        {isContentOpen ? strings.SHOW_LESS_TEXT : strings.MORE_DETAILS}
        <Chevron isActive={isContentOpen} className={'chevron'} />
      </>
    );
    return (
      <div
        onClick={() => toggleContentOpen(!isContentOpen)}
        className="more-details"
        onKeyDown={keyPressedOnReadMore}
        role="button"
        tabIndex={0}
      >
        {innerContent}
      </div>
    );
  };

  return (
    <VariantCardWrapper>
      <Name>{variantName}</Name>
      <PriceWrapper>
        <Price>
          <From>{strings.FROM}</From>
          <div>
            <LocalisedPrice
              {...{
                price: variantPrice,
                currencySymbol,
                lang: language,
                className: 'variant-price',
              }}
            />
            <Conditional if={isMobile && bestDiscount > 0}>
              <span className="discount">
                {strings.SAVE.replace('<val>', `${bestDiscount}`)}
              </span>
            </Conditional>
          </div>
        </Price>
        <a href={bookUrl} target="_blank" rel="noopener noreferrer">
          <Button onClick={trackVariantSelection}>
            {strings.COMBO_VARIANT.SELECT_CTA}
          </Button>
        </a>
      </PriceWrapper>
      <Description>
        <Conditional if={!isMobile || isContentOpen}>
          {formatDescription(variantInfo) || ''}
        </Conditional>
        <Conditional if={isMobile}>{getMoreDetailsButton()}</Conditional>
      </Description>
    </VariantCardWrapper>
  );
};
export default VariantCard;
