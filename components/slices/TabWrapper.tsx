import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { SliceZone } from '@prismicio/react';
import type { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import Button from 'UI/Button';
import Image from 'UI/Image';
import { legacyBooleanCheck } from 'utils';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { generateSidenavId, stringIdfy } from 'utils/helper';
import { appAtom } from 'store/atoms/app';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';
import ChevronLeftCircle from 'assets/chevronLeftCircle';
import RichContent from '../UI/RichContent';
import TitleTextCombo from '../UI/TitleTextCombo';
import { sliceComponents } from './sliceManager';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const StyledTabWrapper = styled.div`
  display: grid;
  grid-row-gap: 16px;

  .tabs {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    ${expandFontToken('UI/Label Large')}
    grid-column-gap: ${({
      // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
      isGlobalMb,
    }) => (isGlobalMb ? '48px' : '32px')};
    border-bottom: 1px solid #ebebeb;
    justify-content: left;
    &::-webkit-scrollbar {
      display: none;
    }
    ${({
      // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
      isGlobalMb,
    }) =>
      isGlobalMb &&
      `
      line-height: 20px;
      `}
  }

  .tab-content-wrap {
    display: grid;
    ${({
      // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
      isGlobalMb,
    }) => isGlobalMb && `margin-top: 8px;`}
    .tabbed-info-image {
      height: auto;
      display: flex;
      align-items: center;
      .image-wrap {
        width: auto;
      }
      .seatmap-image {
        margin-right: 1.5rem;
      }
      button {
        margin-top: 1.5rem;
      }
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    margin-bottom: 8px;
  }

  h2 {
    ${({
      // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
      isGlobalMb,
    }) => isGlobalMb && `margin-bottom: 0 !important;`}
  }
  @media (max-width: 768px) {
    .tabs {
      overflow-x: scroll;
      grid-auto-columns: max-content;
      ${({
        // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
        isGlobalMb,
      }) => isGlobalMb && `grid-column-gap: 32px;`}
    }
  }
`;

const StyledTab = styled.div`
  cursor: pointer;
  padding-bottom: 8px;
  width: 100%;
  ${expandFontToken(FONTS.HEADING_SMALL)};
  ${({
    // @ts-expect-error TS(2339): Property 'isActive' does not exist on type 'Pick<D... Remove this comment to see the full error message
    isActive,
  }) => {
    return (
      isActive &&
      `
      color: ${COLORS.TEXT.PURPS_3};
      border-bottom: 2px solid;
    `
    );
  }}
`;

const TabCarousel = styled.div`
  position: relative;
  padding: 12px 0 24px 0;
`;

const StyledSwiper = styled.div`
  overflow: hidden;
  display: flex;
  position: relative;
  max-width: ${SIZES.MAX_WIDTH};
  .swiper-wrapper {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    border-bottom: 1px solid ${COLORS.GRAY.G6};
  }
  .swiper-initialized {
    width: 100%;
    height: 100%;
  }
  .swiper-slide {
    width: auto;
  }
`;

const Controls = styled.div`
  .prev-slide,
  .next-slide {
    position: absolute;
    top: 6px;
    left: -20px;
    cursor: pointer;
    z-index: 2;
    svg {
      fill: #fff;
      circle {
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
      }
      border-radius: 100%;
      box-shadow: path {
        stroke-width: 2px;
      }
    }
  }
  .next-slide {
    left: unset;
    right: -20px;
    svg {
      transform: rotate(180deg);
    }
  }
`;

const SlideControls = styled.div`
  display: flex;
  align-items: center;
  .prev-slide,
  .next-slide {
    position: absolute;
    left: 0px;
    cursor: pointer;
    z-index: 2;
    svg {
      fill: ${COLORS.BRAND.WHITE};
      width: ${({
        // @ts-expect-error TS(2339): Property 'isMobile' does not exist on type 'Pick<D... Remove this comment to see the full error message
        isMobile,
      }) => (isMobile ? '32px' : 'auto')};
      circle {
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
      }
      border-radius: 100%;
    }
  }
  .next-slide {
    left: unset;
    right: 0px;
    margin-top: -5px;
    svg {
      transform: rotate(180deg);
    }
  }
`;

type TabWrapperProps = {
  heading?: string;
  childSlices?: Array<any>;
  sliceProps?: Object;
  description?: any[];
  tabData?: any[];
  tabElements?: any[];
  renderTabElements?: boolean;
  findBestSeatsCtaCallback?: () => void;
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

  useEffect(() => {
    const setScrollPosition = () => {
      // @ts-expect-error TS(2339): Property 'scrollLeft' does not exist on type '{}'.
      const { scrollLeft, clientWidth, scrollWidth } =
        tabsContanier?.current ?? {};
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
    };
    (tabsContanier?.current as any)?.addEventListener(
      'scroll',
      setScrollPosition
    );
    return () =>
      (tabsContanier?.current as any)?.removeEventListener(
        'scroll',
        setScrollPosition
      );
  }, []);

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

  const onTabClick = ({
    tabId,
    index,
    heading,
    isScrollTab = false,
    scrollTarget = null,
    section,
  }: any) => {
    setActiveTab(tabId);
    setActiveTabIndex(index);

    if (isScrollTab && scrollTarget) {
      (tabsContanier?.current as any)?.scrollTo({
        left: scrollTarget.offsetLeft - scrollTarget.offsetWidth / 2,
        behavior: 'smooth',
      });
    }

    trackEvent({
      eventName: ANALYTICS_EVENTS.INFO_TAB_CLICKED,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.INFO_HEADING]: heading,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Standalone',
      [ANALYTICS_PROPERTIES.SECTION]: section || 'Longform Content',
      ...getCommonEventMetaData(pageMetaData),
    });
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
          {description ? <RichContent render={description} /> : null}
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
            components={sliceComponents()}
            context={{ ...sliceProps, wrapperType: 'tab' }}
            defaultComponent={() => null}
          />
        </div>
      </>
    );
  }

  return (
    // @ts-expect-error TS(2769): No overload matches this call.
    <StyledTabWrapper isGlobalMb={isGlobalMb}>
      <TitleTextCombo noMargin={true}>
        <Conditional if={heading?.length}>
          <h2 id={generateSidenavId(heading || '')}>{heading}</h2>
        </Conditional>
        {description ? <RichContent render={description} /> : null}
      </TitleTextCombo>
      <div ref={tabsContanier} className="tabs">
        <Conditional if={tabData.length}>
          {tabData.map((tab, index) => {
            const tabId = stringIdfy(tab.heading);
            return (
              <div key={index} className="swiper-slide">
                <StyledTab
                  key={index}
                  // @ts-expect-error TS(2769): No overload matches this call.
                  isActive={activeTabId == tabId}
                  onClick={(e) =>
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
                onClick={(e) =>
                  onTabClick({
                    tabId,
                    heading: tab.heading,
                    index,
                    isScrollTab: true,
                    scrollTarget: e.target,
                    section: heading,
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
                onClick={(e) =>
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
        <Conditional if={isMobile}>
          {/* @ts-expect-error TS(2769): No overload matches this call. */}
          <SlideControls isMobile={isMobile}>
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
      <div className="tab-content-wrap">
        <Conditional if={tabData.length}>
          <div style={{ maxWidth: '894px', fontSize: `15px` }}>
            <RichContent render={tabData[activeTabIndex]?.content} />
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
        <Conditional if={renderTabElements}>
          <div> {tabElements?.[activeTabIndex]?.children}</div>
        </Conditional>
        <Conditional if={!tabData.length}>
          <SliceZone
            slices={slices}
            components={sliceComponents()}
            context={{ ...sliceProps, wrapperType: 'tab' }}
            defaultComponent={() => null}
          />
        </Conditional>
      </div>
    </StyledTabWrapper>
  );
};

export default TabWrapper;
