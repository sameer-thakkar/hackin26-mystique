import React, {
  FC,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { PrismicRichText } from '@prismicio/react';
import { RichTextField } from '@prismicio/types';
import type { Itinerary as TItinerary } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import Itinerary from 'components/common/Itinerary';
import { TTabListItemProps } from 'UI/Tabs/interface';
import { useProductCard } from 'contexts/productCardContext';
import { trackEvent } from 'utils/analytics';
import type { TReviewMediasResponse } from 'utils/apiUtils';
import { isItineraryValid } from 'utils/itinerary';
import { extractTabsFromHighlights } from 'utils/productUtils';
import { addUrlParams } from 'utils/urlUtils';
import { appAtom } from 'store/atoms/app';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  type LanguagesUnion,
} from 'const/index';
import { SWIPESHEET_STATES } from 'const/productCard';
import { strings } from 'const/strings';
import SnapSheet from '../snapSheet';
import MediaCarouselWrapper from './mediaCarouselWrapper';
import {
  ContentContainer,
  DropdownContentContainer,
  Heading,
  TabContent,
} from './styles';
import TabContainer from './tabContainer';

const ReviewSection = dynamic(
  import(
    /* webpackChunkName: "ReviewSection" */ 'components/Product/components/Popup/ReviewSection'
  )
);

interface TabData {
  heading: string;
  contents: RichTextField;
  isNew?: boolean;
  type: 'richTextField' | 'itinerary' | 'reviews';
}

interface DropdownContentProps {
  images: string[];
  isBannerCard?: boolean;
  bannerVideo?: string;
  mediaCarouselImageWidth?: number;
  mediaCarouselImageHeight?: number;
  isFirstProduct?: boolean;
  tgid: string;
  shouldCropImage?: boolean;
  setImageHeight?: (height: number) => void;
  finalHighlights: TabData[];
  children?: ReactNode;
  setIsScrolled?: (isScrolled: boolean) => void;
  hasOffers?: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  trackDrawerOpen: () => void;
  hideCloseButton?: boolean;
  tgidItineraryData?: TItinerary[];
  lang: LanguagesUnion;
  onActiveItineraryTabChange?: (tab: TTabListItemProps) => void;
  preventTouchEvents?: boolean;
  reviewsDetails?: Record<string, any>;
  topReviews?: TReviewMediasResponse['items'];
}

const DropdownContent: FC<DropdownContentProps> = ({
  finalHighlights,
  images,
  isBannerCard,
  bannerVideo,
  mediaCarouselImageWidth,
  mediaCarouselImageHeight,
  tgid,
  shouldCropImage,
  isFirstProduct,
  children,
  activeTab,
  setActiveTab,
  trackDrawerOpen,
  hideCloseButton = false,
  tgidItineraryData,
  lang,
  onActiveItineraryTabChange,
  preventTouchEvents,
  reviewsDetails,
  topReviews,
}) => {
  const { isMobile } = useRecoilValue(appAtom);
  const [tabs, setTabs] = useState<TabData[]>([]);
  const [imageHeight, setImageHeight] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);
  const [isTabClickScroll, setIsTabClickScroll] = useState(false);
  const [isActive, setActive] = useState(false);

  const { setDrawerState, pricingHeight, headerHeight } = useProductCard();

  const childRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const snapRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const hasItinerarySection =
    !!tgidItineraryData &&
    tgidItineraryData.findIndex((itinerary: TItinerary) =>
      isItineraryValid(itinerary)
    ) !== -1;
  const reviewSectionLoaded = !!reviewsDetails?.showRatings;

  const adjustContainerScroll = useCallback(
    (targetElement: any, container: any) => {
      if (!targetElement || !container) return;

      const targetPosition =
        targetElement.getBoundingClientRect().left -
        container.getBoundingClientRect().left;
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();

      const isElementVisible =
        targetRect.left >= containerRect.left + 10 &&
        targetRect.right <= containerRect.right - 10;

      if (!isElementVisible) {
        container.scrollTo({
          left: targetPosition,
          behavior: 'smooth',
        });
      }
    },
    []
  );

  const moveContainer = useCallback(
    (parentContainer: any, childElement: any) => {
      var childPositionRelativeToParent =
        childElement.offsetTop - cardHeight - 110;

      parentContainer.scrollTo({
        top: childPositionRelativeToParent,
        behavior: 'smooth',
      });
    },
    [cardHeight]
  );

  const handleTabClick = useCallback(
    (tab: any, index: number) => {
      if (!tab || !headerRef.current || !snapRef.current) return;

      setIsTabClickScroll(true);

      const sectionElement = document.getElementById(tab);
      const tabElement = document.getElementById(`tab-${tab}`);
      const container = headerRef.current;

      setActiveTab(tab);

      trackEvent({
        eventName: ANALYTICS_EVENTS.INFO_TAB_CLICKED,
        [ANALYTICS_PROPERTIES.POSITION]: index + 1,
        [ANALYTICS_PROPERTIES.INFO_HEADING]: tab,
      });

      if (sectionElement) {
        moveContainer(snapRef.current, sectionElement);

        const timeoutId = setTimeout(() => {
          setIsTabClickScroll(false);
        }, 500);

        return () => {
          clearTimeout(timeoutId);
        };
      } else {
        adjustContainerScroll(tabElement, container);
      }
    },
    [moveContainer, adjustContainerScroll, setActiveTab, headerRef, snapRef]
  );

  const dragComplete = useCallback(
    (pos: number) => {
      if (pos === imageHeight) {
        setDrawerState(SWIPESHEET_STATES.OPEN);
      } else {
        setDrawerState(SWIPESHEET_STATES.EXPANDED);
      }
    },
    [imageHeight, setDrawerState]
  );

  useEffect(() => {
    let { tabs } = extractTabsFromHighlights(finalHighlights) as any;
    if (tabs.length >= 2) {
      const temp = tabs[0];
      tabs[0] = tabs[1];
      tabs[1] = temp;
    }
    tabs = tabs.map((tab: TabData) => ({
      ...tab,
      type: 'richTextField',
    }));
    setTabs(tabs);
    setActiveTab(tabs[0]?.heading || '');
  }, [finalHighlights]);

  useEffect(() => {
    if (hasItinerarySection && finalHighlights) {
      setTabs((prevTabs) => [
        prevTabs[0],
        {
          heading: strings.ITINERARY.TAB,
          isNew: true,
          contents: [],
          type: 'itinerary',
        },
        ...prevTabs.slice(1),
      ]);
    }

    if (reviewSectionLoaded) {
      setTabs((prevTabs) => [
        ...prevTabs,
        {
          heading: strings.SHOW_PAGE_V2.CONTENT_TABS.Reviews,
          isNew: false,
          contents: [],
          type: 'reviews',
        },
      ]);
    }
  }, [tgidItineraryData, finalHighlights, reviewSectionLoaded]);

  useEffect(() => {
    if (!childRef.current || !headerHeight) return;
    setCardHeight(childRef.current.clientHeight - headerHeight - 39);
  }, [childRef, headerHeight]);

  useEffect(() => {
    const { ...historyState } = window.history.state;
    const { ...otherParams } = router.query;
    addUrlParams({
      urlParams: { ...otherParams, selection: tgid as any },
      historyState: { ...historyState },
      replace: false,
    });

    trackDrawerOpen();

    setTimeout(() => {
      setActive(true);
    }, 500);

    window.onpopstate = function () {
      setDrawerState(SWIPESHEET_STATES.HIDDEN);
    };

    return () => {
      if (typeof window !== undefined) {
        const { ...historyState } = window.history.state;
        const { selection: _, ...otherParams } = router.query;
        addUrlParams({
          urlParams: { ...otherParams } as Record<string, string | string[]>,
          historyState: { ...historyState },
          replace: false,
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;
    const tabElement = document.getElementById(`tab-${activeTab}`);
    const container = headerRef.current;
    adjustContainerScroll(tabElement, container);
  }, [activeTab, adjustContainerScroll, headerRef]);

  return (
    <DropdownContentContainer
      $height={
        typeof window !== undefined ? window.innerHeight + 'px' : '100vh'
      }
      $isActive={isActive}
      id={'dropdown-content-container'}
    >
      <TabContainer
        ref={headerRef}
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />
      <MediaCarouselWrapper
        {...{
          images,
          isBannerCard,
          bannerVideo,
          mediaCarouselImageWidth,
          mediaCarouselImageHeight,
          isFirstProduct,
          tgid,
          shouldCropImage,
          setImageHeight,
          hideCloseButton,
        }}
      />
      <Conditional if={imageHeight}>
        <SnapSheet
          dragComplete={dragComplete}
          initialPosition={imageHeight}
          endPosition={-cardHeight}
          enableDrag={true}
          cardHeight={cardHeight}
          headerHeight={headerHeight}
          pricingHeight={pricingHeight - 82}
          hasOffers={false}
          ref={snapRef}
          tgid={tgid as string}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          isTabClickScroll={isTabClickScroll}
          preventTouchEvents={preventTouchEvents}
        >
          <div ref={childRef}>{children}</div>
          <ContentContainer>
            {tabs.map((tab, index) => (
              <TabContent
                className="content-block"
                key={index}
                id={tab.heading}
              >
                <Heading
                  $bottomMargin={
                    tab.type === 'itinerary'
                      ? '1.5rem'
                      : index === 0
                      ? '0.75rem'
                      : '1rem'
                  }
                >
                  {tab.type === 'itinerary'
                    ? strings.ITINERARY.HEADING
                    : tab.heading}
                </Heading>
                <Conditional if={tab.type === 'richTextField'}>
                  <PrismicRichText field={tab.contents} />
                </Conditional>
                <Conditional
                  if={tab.type === 'itinerary' && hasItinerarySection}
                >
                  <Itinerary
                    itineraryData={tgidItineraryData!}
                    lang={lang}
                    onActiveTabChange={onActiveItineraryTabChange}
                    showTitle={false}
                  />
                </Conditional>
                <Conditional
                  if={tab.type === 'reviews' && reviewsDetails?.showRatings}
                >
                  <ReviewSection
                    reviewsDetails={reviewsDetails!}
                    topReviews={topReviews}
                    tgid={tgid}
                    isMobile={isMobile}
                    showTitle={false}
                  />
                </Conditional>
              </TabContent>
            ))}
          </ContentContainer>
        </SnapSheet>
      </Conditional>
    </DropdownContentContainer>
  );
};

export default memo(DropdownContent);
