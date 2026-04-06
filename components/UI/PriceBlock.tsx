import { useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import CashbackComponent from 'components/common/CashbackComponent';
import Conditional from 'components/common/Conditional';
import { ExclusivePricesBooster } from 'components/MicrositeV2/EntertainmentMBLandingPageV2/ProductCards/VerticalProductCard/style';
import DiscountTag from 'components/Product/components/DiscountTag';
import LocalisedPrice from 'UI/LPrice';
import { MBContext } from 'contexts/MBContext';
import { checkIfLTTMB } from 'utils/helper';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { CASHBACK_TYPES, PAX_PROFILE_TYPE, THEMES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';

export const StyledPriceBlock = styled.div<{
  showScratchPrice: boolean;
  isSportsExperiment?: boolean;
  lang: string;
}>`
  display: grid;
  grid-template-columns: auto auto;
  grid-row-gap: 0.125rem;
  grid-column-gap: 8px;
  align-items: end;
  align-self: center;
  text-transform: camelcase;
  width: fit-content;
  .tour-price {
    column-gap: 4px;
    & .strike-through {
      display: flex;
      align-items: center;
    }
  }

  .tour-price-container {
    display: flex;
    flex-wrap: wrap;
    row-gap: 0.375rem;

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
      color: ${COLORS.GRAY.G3};
      text-decoration: line-through;
      color: ${({ isSportsExperiment }) =>
        isSportsExperiment && `${COLORS.GRAY.G3}`};
    }
  }

  .group-price-disclaimer {
    color: ${COLORS.GRAY.G3};
    font-weight: ${({ lang }) => (lang !== 'en' ? '500' : '300')};
    font-style: normal;
    font-size: ${({ lang }) => (lang !== 'en' ? '0.625rem' : '0.75rem')};
    line-height: ${({ lang }) => (lang !== 'en' ? '1.2' : '1rem')};
    letter-spacing: 0;
    grid-row: 3;
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
  newDiscountTagDesignProps?:
    | boolean
    | { showAngledTag?: boolean; shouldPointLeft?: boolean };
  customDiscountTag?: string;
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
  newDiscountTagDesignProps = false,
  customDiscountTag,
}: PriceBlockProps) => {
  const { uid, lang: contextLang } = useContext(MBContext);
  const isLTT = checkIfLTTMB(uid);

  const {
    originalPrice,
    finalPrice,
    currencyCode,
    bestDiscount,
    cashbackType,
    cashbackValue,
    type: priceProfileType,
  } = listingPrice ?? {};
  const showScratchPrice =
    (originalPrice > finalPrice && showScratchPriceProp) ||
    showDummyScratchPrice;
  const showcashbackElm =
    (showCashback || showCashbackBlock || isSportsExperiment) &&
    cashbackValue > 0 &&
    cashbackType === CASHBACK_TYPES.PERCENTAGE;

  let discountText = '';

  if (!listingPrice) {
    return null;
  }

  if (bestDiscount > 0) {
    const contents = strings.formatString<string>(
      newDiscountTagDesignProps ? strings.OFF_PERCENT : strings.SAVE,
      bestDiscount
    );
    if (Array.isArray(contents)) discountText = contents.join(' + ');
    else discountText = contents;
  }

  if (isLoading)
    return (
      <div>
        <StyledPriceBlock
          className="styled-price-block"
          showScratchPrice={showScratchPrice}
          isSportsExperiment={isSportsExperiment}
          lang={contextLang}
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
        lang={contextLang}
        ref={wrapperRef}
      >
        <span
          className={`tour-scratch-price ${
            showDummyScratchPrice && !(originalPrice > finalPrice)
              ? 'dummy'
              : ''
          }`}
        >
          {prefix ? strings.FROM.toLowerCase() + ' ' : ''}
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
          <Conditional if={!!customDiscountTag}>
            <ExclusivePricesBooster>
              <div className="booster-text">
                <DiscountTag discount={customDiscountTag as string} />
              </div>
            </ExclusivePricesBooster>
          </Conditional>
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
            if={showSavings && showScratchPrice && !!discountText.length}
          >
            {newDiscountTagDesignProps !== false ? (
              <DiscountTag
                discount={discountText}
                {...(typeof newDiscountTagDesignProps !== 'boolean' &&
                  newDiscountTagDesignProps)}
              />
            ) : (
              <SavedTag
                className="savedtag-block"
                isSportsExperiment={isSportsExperiment}
              >
                {discountText}
              </SavedTag>
            )}
          </Conditional>
        </div>

        <Conditional if={priceProfileType === PAX_PROFILE_TYPE.PER_GROUP}>
          <span className="group-price-disclaimer">
            {strings.PRICE_VARIES_BY_GROUP_SIZE}
          </span>
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
    </>
  );
};

export default PriceBlock;
