import styled from 'styled-components';
import { localisedCurrencyloaderAtom } from 'store/atoms/localisedCurrencyAtom';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import Spinner from 'UI/Spinner';
import LocalisedPrice from 'UI/LPrice';
import COLORS from 'const/colors';
import { THEMES } from 'const/index';
import { strings } from 'const/strings';
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

type PriceBlockProps = {
  currencyDisplay?: CurrencyDisplayType;
  lang: string;
  price: any;
  prefix?: boolean;
  showSavings?: boolean;
  showScratchPrice?: boolean;
};

const PriceBlock = ({
  price,
  lang,
  showScratchPrice = true,
  prefix = true,
  showSavings = false,
  currencyDisplay = 'symbol',
}: PriceBlockProps) => {
  const loaderAtom = useRecoilValue(localisedCurrencyloaderAtom);

  if (loaderAtom) {
    return <Spinner width="1rem" height="1rem" />;
  }

  if (!price) return null;
  const { originalPrice, finalPrice, currencyCode, precision, bestDiscount } =
    price ?? {};

  return (
    <StyledPriceBlock>
      <Conditional if={originalPrice > finalPrice && showScratchPrice}>
        <span className="tour-scratch-price">
          {prefix ? strings.FROM + ' ' : ''}
          <LocalisedPrice
            currencyCode={currencyCode}
            currencyDisplay={currencyDisplay}
            lang={lang}
            price={originalPrice}
            precision={precision}
          />
        </span>
      </Conditional>
      <LocalisedPrice
        className="tour-price"
        currencyCode={currencyCode}
        currencyDisplay={currencyDisplay}
        lang={lang}
        price={finalPrice}
        precision={precision}
      />
      <Conditional if={showSavings && showScratchPrice && bestDiscount > 0}>
        <SavedTag>
          {strings.formatString(strings.SAVE, `${bestDiscount}`)}
        </SavedTag>
      </Conditional>
    </StyledPriceBlock>
  );
};

export default PriceBlock;
