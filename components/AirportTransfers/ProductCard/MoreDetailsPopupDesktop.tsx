import { useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { asText } from '@prismicio/richtext';
import Conditional from 'components/common/Conditional';
import { BookNowCta } from 'components/Product/components/BookNowCta';
import ExpandedGallery from 'components/Product/components/ExpandedGallery';
import Popup from 'components/Product/components/Popup';
import CloseButton from 'components/Product/components/Popup/CloseButton';
import NavigationBar from 'components/Product/components/Popup/NavigationBar';
import {
  CTABlock,
  CTAContainer,
  PopupContainer,
  PopupPricingUnit,
  PriceContainer,
  SlideUpContainer,
  SlideUpTitle,
} from 'components/Product/styles';
import { TMoreDetailsPopupDesktopProps } from 'components/VenuePage/interace';
import PriceBlock from 'UI/PriceBlock';
import {
  getCommonEventMetaData,
  getProductCommonProperties,
  trackEvent,
} from 'utils/analytics';
import { debounce } from 'utils/gen';
import {
  extractTabsFromHighlights,
  filterFromHighlights,
} from 'utils/productUtils';
import { metaAtom } from 'store/atoms/meta';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PRODUCT_CARD_REVAMP,
} from 'const/index';
import { strings } from 'const/strings';

export function MoreDetailsPopupDesktop({
  scorpioData,
  mbTheme,
  popupController,
  tour,
  PopupContent,
  currentLanguage,
  isMobile,
  productBookingUrl,
  showComboVariant,
  onShowComboPopup,
  onCloseComboPopup,
  sendBookNowEvent,
}: TMoreDetailsPopupDesktopProps) {
  const [currentTabActiveIndexForPopup, setCurrentTabActiveIndexForPopup] =
    useState({ index: 0, isForcedChange: false });

  const [isUnScrolled, setIsUnScrolled] = useState(true);

  const [popupScrollTracker, setPopupScrollTracker] = useState({
    25: false,
    50: false,
    75: false,
    90: false,
  });

  const [tabContentTopOffsetsForPopup, setTabContentTopOffsetsForPopup] =
    useState<number[] | null>(null);

  const popupContainerRef = useRef<HTMLDivElement>(null);
  const priceblockTitleContainerRef = useRef<HTMLDivElement>(null);

  const { images, listingPrice } = scorpioData;

  const tempHighlights = tour.marketing_highlights_override ?? '';

  const finalHighlights = asText(tempHighlights as any)?.trim()?.length
    ? tempHighlights
    : filterFromHighlights(scorpioData.highlights);

  const { tabs } = extractTabsFromHighlights(
    finalHighlights as Record<string, any>
  );

  const pageMetaData = useRecoilValue(metaAtom);

  const popupTopNavigationOnClick = (index: number) => {
    if (!tabContentTopOffsetsForPopup || !popupContainerRef?.current) return;

    setCurrentTabActiveIndexForPopup({ index, isForcedChange: true });
    popupContainerRef.current.scrollTo({
      top: tabContentTopOffsetsForPopup[index],
      behavior: 'smooth',
    });

    let heading;
    if (index === tabs.length)
      heading = strings.SHOW_PAGE_V2.CONTENT_TABS.Reviews;
    else heading = tabs[index].heading;

    const { primaryCategory, primaryCollection, primarySubCategory } =
      scorpioData;

    trackEvent({
      eventName: ANALYTICS_EVENTS.INFO_TAB_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tour.tgid,
      [ANALYTICS_PROPERTIES.INFO_HEADING]: heading,
      [ANALYTICS_PROPERTIES.POSITION]: index + 1,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
      [ANALYTICS_PROPERTIES.SECTION]: 'Product List',
      ...getCommonEventMetaData(pageMetaData),
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  };

  const popupScrollHandler = debounce(
    (scrollTop: number = 0, startWithReviews: boolean = false) => {
      if (!popupContainerRef.current) return;
      if (currentTabActiveIndexForPopup.isForcedChange) {
        setCurrentTabActiveIndexForPopup({
          index: currentTabActiveIndexForPopup.index,
          isForcedChange: false,
        });
        return;
      }

      const hasReviewSection = document.body.querySelector(
        '#review-section-title'
      );

      let offsets: number[] = [];
      if (!tabContentTopOffsetsForPopup) {
        const headings =
          popupContainerRef.current.querySelectorAll<HTMLHeadingElement>(
            '.tour-description h6'
          );
        if (!headings) return;
        const tourTags = popupContainerRef.current.querySelector('.tour-tags');
        const imageContainerHeight =
          popupContainerRef.current.querySelector('.card-img')?.clientHeight;
        headings.forEach((element, index) => {
          let finalOffset = element.offsetTop - 24;
          if (index === 0 && tourTags) finalOffset -= tourTags.clientHeight;
          if (imageContainerHeight) finalOffset += imageContainerHeight;
          offsets.push(finalOffset);
        });
        if (scorpioData.reviewsDetails && hasReviewSection)
          setTabContentTopOffsetsForPopup(offsets);
      } else {
        offsets = tabContentTopOffsetsForPopup;
      }

      const totalSize = popupContainerRef.current.clientHeight;
      const scrollTrack = popupScrollTracker;
      const checkScrollTracking = (offset: number) => {
        Object.keys(scrollTrack)
          .map((key) => Number(key))
          .forEach((threshold) => {
            if (scrollTrack[threshold as keyof typeof scrollTrack]) return;

            if ((offset * 100) / totalSize >= threshold) {
              trackEvent({
                eventName: ANALYTICS_EVENTS.MORE_DETAILS_SECTION_VIEWED,
                [ANALYTICS_PROPERTIES.PERCENTAGE_VIEWED]: threshold,
                [ANALYTICS_PROPERTIES.TGID]: tour.tgid,
              });
              scrollTrack[threshold as keyof typeof scrollTrack] = true;
            }
          });
        setPopupScrollTracker(scrollTrack);
      };

      if (startWithReviews && scorpioData.reviewsDetails) {
        setCurrentTabActiveIndexForPopup({
          index: offsets.length - 1,
          isForcedChange: true,
        });
        setIsUnScrolled(false);
        popupContainerRef.current.scrollTo({
          top: offsets[offsets.length - 1],
          behavior: 'smooth',
        });
        checkScrollTracking(offsets[offsets.length - 1]);
      } else {
        let indexToScrollTo = currentTabActiveIndexForPopup.index,
          minDifference = 10000;
        for (let index = 0; index < offsets.length; index++) {
          const offset = offsets[index];
          const difference = Math.abs(scrollTop - offset);
          if (difference < minDifference) {
            minDifference = difference;
            indexToScrollTo = index;
          }
          if (offset > scrollTop) break;
        }

        setCurrentTabActiveIndexForPopup({
          index: indexToScrollTo,
          isForcedChange: false,
        });

        setIsUnScrolled(scrollTop < 100);
        checkScrollTracking(scrollTop);
      }
    },
    100
  );

  return (
    <Popup controller={popupController}>
      <PopupContainer
        onScroll={(e) => {
          if (!e.currentTarget) return;
          popupScrollHandler(e.currentTarget.scrollTop);
        }}
        ref={popupContainerRef}
        tabIndex={0}
      >
        <Conditional if={images}>
          <div className="card-img">
            <ExpandedGallery images={images} />
          </div>
        </Conditional>

        <PopupContent
          scorpioData={scorpioData}
          tour={tour}
          currentLanguage={currentLanguage}
          isMobile={isMobile}
          mbTheme={mbTheme}
          expandContent
          isInPopup
          handleShowComboPopup={onShowComboPopup}
          showComboVariant={showComboVariant}
          handleCloseComboPopup={onCloseComboPopup}
          productBookingURL={productBookingUrl}
          desktopPopupController={popupController}
          desktopPopupScrollHandler={popupScrollHandler}
          sendBookNowEvent={sendBookNowEvent}
        />
      </PopupContainer>

      <NavigationBar
        tabs={tabs}
        currentActiveIndex={currentTabActiveIndexForPopup.index}
        isVisible={!isUnScrolled}
        onItemClick={popupTopNavigationOnClick}
        isReviewsSectionPresent={!!scorpioData.reviewsDetails}
      />

      <CloseButton
        isHighlighted={isUnScrolled}
        onClick={() => {
          popupController.current?.close(true);
        }}
      />

      <PopupPricingUnit>
        <CTAContainer pageType={''}>
          <SlideUpContainer
            $isTitleVisible={!isUnScrolled}
            ref={priceblockTitleContainerRef}
          >
            <SlideUpTitle
              $maxWidth={priceblockTitleContainerRef?.current?.clientWidth}
            >
              {scorpioData.title}
            </SlideUpTitle>
          </SlideUpContainer>
          <PriceContainer>
            <PriceBlock
              isMobile={isMobile}
              isLoading={false}
              showScratchPrice={true}
              listingPrice={listingPrice}
              lang={currentLanguage}
              showSavings
              id={tour.tgid}
              prefix
              key={'price-block'}
              newDiscountTagDesignProps={{
                shouldPointLeft: true,
              }}
            />
          </PriceContainer>

          <CTABlock isSticky={false} shouldOffset={false} isTicketCard={false}>
            <Conditional if={!scorpioData.combo}>
              <a
                target={isMobile ? '_self' : '_blank'}
                href={productBookingUrl}
                rel="nofollow noreferrer"
              >
                <BookNowCta
                  clickHandler={() => {
                    sendBookNowEvent(PRODUCT_CARD_REVAMP.PLACEMENT.POPUP);
                  }}
                  isMobile={isMobile}
                  mbTheme={mbTheme}
                  ctaText={strings.CHECK_AVAIL}
                />
              </a>
            </Conditional>

            <Conditional if={scorpioData.combo}>
              <BookNowCta
                showLoadingState={false}
                clickHandler={() => {
                  popupController.current?.close();
                  setTimeout(() => {
                    onShowComboPopup(PRODUCT_CARD_REVAMP.PLACEMENT.POPUP);
                  }, 300);
                }}
                isMobile={isMobile}
                mbTheme={mbTheme}
                ctaText={strings.CHECK_AVAIL}
              />
            </Conditional>
          </CTABlock>
        </CTAContainer>
      </PopupPricingUnit>
    </Popup>
  );
}
