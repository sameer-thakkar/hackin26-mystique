import { useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import CashbackComponent from 'components/common/CashbackComponent';
import Conditional from 'components/common/Conditional';
import LocalisedPrice from 'UI/LPrice';
import { MBContext } from 'contexts/MBContext';
import { checkIfLTTMB } from 'utils/helper';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { CASHBACK_TYPES, THEMES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';

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
    row-gap: 0.3125rem;

    .tour-price {
      column-gap: 4px;
      margin-right: 0.25rem;
    }
  }

  .tour-scratch-price {
    grid-column: 1 / 3;
    color: ${COLORS.GRAY.G3};
    &:empty {
      display: none;
    }
    & .strike-through {
      text-decoration: line-through;
      color: ${({ isSportsExperiment }) =>
        isSportsExperiment && `${COLORS.GRAY.G3}`};
    }
  }
  @media (max-width: 768px) {
    .tour-price-container {
      gap: 0.3125rem;
      .tour-price {
        & .strike-through {
          display: flex;
        }
      }
    }
  }
`;

export const SavedTag = styled.div<{ isSportsExperiment?: boolean }>`
  padding: 0.125rem 0.25rem;
  align-self: center;
  margin-top: 1px; // hack to visually align center.
  white-space: nowrap;
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
  id?: number;
  isLoading?: boolean;
  wrapperRef?: any;
  isMobile?: boolean;
  showDummyScratchPrice?: boolean;
};

const PriceBlock = ({
  listingPrice,
  lang,
  isSportsExperiment,
  showScratchPrice: showScratchPriceProp = false,
  prefix = false,
  showSavings,
  save,
  showCashback = false,
  showCashbackBlock = false,
  isShowPage = false,
  id,
  isLoading = false,
  isMobile = false,
  wrapperRef,
  showDummyScratchPrice = false,
}: PriceBlockProps) => {
  const { uid } = useContext(MBContext);
  const isLTT = checkIfLTTMB(uid);

  const {
    originalPrice,
    finalPrice,
    currencyCode,
    bestDiscount,
    otherPricesExist,
    cashbackType,
    cashbackValue,
  } = listingPrice ?? {};
  const showScratchPrice =
    (originalPrice > finalPrice && showScratchPriceProp) ||
    showDummyScratchPrice;
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

  if (isLoading)
    return (
      <div>
        <StyledPriceBlock
          className="styled-price-block"
          showScratchPrice={showScratchPrice}
          isSportsExperiment={isSportsExperiment}
        >
          <span className="tour-scratch-price">
            <Skeleton
              width={isMobile ? '4.625rem' : '6.359375rem'}
              height={isMobile ? '0.75rem' : '0.8625rem'}
            />
          </span>
          <div className="tour-price-container">
            <Skeleton
              width={isMobile ? '8.3125rem' : '8.75rem'}
              height={isMobile ? '0.875rem' : '1.20625rem'}
            />
            <Conditional if={isLTT && showSavings && save && save > 0}>
              <SavedTag className="savedtag-block">
                <Skeleton width="60px" height="18px" />
              </SavedTag>
            </Conditional>
          </div>
        </StyledPriceBlock>
      </div>
    );

  return (
    <>
      <StyledPriceBlock
        className="styled-price-block"
        showScratchPrice={showScratchPrice}
        isSportsExperiment={isSportsExperiment}
        ref={wrapperRef}
      >
        <span
          className={`tour-scratch-price ${
            showDummyScratchPrice && !(originalPrice > finalPrice)
              ? 'dummy'
              : ''
          }`}
        >
          {showPrefix ? strings.FROM.toLowerCase() + ' ' : ''}
          <Conditional if={showScratchPrice}>
            <LocalisedPrice
              currencyCode={currencyCode}
              lang={lang}
              price={originalPrice}
            />
          </Conditional>
        </span>
        <div className="tour-price-container">
          <LocalisedPrice
            className="tour-price"
            currencyCode={currencyCode}
            lang={lang}
            price={finalPrice}
          />
          <Conditional if={isLTT && showSavings && save && save > 0}>
            <SavedTag className="savedtag-block">
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
            <SavedTag className="savedtag-block">
              {strings.formatString(strings.CASHBACK, `${cashbackValue}`)}
            </SavedTag>
          </Conditional>
          <Conditional
            if={
              showSavings && showScratchPrice && !!savingsElementsArray.length
            }
          >
            <SavedTag
              className="savedtag-block"
              isSportsExperiment={isSportsExperiment}
            >
              {savingsElementsArray.join(' + ')}
            </SavedTag>
          </Conditional>
        </div>
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
    </>
  );
};

export default PriceBlock;
