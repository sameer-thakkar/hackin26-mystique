import React, { FC, useEffect, useRef, useState } from 'react';
import { BookNowCta } from 'components/Product/components/BookNowCta';
import { useProductCard } from 'contexts/productCardContext';
import { PRODUCT_CARD_REVAMP } from 'const/index';
import { strings } from 'const/strings';
import { ButtonWrapper, PriceBar, PriceElements } from './styles';

interface ListingPrice {
  currencyCode: string;
  originalPrice: number;
  finalPrice: number;
  otherPricesExist: boolean;
  bestDiscount: number;
}

interface PricingBarProps {
  listingPrice: ListingPrice;
  lang: string;
  showScratchPrice: boolean;
  isCombo: boolean;
  mbTheme: string;
  productBookingUrl: string;
  isAsideBarOverlay: boolean;
  sendBookNowEvent: (placement: string) => void;
  handleShowComboPopup: (placement: string) => void;
  isV3Design: boolean;
  tgid: string;
  isSportsExperiment: boolean;
  isGpMotorTicketsMb: boolean;
  isSportsSubCategory: boolean;
  showCustomProductCardCTA?: boolean;
}

const getDiscountText = (bestDiscount: number): string => {
  const contents = strings.formatString(strings.OFF_PERCENT, bestDiscount);
  return Array.isArray(contents) ? contents.join(' + ') : contents;
};

const getBookNowButtonText = ({
  isV3Design,
  isSportsExperiment,
  isGpMotorTicketsMb,
  isSportsSubCategory,
}: {
  isV3Design: boolean;
  isSportsExperiment: boolean;
  isGpMotorTicketsMb: boolean;
  isSportsSubCategory: boolean;
}): string => {
  if (isV3Design) return strings.BOOK_NOW_CTA;
  if (isSportsExperiment) return strings.SELECT_SECTION;
  if (isGpMotorTicketsMb && isSportsSubCategory) return strings.BUY_TICKETS_CTA;
  return strings.CHECK_AVAIL;
};

const PricingBar: FC<PricingBarProps> = ({
  listingPrice,
  showScratchPrice,
  isCombo,
  mbTheme,
  sendBookNowEvent,
  handleShowComboPopup,
  isV3Design,
  isSportsExperiment,
  isGpMotorTicketsMb,
  isSportsSubCategory,
  productBookingUrl,
  showCustomProductCardCTA,
}) => {
  const pricingRef = useRef<HTMLDivElement | null>(null);
  const widthRef = useRef(null) as any;
  const [showContent, setShowContent] = useState(false);

  const { setPricingHeight, discountText, setDiscountText } = useProductCard();

  const bookNowText = showCustomProductCardCTA
    ? strings.CUSTOM_CTA_EXPERIMENT_TEXT
    : getBookNowButtonText({
        isV3Design,
        isSportsExperiment,
        isGpMotorTicketsMb,
        isSportsSubCategory,
      });

  useEffect(() => {
    if (listingPrice.bestDiscount > 0) {
      setDiscountText(getDiscountText(listingPrice.bestDiscount));
    }

    if (pricingRef.current) {
      setPricingHeight(pricingRef.current.clientHeight);
    }
  }, [
    listingPrice.bestDiscount,
    showScratchPrice,
    discountText,
    setDiscountText,
    setPricingHeight,
  ]);

  useEffect(() => {
    setShowContent(true);
  }, []);

  return (
    <PriceBar $showContent={showContent} ref={pricingRef} $hasSavings={false}>
      <PriceElements $hasSavings={false}>
        <ButtonWrapper ref={widthRef}>
          {!isCombo ? (
            <a
              target="_self"
              href={productBookingUrl}
              rel="nofollow noreferrer"
            >
              <BookNowCta
                clickHandler={() => {
                  sendBookNowEvent(PRODUCT_CARD_REVAMP.PLACEMENT.SWIPESHEET);
                }}
                isMobile={true}
                width={'100%'}
                mbTheme={mbTheme}
                isExperimentalCard={true}
                ctaText={bookNowText}
              />
            </a>
          ) : (
            <BookNowCta
              clickHandler={() =>
                handleShowComboPopup(PRODUCT_CARD_REVAMP.PLACEMENT.SWIPESHEET)
              }
              width={'100%'}
              isMobile={true}
              mbTheme={mbTheme}
              isExperimentalCard={true}
              ctaText={bookNowText}
            />
          )}
        </ButtonWrapper>
      </PriceElements>
    </PriceBar>
  );
};

export default React.memo(PricingBar);
