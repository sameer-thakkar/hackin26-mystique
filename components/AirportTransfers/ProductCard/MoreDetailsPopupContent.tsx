import { asText } from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
import Conditional from 'components/common/Conditional';
import { BookNowCta } from 'components/Product/components/BookNowCta';
import Category from 'components/Product/components/Category';
import { NextAvailable } from 'components/Product/components/NextAvailable';
import ReviewSection from 'components/Product/components/Popup/ReviewSection';
import { ProductDescriptors } from 'components/Product/components/ProductDescriptors';
import Ratings from 'components/Product/components/Ratings';
import { TourTitle } from 'components/Product/components/TourTitle';
import {
  CategoryAndRatingContainer,
  CTABlock,
  CTAContainer,
  PriceContainer,
  PRODUCT_CARD_IMAGE_DIMENSIONS,
  ProductBody,
  ProductHeader,
  StyledProductCard,
} from 'components/Product/styles';
import HorizontalLine from 'components/slices/HorizontalLine';
import ComboPopup from 'UI/ComboPopup';
import MediaCarousel from 'UI/MediaCarousel';
import PriceBlock from 'UI/PriceBlock';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import {
  extractTabsFromHighlights,
  filterFromHighlights,
  getProductCardLayout,
} from 'utils/productUtils';
import { shortCodeSerializer } from 'utils/shortCodes';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  MEDIA_CAROUSEL_IMAGE_LIMIT,
  PRODUCT_CARD_REVAMP,
  THEMES,
} from 'const/index';
import { strings } from 'const/strings';
import { TMoreDetailsPopupContentProps } from './interface';

export const MoreDetailsPopupContent = ({
  scorpioData,
  tour,
  currentLanguage,
  isMobile,
  mbTheme,
  showComboVariant,
  expandContent,
  isInPopup,
  desktopPopupController,
  desktopPopupScrollHandler,
  handleShowComboPopup,
  handleCloseComboPopup,
  sendBookNowEvent,
  productBookingURL,
}: TMoreDetailsPopupContentProps) => {
  const { images, listingPrice, minDuration, maxDuration } = scorpioData;

  const tempHighlights = tour.marketing_highlights_override ?? '';

  const finalHighlights: any = asText(tempHighlights as any)?.trim()?.length
    ? tempHighlights
    : filterFromHighlights(scorpioData.highlights);

  const { highlights } = isMobile
    ? { highlights: finalHighlights }
    : extractTabsFromHighlights(finalHighlights);

  const hasHighlights =
    finalHighlights?.length &&
    finalHighlights.filter((item: any) => item.text).length;

  return (
    <>
      <StyledProductCard
        layout={getProductCardLayout({
          hasOffer: false,
          hasV1Booster: false,
          mbTheme,
          isTicketCard: false,
          hasPromoCode: undefined,
          isOpenDated: false,
          showAvailabilityInTitle: false,
          isPoiMwebCard: true,
        })}
        isContentExpanded={true}
        isMobile={isMobile}
        $isSwipeSheetOpen={true}
        className="product-card"
        collapsed={false}
        $isPoiMwebCard={true}
        $isPopup={isInPopup}
        isTicketCard={false}
      >
        <Conditional if={images?.length && !isInPopup}>
          <div className="card-img">
            <MediaCarousel
              imageList={images?.slice(0, MEDIA_CAROUSEL_IMAGE_LIMIT)}
              imageId="card-img"
              imageAspectRatio={'16:10'}
              backgroundColor={COLORS.GRAY.G7}
              imageWidth={PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.width}
              imageHeight={PRODUCT_CARD_IMAGE_DIMENSIONS.DESKTOP.height}
              isFirstProduct={false}
              tgid={String(tour.tgid)}
              isMobile={isMobile}
              showOverlay
            />
          </div>
        </Conditional>

        <ProductHeader>
          <CategoryAndRatingContainer>
            <Category
              primaryCategory={scorpioData.primaryCategory}
              primarySubCategory={scorpioData.primarySubCategory}
            />
            <Ratings
              reviewsDetails={scorpioData.reviewsDetails}
              onRatingsCountClick={
                scorpioData.reviewsDetails
                  ? () => {
                      trackEvent({
                        eventName:
                          ANALYTICS_EVENTS.NEWS_PAGE.RATINGS_WIDGET_CLICKED,
                        [ANALYTICS_PROPERTIES.PLACEMENT]: isInPopup
                          ? PRODUCT_CARD_REVAMP.PLACEMENT.MORE_DETAILS
                          : PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD,
                        ...getProductCommonProperties({
                          reviewsDetails: scorpioData.reviewsDetails,
                        }),
                      });
                      if (!isInPopup) {
                        desktopPopupController?.current?.open();
                      }
                      desktopPopupScrollHandler?.(0, true);
                    }
                  : undefined
              }
            />
          </CategoryAndRatingContainer>

          <TourTitle
            boosterTag={!!tour.tag_booster}
            cardTitle={tour.tour_title_override || scorpioData.title}
            isContentOpen={false}
            isLoading={false}
            isMobile={isMobile}
            isOpenDated={false}
            isTicketCard={false}
            mbTheme={mbTheme}
            pageType={''}
            tabs={[]}
            earliestAvailability={tour.earliestAvailability}
            currentLanguage={currentLanguage}
          />

          <Conditional if={!isInPopup}>
            <CTAContainer>
              <PriceContainer>
                <PriceBlock
                  isMobile={isMobile}
                  isLoading={false}
                  isSportsExperiment={false}
                  showScratchPrice={true}
                  listingPrice={listingPrice}
                  lang={currentLanguage}
                  showSavings
                  id={tour.tgid}
                  prefix
                  key={'price-block'}
                  wrapperRef={null}
                  newDiscountTagDesignProps={true}
                />
              </PriceContainer>

              <CTABlock
                isSticky={expandContent}
                shouldOffset={
                  tour.earliestAvailability && mbTheme === THEMES.MIN_BLUE
                }
                isTicketCard={false}
              >
                <Conditional if={!scorpioData.combo}>
                  <a
                    target={isMobile ? '_self' : '_blank'}
                    href={productBookingURL}
                  >
                    <BookNowCta
                      clickHandler={() =>
                        sendBookNowEvent(
                          expandContent
                            ? PRODUCT_CARD_REVAMP.PLACEMENT.SWIPESHEET
                            : PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD
                        )
                      }
                      isMobile={isMobile}
                      mbTheme={mbTheme}
                      ctaText={strings.CHECK_AVAIL}
                    />
                  </a>
                </Conditional>
                <Conditional if={scorpioData.combo}>
                  <BookNowCta
                    showLoadingState={false}
                    clickHandler={() =>
                      handleShowComboPopup(
                        PRODUCT_CARD_REVAMP.PLACEMENT.SWIPESHEET
                      )
                    }
                    isMobile={isMobile}
                    mbTheme={mbTheme}
                    ctaText={strings.CHECK_AVAIL}
                  />
                </Conditional>
              </CTABlock>

              <NextAvailable
                showSkeleton={false}
                earliestAvailability={tour.earliestAvailability}
                currentLanguage={currentLanguage}
                className="next-available-text"
              />

              <Conditional if={!isInPopup}>
                <ProductDescriptors
                  isLoading={false}
                  descriptorArray={scorpioData.descriptors}
                  pageType={''}
                  minDuration={minDuration}
                  maxDuration={maxDuration}
                  lang={currentLanguage}
                  isCombo={scorpioData.combo}
                  horizontal={true}
                  showIcons={false}
                  cancellationPolicyHoverCallBack={() => {}}
                  isMobile={isMobile}
                />
              </Conditional>
            </CTAContainer>
          </Conditional>
        </ProductHeader>
        <Conditional if={!isMobile && !isInPopup}>
          <HorizontalLine colorProp={COLORS.GRAY.G6} />
        </Conditional>
        <ProductBody
          hasReadMore={false}
          collapsed={!expandContent}
          defaultOpen={false}
          maxHeight={265}
          ref={null}
        >
          <div className={'tour-description'}>
            <Conditional if={hasHighlights || isInPopup}>
              <PrismicRichText
                field={isInPopup ? finalHighlights : highlights || []}
                components={shortCodeSerializer}
              />
            </Conditional>

            <Conditional if={isInPopup && scorpioData.reviewsDetails}>
              <ReviewSection
                reviewsDetails={
                  scorpioData.reviewsDetails as Record<string, any>
                }
                tgid={tour.tgid}
                topReviews={scorpioData.topReviews}
              />
            </Conditional>
          </div>
        </ProductBody>
      </StyledProductCard>
      <Conditional
        if={
          !isMobile &&
          scorpioData.combo &&
          scorpioData.multiVariant &&
          showComboVariant &&
          !isInPopup
        }
      >
        <ComboPopup
          productTitle={scorpioData.title}
          l1Booster={tour.tag_booster ?? ''}
          tgid={tour.tgid}
          isMobile={isMobile}
          closeHandler={handleCloseComboPopup}
          descriptors={scorpioData.descriptors}
          bookingUrl={productBookingURL}
          minDuration={minDuration}
          maxDuration={maxDuration}
        />
      </Conditional>
    </>
  );
};
