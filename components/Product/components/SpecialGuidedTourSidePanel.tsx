import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Conditional from 'components/common/Conditional';
import { BookNowCta } from 'components/Product/components/BookNowCta';
import { GuidesBanner } from 'components/Product/components/GuidesBanner';
import { NextAvailable } from 'components/Product/components/NextAvailable';
import { ProductDescriptors } from 'components/Product/components/ProductDescriptors';
import { TourTitle } from 'components/Product/components/TourTitle';
import { TSpecialGuidedTourSidePanelProps } from 'components/Product/interface';
import {
  BottomBar,
  CloseIconWrapper,
  GuidedTourLabel,
  GuidesLabelWrapper,
  HighlightsWrapper,
  ProductDescriptorsWrapper,
  SidePanel,
  SidePanelImageContainer,
  SidePanelOverlay,
  SidePanelStickyHeader,
} from 'components/Product/styles';
import PriceBlock from 'UI/PriceBlock';
import useOnScreen from 'hooks/useOnScreen';
import { MEDIA_CAROUSEL_IMAGE_LIMIT } from 'const/index';
import { strings } from 'const/strings';
import CloseIcon from 'assets/closeIcon';
import GuidedTourLabelBackground from 'assets/guidedtourlabelbackground';

const MediaCarousel = dynamic(
  () => import(/* webpackChunkName: "MediaCarousel" */ 'UI/MediaCarousel')
);

const SpecialGuidedTourSidePanel = ({
  onSidePanelClose,
  tgid,
  images,
  tourTitle,
  highlightTabsComponent,
  descriptorsList,
  minDuration,
  maxDuration,
  lang,
  showScratchPrice,
  listingPrice,
  onBookNowClick,
  ctaText,
  showAvailabilityInTitle,
  earliestAvailability,
  productBookingUrl,
  uid,
  isShortcodePopup = false,
}: TSpecialGuidedTourSidePanelProps) => {
  const [closed, setClosed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const wrapperRef = useRef(null);
  const isOnScreen = useOnScreen({
    ref: wrapperRef,
  });
  useEffect(() => {
    document.querySelector('body')?.classList.add('scroll-lock');
    return () => {
      document.querySelector('body')?.classList.remove('scroll-lock');
    };
  }, []);
  return (
    <>
      <SidePanelOverlay
        $closed={closed}
        onClick={() => {
          setClosed(true);
        }}
        onAnimationEnd={() => {
          if (closed) onSidePanelClose();
        }}
      />
      <SidePanelStickyHeader
        $fadeIn={!isOnScreen && hasScrolled}
        $fadeOut={isOnScreen && hasScrolled}
        $closed={closed}
      >
        <CloseIconWrapper
          onClick={() => {
            setClosed(true);
          }}
        >
          <CloseIcon />
        </CloseIconWrapper>
        <Conditional if={!isShortcodePopup}>
          <div className="guided-tour-label">
            {strings.DESCRIPTORS.GUIDED_TOUR}
          </div>
        </Conditional>
        <div className="tour-title">{tourTitle}</div>
      </SidePanelStickyHeader>
      <SidePanel
        $closed={closed}
        onScroll={() => {
          if (!isOnScreen) setHasScrolled(true);
        }}
      >
        <SidePanelImageContainer>
          <Conditional if={!isShortcodePopup}>
            <GuidedTourLabel ref={wrapperRef}>
              <GuidedTourLabelBackground isMobile={false} />
              {strings.DESCRIPTORS.GUIDED_TOUR}
            </GuidedTourLabel>
          </Conditional>
          <MediaCarousel
            imageList={images?.slice(0, MEDIA_CAROUSEL_IMAGE_LIMIT)}
            tgid={tgid}
            imageAspectRatio="16:9"
            imageWidth={452}
            imageHeight={253}
            isMobile={false}
          />
        </SidePanelImageContainer>
        <TourTitle
          cardTitle={tourTitle}
          showAvailability={showAvailabilityInTitle}
          earliestAvailability={earliestAvailability}
          currentLanguage={lang}
        />
        <Conditional if={!showAvailabilityInTitle}>
          <NextAvailable
            earliestAvailability={earliestAvailability}
            currentLanguage={lang}
          />
        </Conditional>
        <Conditional if={!isShortcodePopup}>
          <GuidesLabelWrapper>
            <GuidesBanner />
          </GuidesLabelWrapper>
        </Conditional>
        <ProductDescriptorsWrapper>
          <ProductDescriptors
            descriptorArray={descriptorsList}
            minDuration={minDuration}
            maxDuration={maxDuration}
            lang={lang}
            horizontal
            showLanguages={!isShortcodePopup}
            uid={uid}
          />
        </ProductDescriptorsWrapper>
        <HighlightsWrapper>{highlightTabsComponent}</HighlightsWrapper>
      </SidePanel>
      <BottomBar $closed={closed}>
        <PriceBlock
          showScratchPrice={showScratchPrice}
          listingPrice={listingPrice}
          lang={lang}
          showSavings
          id={+tgid}
          prefix
        />
        <a target="_blank" href={productBookingUrl} rel="nofollow noreferrer">
          <BookNowCta
            isInSidePanel
            clickHandler={onBookNowClick}
            ctaText={ctaText}
          />
        </a>
      </BottomBar>
    </>
  );
};

export default SpecialGuidedTourSidePanel;
