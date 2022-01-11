import { SOLEIL, COLORS } from 'const/ui-constants';
import { THEMES } from 'const/index';
import styled from 'styled-components';
import { strings } from 'const/strings';
import Conditional from 'components/common/Conditional';
import { useContext } from 'react';
import { MBContext } from 'contexts/MBContext';

import LocalisedPrice from './LPrice';

export const StyledPriceBlock = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  font-style: normal;
  font-weight: ${SOLEIL.SEMIBOLD};
  font-size: 24px;
  line-height: 30px;
  display: grid;
  grid-template-columns: auto auto;
  grid-row-gap: 4px;
  grid-column-gap: 8px;
  align-items: end;
  text-transform: camelcase;
  width: max-content;
  .tour-scratch-price {
    grid-column: 1 / 3;
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

export const SavedTag = styled.div`
  padding: 4px 8px;
  background: ${({ theme }) =>
    theme.theme === THEMES.DEFAULT ? 'transparent' : '#dbfddb'};
  color: ${({ theme }) =>
    theme.theme === THEMES.DEFAULT ? theme.primaryText : '#34a853'};
  font-size: 12px;
  line-height: 16px;
  font-style: normal;
  font-weight: normal;
  border-radius: 3px;
`;

const PriceBlock = ({
  price,
  lang,
  showScratchPrice = true,
  prefix = true,
  showSavings = false,
  currencySymbolOverride = '',
}: {
  showScratchPrice?: boolean;
  lang: string;
  price: any;
  prefix?: boolean;
  showSavings?: boolean;
  currencySymbolOverride?: string;
}) => {
  const { currencySymbolMap } = useContext(MBContext);
  if (!price) return null;
  const {
    originalPrice,
    finalPrice,
    currencyCode,
    precision,
    localSymbol,
    bestDiscount,
  } = price;
  const currencySymbol =
    localSymbol ||
    currencySymbolOverride ||
    currencySymbolMap?.[currencyCode]?.localSymbol ||
    currencyCode;
  return (
    <StyledPriceBlock>
      {originalPrice > finalPrice && showScratchPrice ? (
        <span className="tour-scratch-price">
          {prefix ? strings.FROM + ' ' : ''}
          <LocalisedPrice
            currencySymbol={currencySymbol}
            price={originalPrice}
            lang={lang}
            precision={precision}
          />
        </span>
      ) : null}
      <LocalisedPrice
        className="tour-price"
        currencySymbol={currencySymbol}
        price={finalPrice}
        lang={lang}
        precision={precision}
      />
      <Conditional if={showSavings && showScratchPrice && bestDiscount > 0}>
        <SavedTag>{strings.SAVE.replace('<val>', `${bestDiscount}`)}</SavedTag>
      </Conditional>
    </StyledPriceBlock>
  );
};

export default PriceBlock;
