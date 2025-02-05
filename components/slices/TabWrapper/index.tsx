import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { SliceZone } from '@prismicio/react';
import type { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import Button from 'UI/Button';
import Image from 'UI/Image';
import RichContent from 'UI/RichContent';
import TitleTextCombo from 'UI/TitleTextCombo';
import { legacyBooleanCheck } from 'utils';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { generateSidenavId, stringIdfy } from 'utils/helper';
import { appAtom } from 'store/atoms/app';
import { metaAtom } from 'store/atoms/meta';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  SLICE_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import ChevronLeftCircle from 'assets/chevronLeftCircle';
import { sliceComponents } from '../sliceManager';
import {
  Controls,
  SlideControls,
  StyledSwiper,
  StyledTab,
  StyledTabWrapper,
  TabCarousel,
} from './style';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

type TabWrapperProps = {
  heading?: string;
  childSlices?: Array<any>;
  sliceProps?: Object;
  description?: any[];
  tabData?: any[];
  tabElements?: any[];
  renderTabElements?: boolean;
  findBestSeatsCtaCallback?: () => void;
  jumpscroll?: boolean;
  makeTabElementsCrawlable?: boolean;
  showDropShadow?: boolean;
  showControls?: boolean;
};

/**
 * Tab Wrapper Start/End Are the Wrapping Slices that are required to add n number of tabs.
 *
 * Inside a Tab Wrapper you're expected to add only `Tab` Slice type as adding any other slice type will cause it to glitch.
 *
 * > Structure
 *
 *```html
 *...
 *
 *<tab_wrapper_start>
 *  <tab />
 *    <slice_a />
 *    <slice_b />
 *  <tab />
 *    <slice_b />
 *    <slice_a />
 *    <slice_c />
 *  <tab />
 *    <slice_z />
 *<tab_wrapper_end>
 *
 * ...
 *```
 *
 *
 */
const TabWrapper = (props: TabWrapperProps) => {
  const {
    heading,
    childSlices: slices = [],
    sliceProps: parentSliceProps,
    description = [],
    tabData = [],
    findBestSeatsCtaCallback,
    tabElements = [],
    renderTabElements = false,
    jumpscroll = false,
    makeTabElementsCrawlable = false,
    showDropShadow = false,
    showControls = false,
  } = props;
  const { isMobile } = useRecoilValue(appAtom);

  // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Obje... Remove this comment to see the full error message
  const { isGlobalMb } = parentSliceProps || {};
  const defaultFromPrismic = slices.filter(
    (slice) => slice.primary.is_default == 'Yes'
  );

  const defaultTab = renderTabElements
    ? stringIdfy(tabElements?.[0]?.heading)
    : stringIdfy(
        tabData[0]?.heading ||
          (defaultFromPrismic[0] || slices[0])?.primary?.title ||
          ''
      );
  const defaultTabIndex =
    renderTabElements || tabData.length
      ? 0
      : slices.indexOf((slice: any) =>
          legacyBooleanCheck(slice.primary.is_default)
        ) ?? 0;
  const [activeTabId, setActiveTab] = useState(defaultTab);
  const [activeTabIndex, setActiveTabIndex] = useState(defaultTabIndex);
  let sliceProps: any = {
    activeTabId,
    activeTabIndex,
    ...parentSliceProps,
  };
  const cityName = sliceProps?.cityName;
  const tabSectionHeading =
    cityName && sliceProps?.isGlobalCity
      ? `${heading} ${cityName} Themeparks`
      : heading;

  // Tab Carousel
  const [swiper, updateSwiper] = useState(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
  const updateIndex = useCallback(
    () => updateCurrentIndex((swiper as any)?.realIndex as number),
    [swiper]
  );
  const [isEnd, updateEnd] = useState(false);
  const [isBeginning, updateBeginning] = useState(true);
  const tabsContanier = useRef(null);
  const pageMetaData = useRecoilValue(metaAtom);

  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isTabSticky, setIsTabSticky] = useState(false);
  const scrollViewProps: React.HTMLAttributes<HTMLDivElement> = {};
  const scrollRef = useRef(null);

  if (showDropShadow) {
    const scrollHandler = () => {
      if (scrollRef.current) {
        const { scrollTop } = scrollRef?.current;
        const isSticky = scrollTop >= 24;
        setIsTabSticky(isSticky);
      }
    };
    scrollViewProps.onScroll = scrollHandler;
  }

  const setScrollPosition = (tabsContanier: any) => {
    const { scrollLeft, clientWidth, scrollWidth } =
      tabsContanier?.current ?? {};
    setIsAtStart(scrollLeft <= 16);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
  };

  useEffect(() => {
    if (!tabsContanier?.current) return;
    setScrollPosition(tabsContanier);
  }, [tabsContanier]);

  useEffect(() => {
    if (isMobile) return;
    updateBeginning((swiper as any)?.isBeginning);
    updateEnd((swiper as any)?.isEnd);
    if (swiper !== null) {
      (swiper as any).on('slideChange', updateIndex);
    }
    return () => {
      if (swiper !== null) {
        (swiper as any).off('slideChange', updateIndex);
      }
    };
  }, [isMobile, swiper, updateIndex]);

  const components = useMemo(() => {
    return sliceComponents();
  }, []);

  const onTabClick = ({
    tabId,
    index,
    heading,
    isScrollTab = false,
    scrollTarget = null,
    section,
    trackingObject,
  }: any) => {
    setActiveTab(tabId);
    setActiveTabIndex(index);
    if (jumpscroll) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }

    if (isScrollTab && scrollTarget) {
      (tabsContanier?.current as any)?.scrollTo({
        left: scrollTarget.offsetLeft - 20,
        behavior: 'smooth',
      });
    }

    if (trackingObject) {
      trackEvent(trackingObject);
    } else {
      trackEvent({
        eventName: ANALYTICS_EVENTS.INFO_TAB_CLICKED,
        [ANALYTICS_PROPERTIES.RANKING]: index + 1,
        [ANALYTICS_PROPERTIES.INFO_HEADING]: heading,
        [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Standalone',
        [ANALYTICS_PROPERTIES.SECTION]: section || 'Longform Content',
        ...getCommonEventMetaData(pageMetaData),
      });
    }
  };

  const scrollTab = (direction: 'left' | 'right') => {
    let width = (tabsContanier?.current as any)?.scrollWidth;
    let newTabIndex = activeTabIndex;
    if (direction === 'left') {
      width = width * -1;
      if (activeTabIndex > 0) {
        newTabIndex = activeTabIndex - 1;
      }
    } else if (direction === 'right' && activeTabIndex < slices.length - 1) {
      newTabIndex = activeTabIndex + 1;
    }

    setActiveTabIndex(newTabIndex);
    setActiveTab(
      stringIdfy(
        tabData[newTabIndex]?.heading[0]?.text ||
          slices[newTabIndex]?.primary?.title
      )
    );
    (tabsContanier?.current as any)?.scrollBy({
      left: width * 0.1,
      behavior: 'smooth',
    });
  };

  if (isGlobalMb && !isMobile) {
    const goNext = () => {
      if (swiper !== null) {
        (swiper as any)?.slideNext();
        updateEnd((swiper as any)?.isEnd);
        updateBeginning((swiper as any)?.isBeginning);
      }
    };

    const goPrev = () => {
      if (swiper !== null) {
        (swiper as any).slidePrev();
        updateEnd((swiper as any)?.isEnd);
        updateBeginning((swiper as any)?.isBeginning);
      }
    };
    const swiperParams: SwiperProps = {
      slidesPerView: 'auto',
      spaceBetween: 48,
      // @ts-expect-error TS(2322): Type 'Dispatch<SetStateAction<null>>' is not assig... Remove this comment to see the full error message
      onSwiper: updateSwiper,
    };

    return (
      <>
        <TitleTextCombo noMargin={true}>
          <Conditional if={heading?.length}>
            <h2 id={generateSidenavId(heading || '')}>{tabSectionHeading}</h2>
          </Conditional>
          {description ? (
            <RichContent
              render={description}
              parentProps={{
                sectionName: tabSectionHeading,
                sliceType: SLICE_TYPES.TAB_WRAPPER,
              }}
            />
          ) : null}
        </TitleTextCombo>
        <TabCarousel>
          <StyledSwiper>
            <Swiper {...swiperParams}>
              {slices.map((slice, index) => {
                const tabId = stringIdfy(slice.primary.title);
                return (
                  <div key={index} className="swiper-slide">
                    <StyledTab
                      key={index}
                      // @ts-expect-error TS(2769): No overload matches this call.
                      isActive={activeTabId == tabId}
                      className="tab-heading"
                      onClick={() =>
                        onTabClick({
                          tabId,
                          index,
                          heading: slice.primary.title,
                        })
                      }
                    >
                      {slice.primary.title}
                    </StyledTab>
                  </div>
                );
              })}
            </Swiper>
          </StyledSwiper>
          <Controls>
            {!isBeginning ? (
              <div
                className="prev-slide"
                role="button"
                tabIndex={0}
                onClick={goPrev}
              >
                {ChevronLeftCircle}
              </div>
            ) : null}
            {!isEnd ? (
              <div
                className="next-slide"
                role="button"
                tabIndex={0}
                onClick={goNext}
              >
                {ChevronLeftCircle}
              </div>
            ) : null}
          </Controls>
        </TabCarousel>
        <div className="tab-content-wrap">
          <SliceZone
            slices={slices}
            components={components}
            context={{
              ...sliceProps,
              wrapperType: 'tab',
              sectionName: heading,
            }}
            defaultComponent={() => null}
          />
        </div>
      </>
    );
  }

  return (
    // @ts-expect-error TS(2769): No overload matches this call.
    <StyledTabWrapper isGlobalMb={isGlobalMb} $isTabSticky={isTabSticky}>
      <Conditional if={heading?.length}>
        <TitleTextCombo noMargin={true}>
          <h2 id={generateSidenavId(heading || '')}>{heading}</h2>
          {description ? (
            <RichContent
              render={description}
              parentProps={{
                sectionName: heading,
                sliceType: SLICE_TYPES.TAB_WRAPPER,
              }}
            />
          ) : null}
        </TitleTextCombo>
      </Conditional>
      <div
        ref={tabsContanier}
        className="tabs"
        onScroll={() => setScrollPosition(tabsContanier)}
      >
        <Conditional if={tabData.length}>
          {tabData.map((tab, index) => {
            const tabId = stringIdfy(tab.heading);
            return (
              <div key={index} className="swiper-slide">
                <StyledTab
                  key={index}
                  // @ts-expect-error TS(2769): No overload matches this call.
                  isActive={activeTabId == tabId}
                  onClick={(e: any) =>
                    onTabClick({
                      tabId,
                      heading: tab.heading,
                      index,
                      isScrollTab: false,
                      scrollTarget: e.target,
                      section: heading,
                    })
                  }
                >
                  {tab.heading}
                </StyledTab>
              </div>
            );
          })}
        </Conditional>
        <Conditional if={renderTabElements}>
          {tabElements?.map((tab: Record<string, any>, index: number) => {
            const tabId = stringIdfy(tab.heading);
            return (
              <StyledTab
                key={tabId}
                // @ts-expect-error TS(2769): No overload matches this call.
                isActive={index === activeTabIndex}
                onClick={(e: any) =>
                  onTabClick({
                    tabId,
                    heading: tab.heading,
                    index,
                    isScrollTab: true,
                    scrollTarget: e.target,
                    section: heading,
                    trackingObject: tab.trackingObject,
                  })
                }
              >
                {tab.heading}
              </StyledTab>
            );
          })}
        </Conditional>
        <Conditional if={!tabData.length}>
          {slices.map((slice, index) => {
            const tabId = stringIdfy(slice.primary.title);
            return (
              <StyledTab
                key={index}
                // @ts-expect-error TS(2769): No overload matches this call.
                isActive={activeTabId === tabId}
                onClick={(e: any) =>
                  onTabClick({
                    tabId,
                    heading: slice.primary.title,
                    index,
                    isScrollTab: true,
                    scrollTarget: e.target,
                  })
                }
              >
                {slice.primary.title}
              </StyledTab>
            );
          })}
        </Conditional>
        <Conditional if={isMobile || showControls}>
          {/* @ts-expect-error TS(2769): No overload matches this call. */}
          <SlideControls isMobile={isMobile} className="slide-controls">
            <Conditional if={!isAtStart}>
              <div
                className="prev-slide"
                role="button"
                tabIndex={0}
                onClick={() => scrollTab('left')}
              >
                {ChevronLeftCircle}
              </div>
            </Conditional>
            <Conditional if={!isAtEnd}>
              <div
                className="next-slide"
                role="button"
                tabIndex={0}
                onClick={() => scrollTab('right')}
              >
                {ChevronLeftCircle}
              </div>
            </Conditional>
          </SlideControls>
        </Conditional>
      </div>
      <div className="tab-content-wrap" ref={scrollRef} {...scrollViewProps}>
        <Conditional if={tabData.length}>
          <div style={{ maxWidth: '894px', fontSize: `15px` }}>
            <RichContent
              render={tabData[activeTabIndex]?.content}
              parentProps={{
                sectionName: tabSectionHeading,
                sliceType: SLICE_TYPES.TAB_WRAPPER,
              }}
            />
          </div>
          <div className="tabbed-info-image">
            <Image
              url={tabData[activeTabIndex]?.image_source}
              height="630"
              width="485"
              className="seatmap-image"
              alt="Seatmap"
            />
            <Conditional if={tabData[activeTabIndex]?.legend_image_source}>
              <div className="legend-image">
                <Image
                  url={tabData[activeTabIndex]?.legend_image_source}
                  height="160"
                  width="327"
                  alt="Legend Image"
                />
                <Conditional if={findBestSeatsCtaCallback}>
                  <Button
                    fillType="fillGradient"
                    widthProp="100%"
                    onClick={findBestSeatsCtaCallback}
                  >
                    {strings.THEATRE_PAGE.FIND_BEST_SEATS}
                  </Button>
                </Conditional>
              </div>
            </Conditional>
          </div>
        </Conditional>
        <Conditional if={makeTabElementsCrawlable && renderTabElements}>
          {tabElements?.map((_, index) => (
            <div
              style={{
                display: `${activeTabIndex === index ? 'block' : 'none'}`,
              }}
              key={index}
            >
              {tabElements?.[index]?.children}
            </div>
          ))}
        </Conditional>
        <Conditional if={!makeTabElementsCrawlable && renderTabElements}>
          <div> {tabElements?.[activeTabIndex]?.children}</div>
        </Conditional>
        <Conditional if={!tabData.length}>
          <SliceZone
            slices={slices}
            components={components}
            context={{
              ...sliceProps,
              wrapperType: 'tab',
              sectionName: heading,
            }}
            defaultComponent={() => null}
          />
        </Conditional>
      </div>
    </StyledTabWrapper>
  );
};

export default TabWrapper;
