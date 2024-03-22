import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { PrismicRichText } from '@prismicio/react';
import Conditional from 'components/common/Conditional';
import Emoji from 'components/common/Emoji';
import Category from 'components/Product/components/Category';
import { GuidesBanner } from 'components/Product/components/GuidesBanner';
import { NextAvailable } from 'components/Product/components/NextAvailable';
import { ProductDescriptors } from 'components/Product/components/ProductDescriptors';
import Ratings from 'components/Product/components/Ratings';
import { TourTitle } from 'components/Product/components/TourTitle';
import { BoosterType } from 'components/Product/interface';
import {
  CategoryAndRatingContainer,
  CTAContainer,
  GuidedTourLabel,
  OpenDatedDescriptor,
  PriceContainer,
  ProductHeader,
  ProductOfferBlock,
  StyledProductCard,
  TourAvailableInLanguages,
  V1BoosterBlock,
} from 'components/Product/styles';
import MediaCarousel from 'UI/MediaCarousel';
import PriceBlock from 'UI/PriceBlock';
import PromoCodeBlock from 'UI/PromoCodeBlock';
import { useProductCard } from 'contexts/productCardContext';
import { shortCodeSerializer } from 'utils/shortCodes';
import COLORS from 'const/colors';
import {
  MEDIA_CAROUSEL_IMAGE_LIMIT,
  PRODUCT_CARD_REVAMP,
  THEMES,
} from 'const/index';
import { SWIPESHEET_STATES } from 'const/productCard';
import { strings } from 'const/strings';
import GuidedTourLabelBackground from 'assets/guidedtourlabelbackground';
import { ScaledCard } from './styles';

const Booster = dynamic(
  import(
    /* webpackChunkName: "Booster" */ 'components/Product/components/Booster'
  )
);

const MobileProductCard = (props: any) => {
  const {
    layout,
    isTicketCard,
    isBannerCard,
    isSpecialGuidedTour,
    isV3Design,
    isModifiedProductCard,
    expandContent,
    hasOffer,
    images,
    isGuidedTour,
    bannerVideo,
    mediaCarouselImageWidth,
    mediaCarouselImageHeight,
    tgid,
    isFirstProduct,
    shouldCropImage,
    scorpioData,
    primaryCategory,
    primarySubCategory,
    reviewsDetails,
    boosterTag,
    cardTitle,
    hasBorderedTitle,
    isContentOpen,
    isOpenDated,
    mbTheme,
    pageType,
    showAvailabilityInTitleMobile,
    earliestAvailability,
    currentLanguage,
    showNextAvailable,
    showEarliestAvailability,
    isAsideBarOverlay,
    descriptorsList,
    isCombo,
    isGpMotorTicketsMb,
    minDuration,
    maxDuration,
    boosterHasIcon,
    booster,
    hasV1Booster,
    productOffer,
    offerId,
    handlePopup,
    isSportsExperiment,
    showScratchPrice,
    finalListingPrice,
    priceBlockWrapperRef,
    promo_code,
    uid,
    cancellationPolicy,
    trackCancellationPolicyHover,
    isDrawer,
    boosterTypeIfShown,
    indexPosition,
    listingPrice: { bestDiscount },
    isPoiMwebCard,
    sendBookNowEvent,
  } = props as any;

  const [discountText, setDiscountText] = useState('');

  const productRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const { setDrawerState, showPricingBar, setShowPricingBar, setTitle } =
    useProductCard();

  useLayoutEffect(() => {
    if (!router || !productRef.current) return;
    const { selection } = router.query;
    let timeout: NodeJS.Timeout;
    if (selection == tgid) {
      productRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      timeout = setTimeout(() => {
        setDrawerState(SWIPESHEET_STATES.OPEN);
        setShowPricingBar(true);
      }, 200);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [router, productRef]);

  useEffect(() => {
    if (bestDiscount > 0) {
      const contents = strings.formatString<string>(
        strings.OFF_PERCENT,
        bestDiscount
      );
      if (Array.isArray(contents)) setDiscountText(contents.join(' + '));
      else setDiscountText(contents);
    }
  }, [bestDiscount]);

  useEffect(() => {
    setTitle(cardTitle);
  }, [cardTitle]);

  return (
    <ScaledCard $isClicked={showPricingBar} $isDrawer={isDrawer}>
      <StyledProductCard
        onClick={() => {
          sendBookNowEvent(PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD);
          setShowPricingBar(true);
          setDrawerState(SWIPESHEET_STATES.OPEN);
        }}
        id={tgid}
        layout={layout}
        isContentExpanded={expandContent}
        isTicketCard={isTicketCard}
        isMobile={true}
        $isBannerCard={isBannerCard && !isSpecialGuidedTour}
        isV3Design={isV3Design}
        $isSwipeSheetOpen={expandContent}
        className="product-card"
        collapsed={(!expandContent && !isTicketCard) || isModifiedProductCard}
        defaultOpen={false}
        $isModifiedProductCard={isModifiedProductCard}
        $isPoiMwebCard={isPoiMwebCard}
        $isAsideBarOverlay={false}
        $isExperimentalCard={true}
        // @ts-ignore
        ref={productRef}
        $isDrawer={isDrawer}
        $hasDiscount={showScratchPrice && !!discountText.length}
        $isClicked={showPricingBar}
      >
        <Conditional if={boosterTypeIfShown && !isDrawer}>
          <Booster
            type={BoosterType[boosterTypeIfShown as keyof typeof BoosterType]}
            rank={indexPosition + 1}
            isOverlay={expandContent}
          />
        </Conditional>
        <Conditional if={!isTicketCard && images?.length && !isDrawer}>
          <Conditional if={isGuidedTour}>
            <GuidedTourLabel>
              <GuidedTourLabelBackground isMobile={true} />
              {strings.DESCRIPTORS.GUIDED_TOUR}
            </GuidedTourLabel>
          </Conditional>
          <div className="card-img">
            <MediaCarousel
              imageList={images?.slice(0, MEDIA_CAROUSEL_IMAGE_LIMIT)}
              videoUrl={isBannerCard ? bannerVideo : null}
              imageId="card-img"
              backgroundColor={COLORS.GRAY.G7}
              imageWidth={mediaCarouselImageWidth}
              imageHeight={mediaCarouselImageHeight}
              isFirstProduct={isFirstProduct}
              tgid={tgid}
              isMobile={true}
              shouldCrop={shouldCropImage}
              showOverlay
              showPagination={false}
              showTimedPaginator={true}
              bottomPosition={'4px'}
              enableAutoplay={false}
              isTimed={false}
            />
          </div>
        </Conditional>
        <ProductHeader>
          <Conditional if={isPoiMwebCard || isModifiedProductCard}>
            <CategoryAndRatingContainer
              $isDrawer={isDrawer}
              $isExperimentalCard={true}
            >
              <Category
                primaryCategory={scorpioData.primaryCategory ?? primaryCategory}
                primarySubCategory={
                  scorpioData.primarySubCategory ?? primarySubCategory
                }
              />
              <Ratings reviewsDetails={reviewsDetails} />
            </CategoryAndRatingContainer>
          </Conditional>
          <TourTitle
            boosterTag={boosterTag}
            isPoiMwebCard={isPoiMwebCard}
            cardTitle={cardTitle}
            hasBorderedTitle={hasBorderedTitle}
            isContentOpen={isContentOpen}
            isLoading={false}
            isMobile={true}
            isOpenDated={isOpenDated}
            isTicketCard={isTicketCard}
            mbTheme={mbTheme}
            pageType={pageType}
            showAvailability={showAvailabilityInTitleMobile}
            tabs={[]}
            earliestAvailability={earliestAvailability}
            currentLanguage={currentLanguage}
            isExperimentalCard={true}
            isDrawer={isDrawer}
          />
          <Conditional if={mbTheme === THEMES.MIN_BLUE || isAsideBarOverlay}>
            <ProductDescriptors
              isLoading={false}
              descriptorArray={descriptorsList}
              pageType={pageType}
              minDuration={minDuration}
              maxDuration={maxDuration}
              lang={currentLanguage}
              isCombo={isCombo}
              isGpMotorTicketsMb={isGpMotorTicketsMb}
              showIcons={!isPoiMwebCard}
              horizontal={isPoiMwebCard ? true : isAsideBarOverlay}
            />
          </Conditional>
          <Conditional if={hasV1Booster}>
            <V1BoosterBlock boosterHasIcon={boosterHasIcon}>
              <PrismicRichText
                field={booster}
                components={shortCodeSerializer}
              />
            </V1BoosterBlock>
          </Conditional>

          <Conditional if={hasOffer && offerId}>
            {productOffer.map((offer: any, index: number) => {
              if (offer.id === offerId) {
                return (
                  <ProductOfferBlock
                    key={index}
                    onClick={handlePopup}
                    className="tour-offer"
                  >
                    <PrismicRichText
                      field={offer.data.offer_title}
                      components={shortCodeSerializer}
                    />
                  </ProductOfferBlock>
                );
              }
            })}
          </Conditional>
          <CTAContainer pageType={pageType}>
            <PriceContainer
              $isDrawer={isDrawer}
              $isExperimentalCard={true}
              pageType={pageType}
            >
              <PriceBlock
                isMobile={true}
                isLoading={false}
                isSportsExperiment={isSportsExperiment}
                showScratchPrice={showScratchPrice}
                listingPrice={finalListingPrice}
                lang={currentLanguage}
                showSavings
                id={tgid}
                prefix
                key={'price-block'}
                wrapperRef={priceBlockWrapperRef}
                showNewDiscountTagDesign={true}
              />
            </PriceContainer>
            <Conditional if={isTicketCard && promo_code}>
              <PromoCodeBlock
                {...props}
                isTicketCardDetailPopup
                currencyCode={finalListingPrice?.currencyCode ?? ''}
              />
            </Conditional>
            <Conditional
              if={
                showNextAvailable &&
                showEarliestAvailability &&
                !isOpenDated &&
                !showAvailabilityInTitleMobile &&
                !isAsideBarOverlay
              }
            >
              <NextAvailable
                showSkeleton={
                  !showEarliestAvailability &&
                  !earliestAvailability &&
                  !earliestAvailability?.startDate
                }
                isExperimentalCard={true}
                isDrawer={isDrawer}
                earliestAvailability={earliestAvailability}
                currentLanguage={currentLanguage}
              />
            </Conditional>

            <Conditional if={isSpecialGuidedTour}>
              <GuidesBanner isInSwipeSheet />
            </Conditional>
            <Conditional if={!expandContent && isSpecialGuidedTour}>
              <TourAvailableInLanguages />
            </Conditional>
            <Conditional if={isOpenDated}>
              <OpenDatedDescriptor>
                <Emoji symbol="😇" label="blessed-face" />{' '}
                {strings.OPEN_DATED_DESCRIPTOR}
              </OpenDatedDescriptor>
            </Conditional>
            <Conditional if={mbTheme !== THEMES.MIN_BLUE && !isAsideBarOverlay}>
              <ProductDescriptors
                isLoading={false}
                descriptorArray={descriptorsList}
                pageType={pageType}
                minDuration={minDuration}
                maxDuration={maxDuration}
                lang={currentLanguage}
                isCombo={isCombo}
                isGpMotorTicketsMb={isGpMotorTicketsMb}
                showLanguages={expandContent && isSpecialGuidedTour}
                uid={uid}
                horizontal={isPoiMwebCard}
                showIcons={!isPoiMwebCard}
                cancellationPolicy={cancellationPolicy}
                cancellationPolicyHoverCallBack={trackCancellationPolicyHover}
                isMobile={true}
                showGuidedTourDescriptor={false}
              />
            </Conditional>
          </CTAContainer>
        </ProductHeader>
      </StyledProductCard>
    </ScaledCard>
  );
};

export default memo(MobileProductCard);
