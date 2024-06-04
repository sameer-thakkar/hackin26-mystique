import { useEffect, useRef } from 'react';
import { trackEvent } from 'utils/analytics';
import { throttle } from 'utils/gen';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { TAirportTabsProps } from './interface';
import { Tab, TabsContainer } from './style';

export const AirportTabs = ({
  airportsList,
  selectedAirport,
  setSelectedAirport,
  isMobile,
}: TAirportTabsProps) => {
  const tabContainerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    // track sticky
    const tabContainer = tabContainerRef.current;

    let left = tabContainer?.getBoundingClientRect().x;

    if (!tabContainer) return;

    const listener = () => {
      const stickyTop = isMobile ? 56 : 44;

      const currentTop = tabContainer.getBoundingClientRect().top;

      const isSticky = currentTop <= stickyTop;

      tabContainer.classList.toggle('sticky', isSticky);

      if (isSticky && !isMobile) {
        tabContainer.style.marginInline = `-${left}px`;
        tabContainer.style.paddingInline = `${left}px`;
      } else {
        if (!isMobile) {
          tabContainer.style.paddingInline = '0';
          tabContainer.style.marginInline = '0';
        }
      }
    };

    const onResize = () => {
      left = tabContainer?.getBoundingClientRect().x;
      listener();
    };

    const throttledListener = throttle(listener, 100);

    window.addEventListener('scroll', throttledListener);

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', throttledListener);
      window.removeEventListener('resize', onResize);
    };
  }, [isMobile]);

  useEffect(() => {
    const activeTab = tabRefs.current.find((tab) =>
      tab?.classList.contains('active')
    );

    if (activeTab) {
      scrollParentToChildInline(tabContainerRef.current!, activeTab);
    }
  }, [selectedAirport]);

  const handleTabClick = (airport: string, index: number) => {
    setSelectedAirport(airport);

    const tab = tabRefs.current[index];

    if (tab && tab.parentElement) {
      scrollParentToChildInline(tab.parentElement, tab);
    }

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_TAB_CLICKED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.TAB_NAME]: airport,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
    });
  };

  return (
    <TabsContainer ref={tabContainerRef}>
      {airportsList.map((airport, index) => (
        <Tab
          className={airport === selectedAirport ? 'active' : ''}
          key={airport}
          isActive={airport === selectedAirport}
          onClick={() => handleTabClick(airport, index)}
          ref={(el) => tabRefs.current.push(el)}
        >
          {airport}
        </Tab>
      ))}
    </TabsContainer>
  );
};

function scrollParentToChildInline(parent: HTMLElement, child: HTMLElement) {
  const parentRect = parent.getBoundingClientRect();
  const parentViewableArea = {
    height: parent.clientHeight,
    width: parent.clientWidth,
  };

  const childRect = child.getBoundingClientRect();

  const isViewable =
    childRect.left >= parentRect.left &&
    childRect.right <= parentRect.left + parentViewableArea.width;

  const offset = 20;

  if (!isViewable) {
    const scrollLeft = childRect.left - parentRect.left;
    const scrollRight = childRect.right - parentRect.right;
    if (Math.abs(scrollLeft) < Math.abs(scrollRight)) {
      // Near the left of the list
      parent.scrollTo({
        left: parent.scrollLeft + scrollLeft - offset,
        behavior: 'smooth',
      });
    } else {
      // Near the right of the list
      parent.scrollTo({
        left: parent.scrollLeft + scrollRight + offset,
        behavior: 'smooth',
      });
    }
  }
}
