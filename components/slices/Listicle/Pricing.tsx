import React from 'react';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { CURRENCY_SYMBOL_MAP } from 'const/currency';
import { strings } from 'const/strings';

const StyledPricing = styled.div`
  width: max-content;
  div {
    color: ${COLORS.GRAY.G3};
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 4px;
    span {
      color: ${COLORS.GRAY.G3};
      text-decoration: line-through;
    }
  }
  @media (max-width: 768px) {
    justify-self: flex-end;
  }
`;

const Price = styled.span`
  font-size: 21px;
  line-height: 20px;
  font-weight: 700;
  ${(props) => ((props as any).floatRight ? `float: right;` : '')}
`;

type PricingProps = {
  floatRight?: boolean;
  listingPrice: any;
  currentLanguage?: string;
};

const Pricing: React.FC<React.PropsWithChildren<PricingProps>> = ({
  floatRight = false,
  listingPrice,
}) => {
  const currencySymbol = CURRENCY_SYMBOL_MAP[listingPrice.currencyCode];
  return (
    <StyledPricing>
      {listingPrice.originalPrice > listingPrice.finalPrice ? (
        <div>
          {strings.FROM.toLowerCase()}{' '}
          <span>
            {currencySymbol}
            {listingPrice.originalPrice}
          </span>
        </div>
      ) : null}
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <Price floatRight={floatRight}>
        {currencySymbol}
        {listingPrice.finalPrice}
      </Price>
    </StyledPricing>
  );
};

export default Pricing;
