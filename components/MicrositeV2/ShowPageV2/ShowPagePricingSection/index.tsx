import { useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Button from '@headout/aer/src/atoms/Button';
import Conditional from 'components/common/Conditional';
import { TShowPagePricingSectionProps } from 'components/MicrositeV2/ShowPageV2/ShowPagePricingSection/interface';
import {
  BuyButtonWrapper,
  Pricing,
  PricingSection,
  SavePercentElement,
  ShowPageDateSelectorWrapper,
} from 'components/MicrositeV2/ShowPageV2/ShowPagePricingSection/style';
import LocalisedPrice from 'UI/LPrice';
import { MBContext } from 'contexts/MBContext';
import { useHistoryTraversal } from 'hooks/useHistoryTraversal';
import { createBookingURL, getNakedDomain } from 'utils';
import { trackEvent } from 'utils/analytics';
import { getHostName } from 'utils/helper';
import { currencyAtom } from 'store/atoms/currency';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BUTTON_LOADING_DURATION,
  CASHBACK_TYPES,
  CTA_TYPE,
} from 'const/index';
import { strings } from 'const/strings';

const ShowPagePricingSection = ({
  tourGroupData,
  flowType,
  showCustomBookButtonText,
  shouldRunCustomCTAExperiment,
}: TShowPagePricingSectionProps) => {
  const [isButtonLoading, setButtonLoading] = useState(false);

  const currency = useRecoilValue(currencyAtom);

  const {
    lang,
    isDev,
    host,
    nakedDomain,
    biLink,
    redirectToHeadoutBookingFlow,
  } = useContext(MBContext);

  const { id: tgid, listingPrice } = tourGroupData;
  const {
    originalPrice,
    finalPrice,
    cashbackValue,
    cashbackType,
    currencyCode,
  } = listingPrice ?? {};

  const totalDiscount = Number(
    (((originalPrice - finalPrice) / originalPrice) * 100).toFixed(2)
  );
  const showCashbackElement =
    cashbackValue > 0 && cashbackType === CASHBACK_TYPES.PERCENTAGE;

  const hostname = getHostName(isDev, host);

  useEffect(() => {
    setButtonLoading(false);
  }, []);

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain || getNakedDomain(hostname),
    lang,
    tgid,
    biLink: biLink,
    redirectToHeadoutBookingFlow,
    currency,
    flowType,
    showCustomCheckoutCTA: shouldRunCustomCTAExperiment
      ? showCustomBookButtonText
      : undefined,
  });

  useHistoryTraversal({
    action: () => {
      setButtonLoading(false);
    },
  });

  const onCheckAvailabilityClicked = () => {
    const hasDiscountElement = totalDiscount > 0 || showCashbackElement;

    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.DISCOUNT]: originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currency,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: hasDiscountElement
        ? CTA_TYPE.BIG_CTA
        : CTA_TYPE.SMALL_CTA,
    });

    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), BUTTON_LOADING_DURATION);
    window.open(bookingUrl, '_self', 'noopener');
  };

  return (
    <>
      <ShowPageDateSelectorWrapper>
        <PricingSection>
          <Conditional if={listingPrice}>
            <Pricing>
              <div className="pricing">
                <div className="scratch-price">
                  <span className="price-starting-from">
                    {strings.FROM?.toLowerCase()}{' '}
                  </span>
                  <Conditional if={originalPrice > finalPrice}>
                    <LocalisedPrice
                      currencyCode={currencyCode ?? currency ?? ''}
                      lang={lang}
                      price={originalPrice}
                      className="original-price"
                      truncateIfLong={true}
                      truncateAfter={3}
                    />
                  </Conditional>
                </div>
                <div className="price">
                  <LocalisedPrice
                    currencyCode={currencyCode ?? currency ?? ''}
                    lang={lang}
                    price={finalPrice}
                    truncateIfLong={true}
                    truncateAfter={3}
                  />
                  <Conditional if={totalDiscount > 0}>
                    <SavePercentElement>
                      {strings.formatString(
                        strings.SAVE_UPTO_PERCENT,
                        `${totalDiscount}`
                      )}
                    </SavePercentElement>
                  </Conditional>

                  <Conditional if={totalDiscount <= 0 && showCashbackElement}>
                    <SavePercentElement>
                      {strings.formatString(
                        strings.CASHBACK,
                        `${cashbackValue}`
                      )}
                    </SavePercentElement>
                  </Conditional>
                </div>
              </div>
            </Pricing>
          </Conditional>
          <BuyButtonWrapper>
            <Button
              tabIndex={0}
              size="medium"
              color="purps"
              variant="primary"
              isLoading={isButtonLoading}
              onClick={onCheckAvailabilityClicked}
              text={
                showCustomBookButtonText
                  ? strings.CUSTOM_CTA_EXPERIMENT_TEXT
                  : strings.CHECK_AVAIL
              }
              disabled={!listingPrice}
            />
          </BuyButtonWrapper>
        </PricingSection>
      </ShowPageDateSelectorWrapper>
    </>
  );
};

export default ShowPagePricingSection;
