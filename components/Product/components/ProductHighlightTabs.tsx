import { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import dynamic from 'next/dynamic';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { useWindowWidth } from '@react-hook/window-size';
import SwiperType from 'swiper';
import type { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import { TProductHighlightTabs } from 'components/Product/interface';
import {
  HighlightTabsWrapper,
  richtextElements,
  SwiperControls,
  Tab,
  TabPanel,
  TabsWrapper,
} from 'components/Product/styles';
import { CHEVRON_RIGHT_CIRCLE } from 'assets/SvgIcons';

const Swiper = dynamic(() =>
  import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const swiperParams: SwiperProps = {
  slidesPerView: 'auto',
  spaceBetween: 0,
};

export const HighlightTabs = ({
  tabs = [],
  hasRegularHighlights = false,
  onTabChange,
  pageType,
  activeTabIndex,
  showCard,
  isLoading = false,
  className,
}: TProductHighlightTabs) => {
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(false);
  const [swiper, updateSwiper] = useState<SwiperType | undefined | null>(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const updateIndex = useCallback(() => {
    if (isMobile || !swiper) {
      return;
    }
    updateCurrentIndex(swiper?.realIndex);
  }, [swiper, isMobile]);

  const updateSliderPosition = useCallback(() => {
    if (!swiper) return;
    setIsBeginning(swiper?.isBeginning);
    setIsEnd(swiper?.isEnd);
  }, [swiper]);

  useEffect(() => {
    swiper && updateSliderPosition();
  }, [swiper]);

  useEffect(() => {
    setIsMobile(width <= 768);
  }, [width, setIsMobile]);

  const goNext = () => {
    if (swiper !== null) {
      swiper?.slideNext();
      updateSliderPosition();
    }
  };

  const goPrev = () => {
    if (swiper !== null) {
      swiper?.slidePrev();
      updateSliderPosition();
    }
  };

  useEffect(() => {
    onTabChange({ tab: tabs[0], index: 0, defaultSelection: true });
  }, []);

  const trackedTabChange = (index: number) => {
    onTabChange({ tab: tabs[index], index });
  };

  return (
    <Conditional if={showCard}>
      <HighlightTabsWrapper
        className={className}
        hasRegularHighlights={hasRegularHighlights}
      >
        <TabsWrapper
          onClick={(e) => e.stopPropagation()}
          className="tabs-wrapper"
        >
          <Swiper
            {...swiperParams}
            onSwiper={updateSwiper}
            onSlideChange={updateIndex}
          >
            {tabs.map((tab: any, index: number) => (
              <Tab
                className={`tab ${activeTabIndex == index ? 'active' : ''}`}
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  trackedTabChange(index);
                }}
              >
                {tab.heading}
              </Tab>
            ))}
          </Swiper>
          <SwiperControls>
            <Conditional if={!isBeginning}>
              <div
                className="prev-slide"
                tabIndex={0}
                onClick={goPrev}
                role="button"
              >
                {CHEVRON_RIGHT_CIRCLE}
              </div>
            </Conditional>
            <Conditional if={!isEnd}>
              <div
                className="next-slide"
                tabIndex={0}
                onClick={goNext}
                role="button"
              >
                {CHEVRON_RIGHT_CIRCLE}
              </div>
            </Conditional>
          </SwiperControls>
        </TabsWrapper>
        <div>
          {tabs.map((tab: any, index: number) => (
            <TabPanel
              isActive={activeTabIndex == index}
              key={index}
              pageType={pageType}
              className="tab-panel"
            >
              <Conditional if={!isLoading}>
                <RichText render={tab.contents} elements={richtextElements} />
              </Conditional>
              <Conditional if={isLoading}>
                <div>
                  <Skeleton height="0.9375rem" borderRadius={2} />
                  <Skeleton height="0.9375rem" width="60%" borderRadius={2} />
                </div>
                <div>
                  <Skeleton height="0.9375rem" borderRadius={2} />
                  <Skeleton height="0.9375rem" width="60%" borderRadius={2} />
                </div>
                <div>
                  <Skeleton height="0.9375rem" borderRadius={2} />
                  <Skeleton height="0.9375rem" width="60%" borderRadius={2} />
                </div>
              </Conditional>
            </TabPanel>
          ))}
        </div>
      </HighlightTabsWrapper>
    </Conditional>
  );
};
