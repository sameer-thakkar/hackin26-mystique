import {
  Children,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Swiper as TSwiper } from 'swiper/types';
import Swiper, { ISwiperWrapper } from 'components/Swiper';
import type {
  TTabActiveMarker,
  TTabListItemProps,
  TTabPanelProps,
  TTabsProps,
} from 'UI/Tabs/interface';
import { StyledTabsContainer } from 'UI/Tabs/styles';
import { useSwiperArrows } from 'hooks/useSwiper';
import { isMobile } from 'utils/helper';
import { LeftArrowSvg } from 'assets/leftArrowSvg';
import { RightArrowSvg } from 'assets/rightArrowSvg';
import Conditional from '../../common/Conditional';

/*
 * @component
 * @name Tabs
 * @example
 *
 * Controlled
 *
 * <Tabs activeTab="Tab 1" tabListItems={['Tab 1', 'Tab 2']} onChangeTab={(tab) => handleChangeTab(tab)} />
 *
 * Uncontrolled
 *
 * <Tabs>
 *  <Tabs.Panel value='1'>Content For Tab 1</Tabs.Panel>
 *  <Tabs.Panel value='2'>Content For Tab 2</Tabs.Panel>
 * </Tabs>
 * */
const Tabs = ({
  tabListItems: tabListItemsFromProps,
  activeTab: activeTabFromProps,
  onChangeTab,
  children,
  autoFocusOnSelectedTab,
  hideNavigationArrows,
  tabContainerWidth = '100%',
  markerLeftOffset = 0,
}: PropsWithChildren<TTabsProps>) => {
  const isDesktop = !isMobile();
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<TSwiper | null>(null);
  const { showRightArrow, showLeftArrow, onSlideChange } = useSwiperArrows();
  const tabListItems: TTabListItemProps[] = tabListItemsFromProps
    ? tabListItemsFromProps
    : Children.toArray(children)
        .map((child) => (child as ReactElement)?.props?.value)
        .filter((item) => item)
        .map((item) => ({
          label: item,
          id: item,
        }));

  const [activeTab, setActiveTab] = useState(
    activeTabFromProps ?? tabListItems[0].id
  );
  const [activeTabMarkerMeta, setActiveTabMarkerMeta] =
    useState<TTabActiveMarker>({
      left: '0',
      width: '0',
    });
  const sectionGap = 24;

  const handleTabClick = (tab: TTabListItemProps) => {
    setActiveTab(tab.id);
    if (autoFocusOnSelectedTab) {
      const idx = tabListItems.findIndex((item) => tab.id === item.id);
      if (idx >= 0) {
        swiperRef.current?.slideTo(idx);
      }
    }

    onChangeTab?.(tab);
  };

  const calculateLeftOffset = (
    listItems: HTMLDivElement[],
    activeIndex: number
  ) => {
    return listItems.slice(0, activeIndex).reduce((total, current) => {
      const tabWidth = current.getBoundingClientRect().width;
      return total + tabWidth;
    }, 0);
  };

  const calculateGap = (sectionTabGap: number, activeIndex: number) =>
    sectionTabGap * activeIndex;

  const calculateActiveTabMarkerPosition = (tab: string) => {
    const tabIndex = tabListItems.findIndex(({ id }) => id === tab);

    if (tabIndex >= 0 && typeof window !== 'undefined') {
      const tabItems = Array.from(
        tabsContainerRef.current?.querySelectorAll('.tab-list-item') ?? []
      );

      if (tabItems.length) {
        const leftOffset = calculateLeftOffset(
          tabItems as HTMLDivElement[],
          tabIndex
        );
        const gap = calculateGap(sectionGap, tabIndex);
        const activeTab = tabItems[tabIndex];
        const activeTabWidth = activeTab.clientWidth;
        setActiveTabMarkerMeta({
          left: `${leftOffset + gap + markerLeftOffset}px`,
          width: `${activeTabWidth}px`,
        });
      }
    }
  };

  const memoizedCalculateActiveTabMarkerPosition = useMemo(
    () => calculateActiveTabMarkerPosition,
    [tabListItems]
  );

  useEffect(() => {
    if (activeTab) {
      memoizedCalculateActiveTabMarkerPosition(activeTab);
    }
  }, [activeTab, memoizedCalculateActiveTabMarkerPosition]);

  useEffect(() => {
    if (!swiperRef?.current) return;

    onSlideChange(swiperRef.current);
  }, [tabListItems]);

  const { left, width } = activeTabMarkerMeta;

  const swiperSettings: Partial<ISwiperWrapper> = {
    isFreeMode: true,
    slidesPerView: 'auto',
    spaceBetween: 0,
    onSwiper: (swiper) => {
      swiperRef.current = swiper;
      onSlideChange(swiper);
    },
    onSlideChange,
    allowTouchMove: !isDesktop,
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <StyledTabsContainer
      $markerLeft={left}
      $markerWidth={width}
      $showLeftArrow={showLeftArrow}
      $showRightArrow={showRightArrow}
      $tabContainerWidth={tabContainerWidth}
    >
      <div
        className="tab-list-container"
        id="tab-list-container"
        ref={tabsContainerRef}
      >
        <Swiper className="tab-swiper-wrapper" {...swiperSettings}>
          {tabListItems.map((tabItem, index) => (
            <button
              className={'tab-list-item'}
              key={`tab-item-${index}`}
              id={`tab-item-${tabItem.id}`.replace(/ /g, '_')}
              onClick={() => handleTabClick(tabItem)}
            >
              <span className="tab-list-item-title">{tabItem.label}</span>
            </button>
          ))}
        </Swiper>
        <Conditional if={!hideNavigationArrows}>
          <button
            className="tab-list-gradient prev"
            onClick={handlePrev}
          ></button>
          <button
            className="tab-list-gradient next"
            onClick={handleNext}
          ></button>
          <Conditional if={showLeftArrow}>
            <button className={'tab-swiper-controls prev'} onClick={handlePrev}>
              <LeftArrowSvg />
            </button>
          </Conditional>
          <Conditional if={showRightArrow}>
            <button className={'tab-swiper-controls next'} onClick={handleNext}>
              <RightArrowSvg />
            </button>
          </Conditional>
        </Conditional>
      </div>
      {Children.map(children, (child) => {
        return (
          <Conditional if={(child as ReactElement)?.props?.value === activeTab}>
            {child}
          </Conditional>
        );
      })}
    </StyledTabsContainer>
  );
};

const TabPanel = ({ value, children }: PropsWithChildren<TTabPanelProps>) => {
  return <div id={`tab-panel-${value}`.replace(/ /g, '_')}>{children}</div>;
};

Tabs.Panel = TabPanel;

export default Tabs;
