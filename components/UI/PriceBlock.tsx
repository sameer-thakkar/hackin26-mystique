import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import usePrice from 'hooks/usePrice';
import LocalisedPrice from 'UI/LPrice';
import COLORS from 'const/colors';
import { THEMES, CASHBACK_TYPES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { FONTS } from 'const/fonts';
import { CurrencyDisplayType } from 'utils/currency';

export const StyledPriceBlock = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-row-gap: 4px;
  grid-column-gap: 8px;
  align-items: end;
  text-transform: camelcase;
  width: max-content;

  .tour-price-container {
    display: flex;

    .tour-price {
      column-gap: 4px;
      margin-right: 0.3rem;
    }
  }

  .tour-scratch-price {
    grid-column: 1 / 3;
    color: ${COLORS.GRAY.G4};
    &:empty {
      display: none;
    }
    & .strike-through {
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

export const PriceSkeleton = styled.div`
  display: grid;
  row-gap: 2px;
  opacity: 0.8;

  &:before,
  &:after {
    content: '';
    display: block;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      ${COLORS.GRAY.G6} 20%,
      #f9f7f78c 50%,
      ${COLORS.GRAY.G6} 100%
    );
    background-size: 300% 100%;
    animation: shimmer 2s ease infinite forwards;
  }
  ${({ showScratchPrice }) =>
    showScratchPrice &&
    `
      &:before {
        height: 18px;
        width: 90px;
      }
  `}

  &:after {
    height: 28px;
    width: 120px;
  }

  @keyframes shimmer {
    from {
      background-position: 100% 0%;
    }

    to {
      background-position: -100% 0%;
    }
  }
`;

type PriceBlockProps = {
  currencyDisplay?: CurrencyDisplayType;
  lang: string;
  listingPrice: any;
  showSavings?: boolean;
  showScratchPrice?: boolean;
  tgid?: number;
  prefix?: boolean;
  showCashback?: boolean;
};

const PriceBlock = ({
  listingPrice: ssrListingPrice,
  lang,
  showScratchPrice: showScratchPriceProp = false,
  prefix = false,
  showSavings,
  currencyDisplay = 'symbol',
  tgid,
  showCashback = false,
}: PriceBlockProps) => {
  const { isLoading, listingPrice } = usePrice({ tgid, ssrListingPrice });
  if (!listingPrice) return null;

  const {
    originalPrice,
    finalPrice,
    currencyCode,
    precision,
    bestDiscount,
    otherPricesExist,
    cashbackType,
    cashbackValue,
  } = listingPrice ?? {};

  const showScratchPrice = originalPrice > finalPrice && showScratchPriceProp;
  const showPrefix = prefix && otherPricesExist;
  const pricePrefix = showPrefix && !showScratchPrice ? strings.FROM + ' ' : '';
  const showcashbackElm =
    showCashback &&
    cashbackValue > 0 &&
    cashbackType === CASHBACK_TYPES.PERCENTAGE;

  if (isLoading) {
    return <PriceSkeleton showScratchPrice={showScratchPrice || showPrefix} />;
  }

  const savingsElementsArray = [];

  if (bestDiscount > 0) {
    savingsElementsArray.push(
      strings.formatString(strings.SAVE, `${bestDiscount}`)
    );
  }

  return (
    <StyledPriceBlock>
      <span className="tour-scratch-price">
        {showPrefix && showScratchPrice ? strings.FROM + ' ' : ''}
        <Conditional if={showScratchPrice}>
          <LocalisedPrice
            currencyCode={currencyCode}
            currencyDisplay={currencyDisplay}
            lang={lang}
            price={originalPrice}
            precision={precision}
          />
        </Conditional>
      </span>
      <div className="tour-price-container">
        <LocalisedPrice
          className="tour-price"
          currencyCode={currencyCode}
          currencyDisplay={currencyDisplay}
          lang={lang}
          price={finalPrice}
          precision={precision}
          prefix={pricePrefix}
        />
        <Conditional if={showcashbackElm}>
          <SavedTag>
            {strings.formatString(strings.CASHBACK, `${cashbackValue}%`)}
          </SavedTag>
        </Conditional>
      </div>
      <Conditional
        if={showSavings && showScratchPrice && !!savingsElementsArray.length}
      >
        <SavedTag>{savingsElementsArray.join(' + ')}</SavedTag>
      </Conditional>
    </StyledPriceBlock>
  );
};

export default PriceBlock;
