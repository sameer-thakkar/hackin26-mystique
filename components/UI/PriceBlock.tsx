import * as labels from 'constants/localization/labels';
import LocalisedPrice from './LPrice';
import { SOLEIL, COLORS } from 'constants/ui-constants';
import styled from 'styled-components';
import { CURRENCY_SYMBOL_MAP } from 'constants/index';

const StyledPriceBlock = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  font-style: normal;
  font-weight: ${SOLEIL.SEMIBOLD};
  font-size: 24px;
  line-height: 30px;
  display: grid;
  grid-row-gap: 4px;
  text-transform: uppercase;
  .tour-scratch-price {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    color: ${COLORS.GREY_G4};
    text-transform: lowercase;
    & > span {
      text-transform: uppercase;
      text-decoration: line-through;
      color: ${COLORS.GREY_G4};
    }
  }
`;

const PriceBlock = ({
  price,
  lang,
  showScratchPrice = true,
  prefix = true,
}: {
  showScratchPrice?: boolean;
  lang: string;
  price: any;
  prefix?: boolean;
}) => {
  if (!price) return null;
  const { originalPrice, finalPrice, currencyCode } = price;
  const currencySymbol = CURRENCY_SYMBOL_MAP[currencyCode];
  return (
    <StyledPriceBlock>
      {originalPrice > finalPrice && showScratchPrice ? (
        <span className="tour-scratch-price">
          {prefix ? labels[lang].FROM + ' ' : ''}
          <LocalisedPrice
            currencySymbol={currencySymbol}
            price={originalPrice}
            lang={lang}
          />
        </span>
      ) : null}
      <LocalisedPrice
        className="tour-price"
        currencySymbol={currencySymbol}
        price={finalPrice}
        lang={lang}
      />
    </StyledPriceBlock>
  );
};

export default PriceBlock;
