import React, { useCallback, useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useAmp } from 'next/amp';
import { COLORS, SIZES, SOLEIL } from 'const/ui-constants';
import Conditional from 'components/common/Conditional';
import { useWindowWidth } from '@react-hook/window-size';
import { CHEVRON_LEFT, CHEVRON_LEFT_CIRCLE } from 'assets/SvgIcons';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS } from 'const/index';
import { ANALYTICS_PROPERTIES } from 'const/index';
import { legacyBooleanCheck } from 'utils';
import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';

import { stringIdfy } from '../../utils/helper';
import sliceHandler from '../Slices';
import RichContent from '../UI/RichContent';
import TitleTextCombo from '../UI/TitleTextCombo';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const StyledTabWrapper = styled.div`
  display: grid;
  grid-row-gap: 16px;
  line-height: 1.5;
  font-family: ${SOLEIL.FONT_STACK};
  .tabs {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    font-size: ${({ isGlobalMb }) => (isGlobalMb ? '16px' : '18px')};
    grid-column-gap: ${({ isGlobalMb }) => (isGlobalMb ? '48px' : '32px')};
    border-bottom: 1px solid #ebebeb;
    justify-content: left;
    &::-webkit-scrollbar {
      display: none;
    }
    ${({ isGlobalMb }) =>
      isGlobalMb &&
      `
      line-height: 20px;
      `}
  }

  .tab-content-wrap {
    display: grid;
    ${({ isGlobalMb }) => isGlobalMb && `margin-top: 8px;`}
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
    ${({ isGlobalMb }) => isGlobalMb && `margin-bottom: 0 !important;`}
  }
  @media (max-width: 768px) {
    .tabs {
      overflow-x: scroll;
      grid-auto-columns: max-content;
      ${({ isGlobalMb }) => isGlobalMb && `grid-column-gap: 32px;`}
    }
  }
`;

const StyledTab = styled.div`
  cursor: pointer;
  padding-bottom: 8px;
  width: 100%;
  ${({ isActive }) => {
    return (
      isActive &&
      `
      color: ${COLORS.PURPS3};
      border-bottom: 2px solid;
    `
    );
  }}
`;

const AmpSelectorContainer = styled.div`
  amp-selector {
    width: calc(100vw - 32px);
    margin-bottom: 20px;
  }
  amp-selector [role='tab'] {
    cursor: pointer;
    padding-bottom: 8px;
    display: block;
    width: 100%;
  }

  amp-selector [role='tab'][selected] {
    color: ${COLORS.PURPS};
    border-bottom: 2px solid;
    outline: none;
  }

  amp-selector [role='tabpanel'] {
    display: none;
  }

  amp-selector [role='tabpanel'][selected] {
    outline: none;
    display: block;
    .tab-item-amp {
      display: block;
    }
  }
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
  .tabs-section-wrapper {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    border-bottom: 1px solid ${COLORS.GREY.G6};
  }
  .swiper-container {
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
      fill: ${COLORS.WHITE};
      width: ${({ isMobile }) => (isMobile ? '32px' : 'auto')};
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
  heading: String;
  slices: Array<any>;
  sliceProps?: Object;
  description?: any[];
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
  const { heading, slices, sliceProps: parentSliceProps, description } = props;
  // @ts-ignore
  const { sliceIndex, isGlobalMb } = parentSliceProps;
  const defaultFromPrismic = slices.filter(
    (slice) => slice.primary.is_default == 'Yes'
  );
  let modifiedSlices = slices.map((slice, index) => {
    return { ...slice, index };
  });
  const defaultTab = stringIdfy(
    (defaultFromPrismic[0] || slices[0])?.primary?.title || ''
  );
  const isAmp = useAmp();
  const [activeTabId, setActiveTab] = useState(defaultTab);
  const [activeTabIndex, setActiveTabIndex] = useState(
    slices.indexOf((slice) => legacyBooleanCheck(slice.primary.is_default)) ?? 0
  );
  let sliceProps: any = {
    activeTabId,
    ...parentSliceProps,
  };
  const cityName = sliceProps?.cityName;
  const tabSectionHeading =
    cityName && sliceProps?.isGlobalCity
      ? `${heading} ${cityName} Themeparks`
      : heading;

  // Tab Carousel
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(false);
  const [swiper, updateSwiper] = useState(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
  const updateIndex = useCallback(() => updateCurrentIndex(swiper.realIndex), [
    swiper,
  ]);
  const [isEnd, updateEnd] = useState(false);
  const [isBeginning, updateBeginning] = useState(true);
  const tabsContanier = useRef(null);
  const pageMetaData = useRecoilValue(metaAtom);

  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    const setScrollPosition = () => {
      const { scrollLeft, clientWidth, scrollWidth } =
        tabsContanier?.current ?? {};
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
    };

    tabsContanier?.current?.addEventListener('scroll', setScrollPosition);

    return () =>
      tabsContanier?.current?.removeEventListener('scroll', setScrollPosition);
  }, []);

  // isMobile effect
  useEffect(() => {
    setIsMobile(width <= 768);
  }, [width, setIsMobile]);

  useEffect(() => {
    if (isMobile) return;
    updateBeginning(swiper?.isBeginning);
    updateEnd(swiper?.isEnd);
    if (swiper !== null) {
      swiper.on('slideChange', updateIndex);
    }

    return () => {
      if (swiper !== null) {
        swiper.off('slideChange', updateIndex);
      }
    };
  }, [isMobile, swiper, updateIndex]);

  const onTabClick = ({
    tabId,
    index,
    heading,
    isScrollTab = false,
    scrollTarget = null,
  }) => {
    setActiveTab(tabId);
    setActiveTabIndex(index);

    if (isScrollTab && scrollTarget) {
      tabsContanier?.current?.scrollTo({
        left: scrollTarget.offsetLeft - scrollTarget.offsetWidth / 2,
        behavior: 'smooth',
      });
    }

    trackEvent({
      eventName: ANALYTICS_EVENTS.INFO_TAB_CLICKED,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.HEADING]: heading,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Standalone',
      [ANALYTICS_PROPERTIES.SECTION]: 'Longform Content',
      ...getCommonEventMetaData(pageMetaData),
    });
  };

  const scrollTab = (direction: 'left' | 'right') => {
    let width = tabsContanier?.current?.scrollWidth;
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
    setActiveTab(stringIdfy(slices[newTabIndex]?.primary?.title));
    tabsContanier?.current?.scrollBy({ left: width * 0.1, behavior: 'smooth' });
  };

  if (isGlobalMb && !isMobile) {
    const goNext = () => {
      if (swiper !== null) {
        swiper?.slideNext();
        updateEnd(swiper?.isEnd);
        updateBeginning(swiper?.isBeginning);
      }
    };

    const goPrev = () => {
      if (swiper !== null) {
        swiper.slidePrev();
        updateEnd(swiper?.isEnd);
        updateBeginning(swiper?.isBeginning);
      }
    };
    const swiperParams = {
      slidesPerView: 'auto',
      wrapperClass: 'tabs-section-wrapper',
      spaceBetween: 48,
      shouldSwiperUpdate: true,
      getSwiper: updateSwiper,
    };

    return (
      <>
        <TitleTextCombo noMargin={true}>
          <Conditional if={heading?.length}>
            <h2>{tabSectionHeading}</h2>
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
                {isAmp ? CHEVRON_LEFT : CHEVRON_LEFT_CIRCLE}
              </div>
            ) : null}
            {!isEnd ? (
              <div
                className="next-slide"
                role="button"
                tabIndex={0}
                onClick={goNext}
              >
                {isAmp ? CHEVRON_LEFT : CHEVRON_LEFT_CIRCLE}
              </div>
            ) : null}
          </Controls>
        </TabCarousel>
        <div className="tab-content-wrap">
          {slices.map((slice, keyIndex) => {
            return sliceHandler(slice, { ...sliceProps, keyIndex });
          })}
        </div>
      </>
    );
  }

  return (
    <StyledTabWrapper isGlobalMb={isGlobalMb}>
      <TitleTextCombo noMargin={true}>
        <Conditional if={heading?.length}>
          <h2>{heading}</h2>
        </Conditional>
        {description ? <RichContent render={description} /> : null}
      </TitleTextCombo>
      {isAmp ? (
        <AmpSelectorContainer>
          <amp-selector
            className="tabs-with-selector tabs"
            role="tablist"
            on={`select:tabWrapperPanel_${sliceIndex}.toggle(index=event.targetOption, value=true)`}
            keyboard-select-mode="focus"
          >
            {modifiedSlices.map((slice, index) => {
              return (
                <div
                  key={index}
                  role="tab"
                  className="tab-heading"
                  // @ts-ignore
                  option={`${index}`}
                  selected={index === 0}
                >
                  {slice.primary.title}
                </div>
              );
            })}
          </amp-selector>
          <amp-selector id={`tabWrapperPanel_${sliceIndex}`}>
            <div className="tab-content-wrap">
              {modifiedSlices.map((slice, keyIndex) => {
                return (
                  <div
                    key={keyIndex}
                    role="tabpanel"
                    // @ts-ignore
                    option={`${keyIndex}`}
                    selected={keyIndex === 0}
                  >
                    {sliceHandler(slice, {
                      ...sliceProps,
                      keyIndex,
                      ampModified: true,
                    })}
                  </div>
                );
              })}
            </div>
          </amp-selector>
        </AmpSelectorContainer>
      ) : (
        <>
          <div ref={tabsContanier} className="tabs">
            {slices.map((slice, index) => {
              const tabId = stringIdfy(slice.primary.title);
              return (
                <StyledTab
                  key={index}
                  isActive={activeTabId == tabId}
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
            <Conditional if={isMobile}>
              <SlideControls isMobile={isMobile}>
                <Conditional if={!isAtStart}>
                  <div
                    className="prev-slide"
                    role="button"
                    tabIndex={0}
                    onClick={() => scrollTab('left')}
                  >
                    {isAmp ? CHEVRON_LEFT : CHEVRON_LEFT_CIRCLE}
                  </div>
                </Conditional>
                <Conditional if={!isAtEnd}>
                  <div
                    className="next-slide"
                    role="button"
                    tabIndex={0}
                    onClick={() => scrollTab('right')}
                  >
                    {isAmp ? CHEVRON_LEFT : CHEVRON_LEFT_CIRCLE}
                  </div>
                </Conditional>
              </SlideControls>
            </Conditional>
          </div>
          <div className="tab-content-wrap">
            {slices.map((slice, keyIndex) => {
              return sliceHandler(slice, { ...sliceProps, keyIndex });
            })}
          </div>
        </>
      )}
    </StyledTabWrapper>
  );
};

export default TabWrapper;
