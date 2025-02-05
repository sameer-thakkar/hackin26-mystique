import React from 'react';
import { useRecoilValue } from 'recoil';
import { Button, Text } from '@headout/eevee';
import Conditional from 'components/common/Conditional';
import CrossIconSvg from 'components/Espeon/Assets/CrossIcon';
import { DraggableBottomSheet } from 'components/Espeon/Common/DraggableBottomSheet';
import { DiscountSliver } from 'components/Espeon/ProductCard/DiscountSliver';
import Highlights from 'components/Espeon/ProductCard/Highlights';
import PriceBlock from 'components/Espeon/ProductCard/PriceBlock';
import { truncate } from 'components/Espeon/utils/string';
import { currencyListAtom } from 'store/atoms/currencyList';
import HighlightsPanel from '../HighlightsPanel';
import { swipesheetStylesRecipe } from './styles';
import { type TDetailsSwipeSheetProps } from './types';

export const DetailsSwipeSheet = ({
  tour,
  labels,
  lang = 'en',
  onCloseSwipeSheet,
  onMoreDetailsClick,
  onCtaClick,
}: TDetailsSwipeSheetProps) => {
  const currencyList = useRecoilValue(currencyListAtom);
  const { name, highlights, listingPrice } = tour;
  const { bestDiscount } = listingPrice;
  const {
    pricing: pricingLabels,
    highlightsMoreDetails,
    mainCta,
    close,
    discount: discountLabel,
  } = labels;
  // const currencyList = getCurrencyList(currenciesMap);
  const swipesheetStyles = swipesheetStylesRecipe({
    isDiscounted: !!bestDiscount,
    isExperienceCta: !['en', 'es'].includes(lang),
  });

  return (
    <DraggableBottomSheet
      sheetHeight="90%"
      onCloseCompletion={onCloseSwipeSheet}
      isOverHeader
      enableDrag
    >
      <div className={swipesheetStyles.root}>
        <nav className={swipesheetStyles.header}>
          <Text
            as="h6"
            textStyle="Semantics/Subheading/Large"
            color="core.grey.800"
          >
            {truncate(name, 40)}
          </Text>

          {/* TODO: make use of eevee button / no bg  */}
          <button aria-label={close} onClick={onCloseSwipeSheet}>
            <CrossIconSvg height={16} width={16} />
          </button>
        </nav>

        <div className={swipesheetStyles.content}>
          <HighlightsPanel
            detailsLabel={highlightsMoreDetails}
            onCtaClick={onMoreDetailsClick}
          >
            <Highlights highlights={highlights || ''} />
          </HighlightsPanel>
        </div>

        <div className={swipesheetStyles.footer}>
          <Conditional if={bestDiscount}>
            <DiscountSliver bestDiscount={bestDiscount} label={discountLabel} />
          </Conditional>

          <div className={swipesheetStyles.footerBlock}>
            <div className={swipesheetStyles.pricingUnit}>
              <PriceBlock
                lang={lang}
                labels={pricingLabels}
                currencyList={currencyList}
                listingPrice={listingPrice}
                variant={{
                  consumer: 'productCard',
                  labelStyle: 'heading',
                }}
                prefix
                shouldPointLeft
                showScratchPrice
              />
            </div>

            <div className={swipesheetStyles.ctaContainer}>
              <Button
                as="button"
                size="medium"
                btnType="primary"
                variant="primary"
                onClick={onCtaClick}
                primaryText={mainCta}
                className={swipesheetStyles.ctaButton}
              />
            </div>
          </div>
        </div>
      </div>
    </DraggableBottomSheet>
  );
};
