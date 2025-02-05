import React from 'react';
import type { RecipeVariantProps } from '@headout/pixie/css';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { CASHBACK_TYPES } from 'components/Espeon/constants';
import LocalisedPrice from 'components/Espeon/ProductCard/LocalisedPrice';
import type { localisedPriceStyles } from 'components/Espeon/ProductCard/LocalisedPrice/styles';
import { populateStringTemplate } from 'components/Espeon/utils/string';
import DiscountTag from '../DiscountTag';
import { priceBlockStyles } from './styles';
import type { TPriceBlock } from './types';

const PriceBlock = (props: TPriceBlock) => {
  const {
    lang,
    labels,
    listingPrice,
    currencyList,
    isSportsExperiment,
    showScratchPrice = false,
    prefix = false,
    save,
    showCashback = false,
    showCashbackBlock = false,
    showDummyScratchPrice = false,
    variant,
    className,
    showNewDiscountTag = false,
    showAngledTag = false,
    shouldPointLeft = false,
  } = props;

  const {
    originalPrice = 0,
    finalPrice = 0,
    currencyCode,
    bestDiscount = 0,
    cashbackType,
    cashbackValue = 0,
  } = listingPrice ?? {};

  const finalShowScratchPrice =
    (originalPrice > finalPrice && showScratchPrice) || showDummyScratchPrice;
  const onHideScratchPrice =
    showDummyScratchPrice && !(originalPrice > finalPrice);

  const {
    priceBlockWrapper,
    scratchPrice,
    priceContainer,
    tourPrice,
    savedTag,
  } = priceBlockStyles({ ...variant, isDummy: !!onHideScratchPrice });

  const { consumer } = variant || {};

  const isHighlightsModalVariant = consumer === 'highlightsModal';

  const showcashbackElm =
    (showCashback || showCashbackBlock || isSportsExperiment) &&
    cashbackValue > 0 &&
    cashbackType === CASHBACK_TYPES.PERCENTAGE;

  const showCashBack =
    !save && !!showcashbackElm && !showCashbackBlock && !isSportsExperiment;

  return (
    <div
      data-qa-marker="price-block-wrapper"
      data-section="pricing"
      className={cx(priceBlockWrapper, className)}
    >
      <Conditional
        if={
          !isHighlightsModalVariant &&
          !shouldPointLeft &&
          bestDiscount > 0 &&
          showNewDiscountTag
        }
      >
        <DiscountTag
          discountText={populateStringTemplate(
            labels.offPercentage,
            String(bestDiscount)
          )}
          showAngledTag={showAngledTag}
          shouldPointLeft={false}
        />
      </Conditional>

      <span data-qa-marker="scratch-price" className={scratchPrice}>
        {prefix ? labels.from.toLowerCase() + ' ' : ''}
        <Conditional if={finalShowScratchPrice}>
          <LocalisedPrice
            currencyCode={currencyCode}
            currencyList={currencyList}
            lang={lang}
            variant={{
              ...(consumer &&
                ({
                  tourScratchPriceconsumer: consumer,
                } as unknown as RecipeVariantProps<
                  typeof localisedPriceStyles
                >)),
            }}
            price={originalPrice}
          />
        </Conditional>
      </span>
      <div data-qa-marker="final-price" className={priceContainer}>
        <Conditional
          if={
            isHighlightsModalVariant && bestDiscount > 0 && showNewDiscountTag
          }
        >
          <DiscountTag
            discountText={populateStringTemplate(
              labels.offPercentage,
              String(bestDiscount)
            )}
            showAngledTag={showAngledTag}
            shouldPointLeft={false}
          />
        </Conditional>

        <LocalisedPrice
          className={tourPrice}
          currencyList={currencyList}
          currencyCode={currencyCode}
          lang={lang}
          variant={{
            ...(consumer &&
              ({
                tourPriceconsumer: consumer,
              } as RecipeVariantProps<typeof localisedPriceStyles>)),
          }}
          price={finalPrice}
        />

        <Conditional
          if={shouldPointLeft && bestDiscount > 0 && showNewDiscountTag}
        >
          <DiscountTag
            discountText={populateStringTemplate(
              labels.offPercentage,
              String(bestDiscount)
            )}
            showAngledTag={showAngledTag}
            shouldPointLeft={true}
          />
        </Conditional>
        <Conditional if={showCashBack}>
          <div data-qa-marker="cashback" className={savedTag}>
            {populateStringTemplate(labels.cashbackText, `${cashbackValue}`)}
          </div>
        </Conditional>
      </div>
    </div>
  );
};

export default PriceBlock;
