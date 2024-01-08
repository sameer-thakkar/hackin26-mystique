import React, { useEffect, useRef, useState } from 'react';
import { TScrollableTabsProps } from 'components/UI/ScrollableTabs/interface';
import {
  ChildWrapper,
  ScrollableTabsContentWrapper,
  ScrollableTabsWrapper,
  TabName,
  TabNames,
  TabNamesWrapper,
} from 'components/UI/ScrollableTabs/style';

const ScrollableTabs = ({
  tabNames,
  children,
  isMobile,
  onClickCallback,
}: TScrollableTabsProps) => {
  const [activeTabName, setActiveTabName] = useState(tabNames[0]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const observerResetTimeoutId = useRef<NodeJS.Timeout>();
  const capitalize = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1);

  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      for (let i = entries.length - 1; i >= 0; i--) {
        const entry = entries[i];
        const element = entry.target as HTMLElement;
        const elementHeight = element.offsetHeight;
        const viewportHeight = window.innerHeight;
        const elementTop = entry.boundingClientRect.top;
        const elementBottom = entry.boundingClientRect.bottom;
        const percentageVisible =
          ((Math.min(elementBottom, viewportHeight) - Math.max(elementTop, 0)) /
            elementHeight) *
          100;
        if (percentageVisible >= 25 && entry.isIntersecting) {
          setActiveTabName(entry.target.id.split('-')[0]);
          break;
        }
      }
    }, observerOptions);
    observerRef.current = observer;

    tabNames.forEach((tabName) => {
      const element = document.getElementById(`${tabName}-scrollable-section`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [tabNames.length]);

  const reconnectObserverOnScroll = () => {
    reconnectObserver(0);
  };

  const reconnectObserver = (timeout: number = 1500) => {
    observerResetTimeoutId.current = setTimeout(() => {
      tabNames.forEach((tabName) => {
        const element = document.getElementById(
          `${tabName}-scrollable-section`
        );
        if (element) {
          observerRef.current?.observe?.(element);
        }
      });
      window.removeEventListener('scroll', reconnectObserverOnScroll);
    }, timeout);
  };

  useEffect(() => {
    const ageSuitabilitySection = document.getElementById('age-suitability');
    const disconnectObserverOnJump = () => {
      observerRef.current?.disconnect();
      setTimeout(() => {
        window.addEventListener('scroll', reconnectObserverOnScroll);
      }, 1000);
    };
    if (ageSuitabilitySection) {
      ageSuitabilitySection.addEventListener('click', disconnectObserverOnJump);
    }

    return () => {
      ageSuitabilitySection?.removeEventListener(
        'click',
        disconnectObserverOnJump
      );
    };
  }, []);

  const onTabNameClicked = (tabName: string, index: number) => {
    onClickCallback?.(tabName, index);
    if (observerResetTimeoutId.current) {
      clearTimeout(observerResetTimeoutId.current);
    }

    const selectedTabChild = document.getElementById(
      `${tabName}-scrollable-section`
    );

    if (!selectedTabChild) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    setActiveTabName(tabName);
    window.scrollTo({
      top:
        (selectedTabChild?.getBoundingClientRect().top ?? 0) +
        window.scrollY -
        (isMobile ? 62 + 16 + 33 + 24 : 80 + 24 + 38 + 32),
      /**
       * The values being added are:
       * header height + header bottom margin + tabs height + tabs bottom margin
       */
      behavior: 'smooth',
    });
    reconnectObserver();
  };

  useEffect(() => {
    const tabElement = document.getElementById(`${activeTabName}-tab-name`);
    const wrapper = document.getElementById('tab-names-wrapper');

    if (tabElement) {
      if (activeTabName === tabNames[0]) {
        wrapper?.scrollBy({
          left: -wrapper?.scrollWidth,
          behavior: 'smooth',
        });
      } else if (activeTabName === tabNames[tabNames?.length - 1]) {
        wrapper?.scrollBy({
          left: wrapper?.scrollWidth,
          behavior: 'smooth',
        });
      }
    }
  }, [activeTabName]);

  return (
    <ScrollableTabsWrapper>
      <TabNamesWrapper id="tab-names-wrapper">
        <TabNames>
          {tabNames.map((tabName, index) => (
            <TabName
              $isActive={tabName === activeTabName}
              key={tabName}
              onClick={() => onTabNameClicked(tabName, index)}
              id={`${tabName}-tab-name`}
              className="tab-name"
            >
              {capitalize(tabName)}
            </TabName>
          ))}
        </TabNames>
      </TabNamesWrapper>
      <ScrollableTabsContentWrapper>
        {children?.map?.((child, index) => (
          <ChildWrapper
            id={`${tabNames[index]}-scrollable-section`}
            key={index}
          >
            {child}
          </ChildWrapper>
        ))}
      </ScrollableTabsContentWrapper>
    </ScrollableTabsWrapper>
  );
};

export default ScrollableTabs;
