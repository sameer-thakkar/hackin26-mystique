import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import LocalisedPrice from 'UI/LPrice';
import COLORS from 'const/colors';
import { CASHBACK_TYPES, THEMES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { FONTS } from 'const/fonts';
import { HALYARD } from 'const/ui-constants';
import { CurrencyDisplayType } from 'utils/currency';

export const StyledPriceBlock = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  font-style: normal;
  font-weight: 600;
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
    color: ${COLORS.GRAY.G4};
    text-transform: lowercase;
    & > span {
      text-transform: uppercase;
      text-decoration: line-through;
      color: ${COLORS.GRAY.G4};
    }
  }
`;

export const SavedTag = styled.div`
  padding: 1px 4px;
  align-self: center;
  margin-top: 1px; // hack to visually align center.
  background: ${({ theme }) =>
    theme.theme === THEMES.DEFAULT
      ? 'transparent'
      : COLORS.BACKGROUND.SOOTHING_GREEN};
  color: ${({ theme }) =>
    theme.theme === THEMES.DEFAULT
      ? theme.primaryText
      : COLORS.TEXT.OKAY_GREEN_3};

  ${expandFontToken(FONTS.MISC_TAG_REGULAR)}
  border-radius: 2px;
`;

type PriceBlockProps = {
  currencyDisplay?: CurrencyDisplayType;
  lang: string;
  listingPrice: any;
  showSavings?: boolean;
  showScratchPrice?: boolean;
};

const PriceBlock = ({
  listingPrice,
  lang,
  showScratchPrice = true,
  showSavings,
  currencyDisplay = 'symbol',
}: PriceBlockProps) => {
  if (!listingPrice) return null;
  const {
    originalPrice,
    finalPrice,
    currencyCode,
    precision,
    bestDiscount,
    cashbackValue,
    cashbackType,
    otherPricesExist,
  } = listingPrice ?? {};

  const savingsElementsArray = [];

  if (bestDiscount > 0) {
    savingsElementsArray.push(
      strings.formatString(strings.SAVE, `${bestDiscount}`)
    );
  }

  if (cashbackValue > 0) {
    savingsElementsArray.push(
      `${strings.formatString(
        strings.CASHBACK,
        `${cashbackValue}${
          cashbackType === CASHBACK_TYPES.PERCENTAGE ? '%' : ''
        }`
      )}`
    );
  }

  return (
    <StyledPriceBlock>
      <span className="tour-scratch-price">
        {otherPricesExist ? strings.FROM + ' ' : ''}
        <Conditional if={originalPrice > finalPrice && showScratchPrice}>
          <LocalisedPrice
            currencyCode={currencyCode}
            currencyDisplay={currencyDisplay}
            lang={lang}
            price={originalPrice}
            precision={precision}
          />
        </Conditional>
      </span>
      <LocalisedPrice
        className="tour-price"
        currencyCode={currencyCode}
        currencyDisplay={currencyDisplay}
        lang={lang}
        price={finalPrice}
        precision={precision}
      />
      <Conditional
        if={showSavings && showScratchPrice && !!savingsElementsArray.length}
      >
        <SavedTag>{savingsElementsArray.join(' + ')}</SavedTag>
      </Conditional>
    </StyledPriceBlock>
  );
};

export default PriceBlock;
