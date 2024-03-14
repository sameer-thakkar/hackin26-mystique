import React, { FC, useEffect, useRef, useState } from 'react';
import Emoji from 'components/common/Emoji';
import { BookNowCta } from 'components/Product/components/BookNowCta';
import LocalisedPrice from 'UI/LPrice';
import { useProductCard } from 'contexts/productCardContext';
import { PRODUCT_CARD_REVAMP } from 'const/index';
import { strings } from 'const/strings';
import {
  ButtonWrapper,
  PriceBar,
  PriceElements,
  SavingsContainer,
  TourScratchPrice,
} from './styles';

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
  lang,
  showScratchPrice,
  isCombo,
  mbTheme,
  isAsideBarOverlay,
  sendBookNowEvent,
  handleShowComboPopup,
  isV3Design,
  isSportsExperiment,
  isGpMotorTicketsMb,
  isSportsSubCategory,
  productBookingUrl,
}) => {
  const [hasSavings, setSavings] = useState<boolean>(false);
  const pricingRef = useRef<HTMLDivElement | null>(null);
  const widthRef = useRef(null) as any;
  const [buttonWidth, setButtonWidth] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const { setPricingHeight, discountText, setDiscountText } = useProductCard();

  useEffect(() => {
    if (!widthRef.current) return;
    setButtonWidth(widthRef.current.clientWidth);
  }, [widthRef]);

  const bookNowText = getBookNowButtonText({
    isV3Design,
    isSportsExperiment,
    isGpMotorTicketsMb,
    isSportsSubCategory,
  });

  useEffect(() => {
    if (listingPrice.bestDiscount > 0) {
      setDiscountText(getDiscountText(listingPrice.bestDiscount));
    }

    setSavings(showScratchPrice && !!discountText.length);

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
    <PriceBar
      $showContent={showContent}
      ref={pricingRef}
      $hasSavings={hasSavings}
    >
      {showScratchPrice && !!discountText.length && (
        <SavingsContainer $hasSavings={hasSavings}>
          <Emoji symbol="🤑" label="savings" />
          <p>Save upto {discountText}</p>
        </SavingsContainer>
      )}
      <PriceElements $hasSavings={hasSavings}>
        <div>
          <TourScratchPrice>
            {listingPrice.otherPricesExist && `${strings.FROM.toLowerCase()} `}
            {showScratchPrice &&
              listingPrice.originalPrice > listingPrice.finalPrice && (
                <LocalisedPrice
                  className="strike"
                  currencyCode={listingPrice.currencyCode}
                  lang={lang}
                  price={listingPrice.originalPrice}
                />
              )}
          </TourScratchPrice>
          <LocalisedPrice
            className="tour-price"
            currencyCode={listingPrice.currencyCode}
            lang={lang}
            price={listingPrice.finalPrice}
          />
        </div>
        <ButtonWrapper $width={buttonWidth} ref={widthRef}>
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
                handleShowComboPopup(
                  isAsideBarOverlay
                    ? PRODUCT_CARD_REVAMP.PLACEMENT.SIDE_SHEET
                    : PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD
                )
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
