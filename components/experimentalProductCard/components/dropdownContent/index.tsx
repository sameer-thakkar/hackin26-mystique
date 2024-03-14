import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { PrismicRichText } from '@prismicio/react';
import { RichTextField } from '@prismicio/types';
import Conditional from 'components/common/Conditional';
import { useProductCard } from 'contexts/productCardContext';
import { trackEvent } from 'utils/analytics';
import { extractTabsFromHighlights } from 'utils/productUtils';
import { addUrlParams } from 'utils/urlUtils';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { SWIPESHEET_STATES } from 'const/productCard';
import SnapSheet from '../snapSheet';
import MediaCarouselWrapper from './mediaCarouselWrapper';
import {
  ContentContainer,
  DropdownContentContainer,
  Heading,
  TabContent,
} from './styles';
import TabContainer from './tabContainer';

interface TabData {
  heading: string;
  contents: RichTextField;
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
  hasOffers,
  activeTab,
  setActiveTab,
  trackDrawerOpen,
}) => {
  const [tabs, setTabs] = useState<TabData[]>([]);
  const [imageHeight, setImageHeight] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isTabClickScroll, setIsTabClickScroll] = useState(false);
  const [isActive, setActive] = useState(false);

  const { setDrawerState, pricingHeight } = useProductCard();

  const childRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const snapRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

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
        childElement.offsetTop - cardHeight - 60;

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
    if (!headerRef.current) return;
    setHeaderHeight(headerRef.current.clientHeight);
  }, [headerRef]);

  useEffect(() => {
    const { tabs } = extractTabsFromHighlights(finalHighlights) as any;
    if (tabs.length >= 2) {
      const temp = tabs[0];
      tabs[0] = tabs[1];
      tabs[1] = temp;
    }
    setTabs(tabs);
    setActiveTab(tabs[0]?.heading || '');
  }, [finalHighlights]);

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
          urlParams: { ...otherParams },
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
        typeof window !== undefined ? window.innerHeight * 0.9 + 'px' : '90vh'
      }
      $isActive={isActive}
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
          pricingHeight={pricingHeight - 42}
          hasOffers={hasOffers}
          ref={snapRef}
          tgid={tgid as string}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          isTabClickScroll={isTabClickScroll}
        >
          <div ref={childRef}>{children}</div>
          <ContentContainer>
            {tabs.map((tab, index) => (
              <TabContent
                className="content-block"
                key={index}
                id={tab.heading}
              >
                <Heading $isFirst={index === 0}>{tab.heading}</Heading>
                <PrismicRichText field={tab.contents} />
              </TabContent>
            ))}
          </ContentContainer>
        </SnapSheet>
      </Conditional>
    </DropdownContentContainer>
  );
};

export default React.memo(DropdownContent);
