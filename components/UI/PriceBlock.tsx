import * as labels from 'constants/localization/labels';
import LocalisedPrice from './LPrice';
import { SOLEIL, COLORS } from 'constants/ui-constants';
import styled from 'styled-components';
import { THEMES } from 'constants/index';
import Conditional from 'components/common/Conditional';
import { getSavingsPercent } from 'utils';
import { useContext } from 'react';
import { MBContext } from 'contexts/MBContext';

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
  text-transform: uppercase;
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
  text-transform: ${({ theme }) =>
    theme.theme === THEMES.DEFAULT ? 'uppercase' : 'initial'};
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
  const { originalPrice, finalPrice, currencyCode } = price;
  const currencySymbol =
    currencySymbolOverride || currencySymbolMap[currencyCode]?.localSymbol;
  const savings = price && showSavings ? getSavingsPercent(price) : -1;
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
      <Conditional if={savings > 0 && showScratchPrice}>
        <SavedTag>
          {labels[lang].SAVE.replace('<val>', `${savings.toFixed(0)}%`)}
        </SavedTag>
      </Conditional>
    </StyledPriceBlock>
  );
};

export default PriceBlock;
