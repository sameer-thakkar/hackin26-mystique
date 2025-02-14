import { useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Button, Text } from '@headout/eevee';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import HorizontalProductCard from 'components/MicrositeV2/EntertainmentMBLandingPageV2/ProductCards/HorizontalProductCard';
import { TShowPagePricingSectionProps } from 'components/MicrositeV2/ShowPageV2/ShowPagePricingSection/interface';
import {
  BuyButtonWrapper,
  Pricing,
  PricingSection,
  SavePercentElement,
  ShowPageDateSelectorWrapper,
} from 'components/MicrositeV2/ShowPageV2/ShowPagePricingSection/style';
import { getUnavailableTicketStylesRecipe } from 'components/MicrositeV2/ShowPageV2/ShowPagePricingSection/ticketUnavailableStyles';
import LocalisedPrice from 'UI/LPrice';
import { MBContext } from 'contexts/MBContext';
import { useHistoryTraversal } from 'hooks/useHistoryTraversal';
import { createBookingURL, getNakedDomain, getTagPageMap } from 'utils';
import { trackEvent } from 'utils/analytics';
import { getHostName } from 'utils/helper';
import { currencyAtom } from 'store/atoms/currency';
import { hsidAtom } from 'store/atoms/hsid';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BUTTON_LOADING_DURATION,
  CASHBACK_TYPES,
  CTA_TYPE,
} from 'const/index';
import { strings } from 'const/strings';
import BanSvg from 'assets/banSvg';
import VerticalProductImagePlaceholder from 'assets/verticalProductImagePlaceholder';
import RiveShowPageCTA from './RiveCTA';

const ShowPagePricingSection = ({
  tourGroupData,
  flowType,
  moreShows,
  primarySubCategory,
}: TShowPagePricingSectionProps) => {
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [isSkeletonVisible, setIsSkeletonVisible] = useState(true);
  const [horProductCardLoadedCount, setHorProductCardLoadedCount] = useState(0);

  const handleChildLoaded = () => {
    setHorProductCardLoadedCount((prevCount) => prevCount + 1);
  };

  const totalChildren = 2;

  useEffect(() => {
    if (horProductCardLoadedCount === totalChildren) {
      setIsSkeletonVisible(false);
    }
  }, [horProductCardLoadedCount, totalChildren]);

  const currency = useRecoilValue(currencyAtom);

  const {
    lang,
    isDev,
    host,
    nakedDomain,
    biLink,
    redirectToHeadoutBookingFlow,
    uid,
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

  const {
    TicketsUnavailableSection,
    TicketsUnavailableHeaderDweb,
    TicketsUnavailableTextWrapper,
    SvgWrapper,
    AlternativeShowRecommendationSection,
    TicketsUnavailableText,
    TicketsUnavailableSubText,
    MustSeeHeading,
    MoreShowsButtonWrapper,
    TicketsUnavailableHeaderCommon,
    ticketUnavailableDummyCard,
    ticketUnavailableDummyText,
    ticketUnavailableDummyHeading,
    ticketUnavailableDummyPrice,
  } = getUnavailableTicketStylesRecipe();

  useEffect(() => {
    setButtonLoading(false);
  }, []);

  const hsid = useRecoilValue(hsidAtom);

  const bookingUrl = createBookingURL({
    nakedDomain: nakedDomain || getNakedDomain(hostname),
    lang,
    tgid,
    biLink: biLink,
    redirectToHeadoutBookingFlow,
    currency,
    flowType,
    hsid,
  });

  useHistoryTraversal({
    action: () => {
      setButtonLoading(false);
    },
  });

  const LTT_TAG_PAGE_MAP = getTagPageMap(uid);
  const moreShowsCategoryUrl = LTT_TAG_PAGE_MAP[primarySubCategory?.name];

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

  const handleMoreShowsCTAClicked = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.SEE_MORE_SHOWS,
      [ANALYTICS_PROPERTIES.SECTION]: 'Tickets Unavailable',
    });

    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), BUTTON_LOADING_DURATION);
  };

  const buyButtonText = strings.CHECK_AVAIL;

  const buttonType = isButtonLoading ? 'loading' : 'default';

  return (
    <>
      <ShowPageDateSelectorWrapper>
        <Conditional if={listingPrice}>
          <PricingSection>
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
            <BuyButtonWrapper>
              <Button
                tabIndex={0}
                as="button"
                btnType="primary"
                onClick={onCheckAvailabilityClicked}
                primaryText={buyButtonText}
                size="medium"
                state={buttonType}
                variant="primary"
              />
              <RiveShowPageCTA
                onClick={onCheckAvailabilityClicked}
                primaryText={buyButtonText}
                tgid={tgid}
                primarySubCatId={primarySubCategory?.id}
              />
            </BuyButtonWrapper>
          </PricingSection>
        </Conditional>
        <Conditional if={!listingPrice}>
          <div className={TicketsUnavailableSection}>
            <div
              className={cx(
                TicketsUnavailableHeaderDweb,
                TicketsUnavailableHeaderCommon
              )}
            >
              <div className={SvgWrapper}>
                <BanSvg />
              </div>
              <div className={TicketsUnavailableTextWrapper}>
                <Text className={TicketsUnavailableText}>
                  {strings.SHOW_PAGE_V2.TICKETS_UNAVAILABLE}
                </Text>
                <Text className={TicketsUnavailableSubText}>
                  {strings.SHOW_PAGE_V2.TICKETS_UNAVAILABLE_SUBTEXT}
                </Text>
              </div>
            </div>
            <div className={AlternativeShowRecommendationSection}>
              <Text className={MustSeeHeading}>
                {strings.SHOW_PAGE_V2.MUST_SEE_SHOWS}
              </Text>
              {moreShows?.map((show: Record<string, any>) => {
                return (
                  <HorizontalProductCard
                    key={show.id}
                    product={{ ...show, title: show.name }}
                    background="LIGHT"
                    isTopShowsSection={false}
                    handleChildLoaded={handleChildLoaded}
                  />
                );
              })}
              <Conditional if={isSkeletonVisible}>
                {Array.from({ length: totalChildren }, (_, index) => (
                  <div
                    className={ticketUnavailableDummyCard}
                    key={`image-placeholder-${index}`}
                  >
                    <VerticalProductImagePlaceholder
                      $width={88}
                      $height={131}
                    />
                    <div className={ticketUnavailableDummyText}>
                      <div className={ticketUnavailableDummyHeading}></div>
                      <div className={ticketUnavailableDummyPrice}></div>
                    </div>
                  </div>
                ))}
              </Conditional>
              <div className={MoreShowsButtonWrapper}>
                <Button
                  as="anchor"
                  target="_blank"
                  href={moreShowsCategoryUrl}
                  btnType="black"
                  onClick={handleMoreShowsCTAClicked}
                  primaryText={strings.SHOW_PAGE_V2.SEE_ALL_SHOWS}
                  state={'default'}
                  size="medium"
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        </Conditional>
      </ShowPageDateSelectorWrapper>
    </>
  );
};

export default ShowPagePricingSection;
