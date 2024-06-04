import { useContext, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import { BookNowCta } from 'components/Product/components/BookNowCta';
import { NextAvailable } from 'components/Product/components/NextAvailable';
import { TController } from 'components/Product/components/Popup/interface';
import {
  ModalCardContainer,
  PRODUCT_CARD_IMAGE_DIMENSIONS,
} from 'components/Product/styles';
import ComboPopup from 'UI/ComboPopup';
import MediaCarousel from 'UI/MediaCarousel';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { useBookingURL } from 'hooks/useBookingURL';
import { legacyBooleanCheck } from 'utils';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { getHostName } from 'utils/helper';
import { addQueryParams } from 'utils/urlUtils';
import { metaAtom } from 'store/atoms/meta';
import { BOOKING_FLOW_TYPE } from 'const/booking';
import COLORS from 'const/colors';
import { StarIcon } from 'const/descriptorIcons';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  MEDIA_CAROUSEL_IMAGE_LIMIT,
  PRODUCT_CARD_REVAMP,
  SIDEBAR_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import { Descriptors } from './Descriptors';
import { TProductCardProps } from './interface';
import { MoreDetailsPopupContent } from './MoreDetailsPopupContent';
import { MoreDetailsPopupDesktop } from './MoreDetailsPopupDesktop';
import {
  PricingAndCTASection,
  ProductCardContainer,
  ProductCardContentContainer,
  RatingsContainer,
  StyledProductTitle,
  VeritcalDashedSeparator,
} from './style';

export const ProductCard = ({
  scorpioData,
  tour,
  isMobile,
  extraQueryParamsForBookingURL,
  position,
}: TProductCardProps) => {
  const {
    combo: isCombo,
    title,
    multiVariant: isMultiVariant,

    averageRating,
    ratingCount,
    images,
    listingPrice,
    minDuration,
    maxDuration,
    primaryCategory,
    primaryCollection,
    primarySubCategory,
    reviewsDetails,
  } = scorpioData || {};

  const showRating = averageRating > 0;

  const {
    mbTheme,
    lang,
    sidebarModal: { addToAside },
    isStage,
    isDev,
    host,
  } = useContext(MBContext);

  const pageMetaData = useRecoilValue(metaAtom);

  const popupController = useRef<TController>();

  const productBookingUrl =
    useBookingURL({
      flowType: tour.flowType,
      isMobile,
      tourGroupId: tour.tgid,
      ctaSuffix: tour.cta_url_suffix ?? '',
      tourId: listingPrice.tourId,
    }) +
    `${
      extraQueryParamsForBookingURL ? `&${extraQueryParamsForBookingURL}` : ''
    }`;

  const [showComboVariant, setShowComboVariant] = useState(false);

  const isComboWithSingleVariant = isCombo && !isMultiVariant;
  const isComboWithMultiVariant = isCombo && isMultiVariant;

  const hostname = getHostName(isStage, isDev, host);
  const tourGroupEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupsV6,
    id: tour.tgid,
    hostname,
    params: {
      ...(lang && {
        language: lang,
      }),
    },
  });

  const { data: tourGroupData } = useSWR(
    isComboWithSingleVariant ? tourGroupEndpoint : null,
    { fetcher: swrFetcher }
  );

  const onMoreDetailsClick = () => {
    if (!isMobile) {
      popupController.current?.open();

      trackMoreDetailsClick();

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
            showComboVariant={showComboVariant}
            expandContent
            isInPopup={false}
            handleShowComboPopup={handleShowComboPopup}
            handleCloseComboPopup={handleCloseComboPopup}
            productBookingURL={productBookingUrl}
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

    trackMoreDetailsClick();
  };

  const sendBookNowEvent = (placement?: string) => {
    const placementProperty = placement
      ? {
          [ANALYTICS_PROPERTIES.PLACEMENT]: placement,
        }
      : {};

    const { finalPrice, originalPrice, currencyCode } = listingPrice ?? {};

    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      [ANALYTICS_PROPERTIES.DISCOUNT]:
        isScratchPriceEnabled && originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
      [ANALYTICS_PROPERTIES.POSITION]: position,
      ...placementProperty,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: null,
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: title,
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

  const handleShowComboPopup = (placement?: string) => {
    const { variants } = tourGroupData || {};
    sendBookNowEvent(placement);

    if (tourGroupData && isComboWithSingleVariant) {
      if (typeof window !== 'undefined') {
        const { id: variantId } = variants[0];
        trackEvent({
          eventName: ANALYTICS_EVENTS.COMBO_VARIANT.VARIANT_CLICKED,
          'MB name': hostname,
          'Variant ID': variantId,
          TGID: tour.tgid,
          Device: isMobile ? 'Mweb' : 'Desktop',
          ...getProductCommonProperties({
            primaryCategory,
            primaryCollection,
            primarySubCategory,
          }),
        });
        window.open(
          addQueryParams(productBookingUrl, {
            variantId,
          }),
          '_blank',
          'noopener'
        );
        return;
      }
    }

    setShowComboVariant(true);

    if (!isMobile) {
      document.body.style.overflow = 'hidden';
    }

    if (isMobile && isComboWithMultiVariant) {
      addToAside({
        width: '100vw',
        children: (
          <ComboPopup
            productTitle={title}
            l1Booster={tour.tag_booster ?? ''}
            tgid={tour.tgid}
            isMobile={isMobile}
            closeHandler={handleCloseComboPopup}
            descriptors={scorpioData.descriptors}
            bookingUrl={productBookingUrl}
            minDuration={minDuration}
            maxDuration={maxDuration}
          />
        ),
        type: SIDEBAR_TYPES.COMBO_VARIANT,
        onCloseCallback: () => handleCloseComboPopup(),
        history: {
          enable: true,
          params: {
            pid: tour.tgid,
            popup: 'combo',
          },
        },
      });
    }
  };

  const handleCloseComboPopup = () => {
    setShowComboVariant(false);
    if (!isMobile) {
      document.body.style.overflow = 'auto';
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.COMBO_VARIANT.POPUP_CLOSED,
      [ANALYTICS_PROPERTIES.MB_NAME]: hostname,
      [ANALYTICS_PROPERTIES.TGID]: tour.tgid,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: '',
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  };

  const trackMoreDetailsClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_MORE_DETAILS_VIEWED,
      [ANALYTICS_PROPERTIES.TGID]: tour.tgid,
      // @ts-ignore
      [ANALYTICS_PROPERTIES.POSITION]: position,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
      [ANALYTICS_PROPERTIES.PLACEMENT]:
        tour.flowType === BOOKING_FLOW_TYPE.PRIVATE_AIRPORT_TRANSFER
          ? 'Private Transfer Card'
          : 'Product Card',
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
        reviewsDetails,
      }),
    });
  };

  const isScratchPriceEnabled = legacyBooleanCheck(tour.show_scratch_price);

  return (
    <ProductCardContainer>
      <div className="card-images-carousel">
        <MediaCarousel
          imageList={images?.slice(0, MEDIA_CAROUSEL_IMAGE_LIMIT)}
          imageId="card-img"
          imageAspectRatio={'16:10'}
          backgroundColor={COLORS.GRAY.G7}
          imageWidth={
            isMobile ? PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.width : undefined
          }
          imageHeight={PRODUCT_CARD_IMAGE_DIMENSIONS.DESKTOP.height}
          isFirstProduct={false}
          tgid={String(tour.tgid)}
          isMobile={isMobile}
          showOverlay
        />
      </div>

      <ProductCardContentContainer>
        <div>
          <Conditional if={showRating}>
            <RatingsContainer>
              <StarIcon className="star-icon" />
              <span className="rating">{averageRating}</span>
              <span className="ratings-count">({ratingCount})</span>
            </RatingsContainer>
          </Conditional>

          <StyledProductTitle>{title}</StyledProductTitle>
        </div>

        <Conditional if={isMobile}>
          <NextAvailable
            showSkeleton={false}
            earliestAvailability={tour.earliestAvailability}
            currentLanguage={lang}
            className="next-available-text"
          />
        </Conditional>

        <Descriptors
          scorpioData={scorpioData}
          onMoreDetailsClick={onMoreDetailsClick}
          tourDescriptionOverride={tour.tour_description_override ?? []}
          tgid={tour.tgid}
          isMobile={isMobile}
          isScratchPriceEnabled={isScratchPriceEnabled}
          lang={lang}
          position={position ?? 0}
        />
      </ProductCardContentContainer>

      <VeritcalDashedSeparator />

      <PricingAndCTASection>
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
        {!isCombo ? (
          <a
            target={isMobile ? '_self' : '_blank'}
            href={productBookingUrl}
            rel="nofollow noopener"
            className="booking-link"
          >
            <BookNowCta
              clickHandler={() =>
                sendBookNowEvent(PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD)
              }
              isMobile={isMobile}
              mbTheme={mbTheme ?? ''}
              ctaText={strings.CHECK_AVAIL}
              width="100%"
            />
          </a>
        ) : (
          <BookNowCta
            showLoadingState={false}
            clickHandler={() => {
              handleShowComboPopup(PRODUCT_CARD_REVAMP.PLACEMENT.SWIPESHEET);
            }}
            isMobile={isMobile}
            mbTheme={mbTheme ?? ''}
            ctaText={strings.CHECK_AVAIL}
            width="100%"
          />
        )}
      </PricingAndCTASection>

      <MoreDetailsPopupDesktop
        popupController={popupController}
        mbTheme={mbTheme ?? ''}
        tour={tour}
        PopupContent={MoreDetailsPopupContent}
        scorpioData={scorpioData}
        currentLanguage={lang}
        isMobile={isMobile}
        onShowComboPopup={handleShowComboPopup}
        onCloseComboPopup={handleCloseComboPopup}
        showComboVariant={showComboVariant}
        productBookingUrl={productBookingUrl}
        sendBookNowEvent={sendBookNowEvent}
      />

      <Conditional
        if={!isMobile && isComboWithMultiVariant && showComboVariant}
      >
        <ComboPopup
          productTitle={scorpioData.title}
          l1Booster={tour.tag_booster ?? ''}
          tgid={tour.tgid}
          isMobile={isMobile}
          closeHandler={() => {
            handleCloseComboPopup();
          }}
          descriptors={scorpioData.descriptors}
          bookingUrl={productBookingUrl}
          minDuration={minDuration}
          maxDuration={maxDuration}
        />
      </Conditional>
    </ProductCardContainer>
  );
};
