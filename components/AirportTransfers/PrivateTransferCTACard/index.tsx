import { useContext, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Button from '@headout/aer/src/atoms/Button';
import { TController } from 'components/Product/components/Popup/interface';
import { ModalCardContainer } from 'components/Product/styles';
import Image from 'UI/Image';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { useBookingURL } from 'hooks/useBookingURL';
import { useHistoryTraversal } from 'hooks/useHistoryTraversal';
import { legacyBooleanCheck } from 'utils';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import { metaAtom } from 'store/atoms/meta';
import { PRIVATE_AT_CTA_CARD_CAR_ILLUSTRATION_URL } from 'const/airportTransfers';
import { BOOKING_FLOW_TYPE } from 'const/booking';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BUTTON_LOADING_DURATION,
  SIDEBAR_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import {
  DoorOutlineSVG,
  ShieldOutlineSVG,
  ThumbsUpOutlineSVG,
} from 'assets/airportTransfers/ctaCardsSVGs';
import { ChevronNewSVG } from 'assets/airportTransfers/productCardSVGs';
import { TScorpioData, TTour } from '../interface';
import { Descriptor } from '../ProductCard/Descriptors';
import { MoreDetailsButton } from '../ProductCard/Descriptors/style';
import { MoreDetailsPopupContent } from '../ProductCard/MoreDetailsPopupContent';
import { MoreDetailsPopupDesktop } from '../ProductCard/MoreDetailsPopupDesktop';
import {
  CardContainer,
  StyledDescriptorsContainer,
  StyledPricingAndCTASection,
} from './style';

export const PrivateTransferCTACard = ({
  tour,
  scorpioData,
  isMobile,
  hasAirportTabs = false,
}: {
  tour: TTour;
  scorpioData: TScorpioData;
  isMobile: boolean;
  hasAirportTabs?: boolean;
}) => {
  const { listingPrice } = scorpioData;

  const {
    sidebarModal: { addToAside },
    mbTheme,
    lang,
    primaryCity,
  } = useContext(MBContext);

  const pageMetaData = useRecoilValue(metaAtom);

  const productBookingURL = useBookingURL({
    tourGroupId: tour.tgid,
    isMobile,
    flowType: BOOKING_FLOW_TYPE.PRIVATE_AIRPORT_TRANSFER,
  });

  const isScratchPriceEnabled = legacyBooleanCheck(tour.show_scratch_price);

  const popupController = useRef<TController>();

  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    if (isMobile) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), BUTTON_LOADING_DURATION);
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: 'Private Transfer Card',
      [ANALYTICS_PROPERTIES.LABEL]: 'Reserve your ride',
      [ANALYTICS_PROPERTIES.SECTION]: 'Private Transfer Card',
    });
  };
  useHistoryTraversal({
    action: () => {
      setIsLoading(false);
    },
  });

  const trackMoreDetailsClick = () => {
    const {
      primaryCategory,
      primaryCollection,
      primarySubCategory,
      reviewsDetails,
    } = scorpioData;

    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_MORE_DETAILS_VIEWED,
      [ANALYTICS_PROPERTIES.TGID]: tour.tgid,
      // @ts-ignore
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
      [ANALYTICS_PROPERTIES.PLACEMENT]: 'Private Transfer Card',
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
        reviewsDetails,
      }),
    });
  };

  const sendBookNowEvent = (placement?: string) => {
    const placementProperty = placement
      ? {
          [ANALYTICS_PROPERTIES.PLACEMENT]: placement,
        }
      : {};

    const { finalPrice, originalPrice, currencyCode } = listingPrice ?? {};

    const {
      primaryCategory,
      primaryCollection,
      primarySubCategory,
      reviewsDetails,
    } = scorpioData;

    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      [ANALYTICS_PROPERTIES.DISCOUNT]:
        isScratchPriceEnabled && originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
      [ANALYTICS_PROPERTIES.POSITION]: 1,
      ...placementProperty,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: null,
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: scorpioData.title,
      [ANALYTICS_PROPERTIES.TGID]: tour.tgid,
      [ANALYTICS_PROPERTIES.CITY]: (pageMetaData?.city as any)?.cityCode,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
        reviewsDetails,
      }),
    });
  };

  const onMoreDetailsClick = () => {
    trackMoreDetailsClick();

    if (!isMobile) {
      popupController.current?.open();
      return;
    }

    addToAside({
      width: '100vw',
      children: (
        <ModalCardContainer>
          <MoreDetailsPopupContent
            currentLanguage={lang}
            isMobile={isMobile}
            mbTheme={mbTheme ?? ''}
            scorpioData={scorpioData}
            tour={tour}
            showComboVariant={false}
            expandContent
            isInPopup={false}
            handleShowComboPopup={() => {}}
            handleCloseComboPopup={() => {}}
            productBookingURL={productBookingURL}
            sendBookNowEvent={sendBookNowEvent}
          />
        </ModalCardContainer>
      ),
      type: SIDEBAR_TYPES.PRODUCT_CARD,
      onCloseCallback: () => {
        //
      },
      tgid: tour.tgid,
      isProductCardTracking: true,
      history: {
        enable: true,
        params: {
          pid: tour.tgid,
          popup: 'details',
        },
      },
    });
  };

  return (
    <CardContainer $hasTabsAbove={hasAirportTabs}>
      <h3>{strings.AIRPORT_TRANSFER.YOUR_RIDE_DOORSTEP}</h3>

      <p>
        {strings.formatString(
          strings.AIRPORT_TRANSFER.COMFORTABLE_RIDE,
          primaryCity?.displayName ?? ''
        )}
      </p>

      <StyledDescriptorsContainer>
        <Descriptor
          icon={<ShieldOutlineSVG />}
          text={strings.AIRPORT_TRANSFER.TRUSTED_DRIVERS}
        />

        <Descriptor
          icon={<ThumbsUpOutlineSVG />}
          text={strings.AIRPORT_TRANSFER.RIDES_24_7}
        />

        <Descriptor
          icon={<DoorOutlineSVG />}
          text={strings.AIRPORT_TRANSFER.FLIGHT_TRACKING}
        />

        <MoreDetailsButton
          className="more-details-btn"
          onClick={onMoreDetailsClick}
        >
          {strings.AIRPORT_TRANSFER.KNOW_MORE}
          <ChevronNewSVG />
        </MoreDetailsButton>
      </StyledDescriptorsContainer>

      <div className="car-illustration">
        <Image
          url={PRIVATE_AT_CTA_CARD_CAR_ILLUSTRATION_URL}
          alt={'Private Transfer car illustration'}
          width={206}
          height={92}
        />
      </div>

      <StyledPricingAndCTASection>
        <PriceBlock
          isMobile
          showScratchPrice={isScratchPriceEnabled}
          listingPrice={listingPrice}
          lang={lang}
          showSavings
          id={tour.tgid}
          prefix
          newDiscountTagDesignProps
        />

        <a
          target={isMobile ? '_self' : '_blank'}
          href={productBookingURL}
          rel="nofollow noopener"
          className="booking-link"
        >
          <Button
            width={'100%'}
            size="medium"
            color="white"
            variant="primary"
            isLoading={isLoading}
            onClick={handleButtonClick}
            tabIndex={0}
            text={strings.AIRPORT_TRANSFER.RESERVE_YOUR_RIDE}
            iconPosition="back"
          />
        </a>
      </StyledPricingAndCTASection>

      <MoreDetailsPopupDesktop
        popupController={popupController}
        mbTheme={mbTheme ?? ''}
        tour={tour}
        PopupContent={MoreDetailsPopupContent}
        scorpioData={scorpioData}
        currentLanguage={lang}
        isMobile={isMobile}
        onShowComboPopup={() => {}}
        onCloseComboPopup={() => {}}
        showComboVariant={false}
        productBookingUrl={productBookingURL}
        sendBookNowEvent={sendBookNowEvent}
      />
    </CardContainer>
  );
};
