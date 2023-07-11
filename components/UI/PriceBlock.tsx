import { useContext } from 'react';
import styled from 'styled-components';
import CashbackComponent from 'components/common/CashbackComponent';
import Conditional from 'components/common/Conditional';
import LocalisedPrice from 'UI/LPrice';
import { MBContext } from 'contexts/MBContext';
import { CurrencyDisplayType } from 'utils/currency';
import { checkIfLTTMB } from 'utils/helper';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { CASHBACK_TYPES, THEMES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import 'react-loading-skeleton/dist/skeleton.css';

export const StyledPriceBlock = styled.div<{
  showScratchPrice: boolean;
  isSportsExperiment?: boolean;
}>`
  display: grid;
  grid-template-columns: auto auto;
  grid-row-gap: ${({ isSportsExperiment }) =>
    isSportsExperiment ? '.125rem' : '.25rem'};
  grid-column-gap: 8px;
  align-items: end;
  text-transform: camelcase;
  width: max-content;
  .tour-price {
    column-gap: 4px;
    & .strike-through {
      display: flex;
      align-items: center;
    }
  }

  .tour-price-container {
    display: flex;

    .tour-price {
      column-gap: 4px;
      margin-right: 0.25rem;
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
      color: ${({ isSportsExperiment }) =>
        isSportsExperiment && `${COLORS.GRAY.G4}`};
    }
  }
  @media (max-width: 768px) {
    .tour-price {
      & .strike-through {
        display: flex;
      }
    }
  }
`;

export const SavedTag = styled.div<{ isSportsExperiment?: boolean }>`
  padding: 0.125rem 0.25rem;
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

  ${({ isSportsExperiment }) =>
    isSportsExperiment &&
    `
    background: ${COLORS.TEXT.OKAY_GREEN_3};
    color: ${COLORS.BRAND.WHITE};
    padding: 0.25rem .375rem !important;
    margin-top: 0;
    `}

  ${expandFontToken(FONTS.MISC_TAG_REGULAR)}
  border-radius: 2px;
  width: fit-content;
`;

export const PriceSkeleton = styled.div<{ showScratchPrice: boolean }>`
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
  isSportsExperiment?: boolean;
  showSavings?: boolean;
  showScratchPrice?: boolean;
  prefix?: boolean;
  save?: number;
  showCashback?: boolean;
  showCashbackBlock?: boolean;
  isShowPage?: boolean;
  id?: string;
};

const PriceBlock = ({
  listingPrice,
  lang,
  isSportsExperiment,
  showScratchPrice: showScratchPriceProp = false,
  prefix = false,
  showSavings,
  currencyDisplay = 'symbol',
  save,
  showCashback = false,
  showCashbackBlock = false,
  isShowPage = false,
  id,
}: PriceBlockProps) => {
  const { uid } = useContext(MBContext);
  const isLTT = checkIfLTTMB(uid);

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
  const showcashbackElm =
    (showCashback || showCashbackBlock || isSportsExperiment) &&
    cashbackValue > 0 &&
    cashbackType === CASHBACK_TYPES.PERCENTAGE;

  const savingsElementsArray = [];

  if (!listingPrice) {
    return null;
  }

  if (bestDiscount > 0) {
    savingsElementsArray.push(
      strings.formatString(strings.SAVE, `${bestDiscount}`)
    );
  }

  return (
    <div>
      <StyledPriceBlock
        className={'styled-price-block'}
        showScratchPrice={showScratchPrice}
        isSportsExperiment={isSportsExperiment}
      >
        <span className="tour-scratch-price">
          {showPrefix ? strings.FROM.toLowerCase() + ' ' : ''}
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
          />
          <Conditional if={isLTT && showSavings && save && save > 0}>
            <SavedTag className={'savedtag-block'}>
              {strings.formatString(
                isShowPage ? strings.SAVE_PERCENT : strings.SAVE_UPTO_PERCENT,
                `${save}`
              )}
            </SavedTag>
          </Conditional>
          <Conditional
            if={
              !save &&
              showcashbackElm &&
              !showCashbackBlock &&
              !isSportsExperiment
            }
          >
            <SavedTag className={'savedtag-block'}>
              {strings.formatString(strings.CASHBACK, `${cashbackValue}`)}
            </SavedTag>
          </Conditional>
        </div>
        <Conditional
          if={showSavings && showScratchPrice && !!savingsElementsArray.length}
        >
          <SavedTag
            className={`savedtag-block`}
            isSportsExperiment={isSportsExperiment}
          >
            {savingsElementsArray.join(' + ')}
          </SavedTag>
        </Conditional>
      </StyledPriceBlock>
      <Conditional
        if={showcashbackElm && (showCashbackBlock || isSportsExperiment)}
      >
        <CashbackComponent
          cashbackAmount={cashbackValue}
          isSportsExperiment={isSportsExperiment}
          id={id}
        />
      </Conditional>
    </div>
  );
};

export default PriceBlock;
