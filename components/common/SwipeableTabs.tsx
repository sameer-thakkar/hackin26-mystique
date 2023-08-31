import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { debounce } from 'utils/gen';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';

const TabWrapper = styled.div`
  display: grid;
  width: auto;
  row-gap: 20px;
  @media (max-width: 768px) {
    row-gap: 16px;
    overflow: hidden;
    width: unset;
  }
`;

const SubHeadingLarge = styled.div`
  width: max-content;
  ${expandFontToken('UI/Label Large')}
`;

export const TabControl = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: left;
  column-gap: 12px;
  border-bottom: 1px solid ${COLORS.GRAY.G6};
  @media (min-width: 768px) {
    column-gap: 24px;
  }
`;

export const Tab = styled(SubHeadingLarge)`
  padding-bottom: 12px;
  border-bottom: 2px solid;

  ${({
    // @ts-expect-error TS(2339): Property 'active' does not exist on type 'Pick<Det... Remove this comment to see the full error message
    active,
  }) =>
    active ? `color: ${COLORS.TEXT.PURPS_3};` : ` border-color: transparent;`};
  transform: translateY(1px);
  cursor: pointer;
`;

export const Panel = styled.div`
  display: ${({
    // @ts-expect-error TS(2339): Property 'active' does not exist on type 'Pick<Det... Remove this comment to see the full error message
    active,
  }) => (active ? 'block' : 'none')};
`;

interface TabProps {
  tabs: Array<{ header: any; body: any; trackingLabel?: string }>;
  defaultActiveIndex?: number;
  isCollectionCard?: boolean;
  onTabView?: Function;
}

const SWIPE_THRESHOLD = 50;

const SwipeableTabs: FunctionComponent<TabProps> = ({
  tabs,
  defaultActiveIndex = 0,
  isCollectionCard = false,
  onTabView = null,
}) => {
  const swipeRef = useRef({
    touchStartX: 0,
    touchEndX: 0,
    touchStartY: 0,
    touchEndY: 0,
    eventAttached: false,
    activeTab: defaultActiveIndex,
  });
  const [activeTab, setTab] = useState(defaultActiveIndex);

  useEffect(() => {
    swipeRef.current.activeTab = activeTab;
    if (onTabView)
      onTabView({
        index: activeTab,
        trackingLabel: tabs[activeTab].trackingLabel,
      });
  }, [activeTab]);

  useEffect(() => {
    const onSwipeStart = debounce((e: any) => {
      swipeRef.current.touchStartX = e.changedTouches[0].screenX;
      swipeRef.current.touchStartY = e.changedTouches[0].screenY;
    }, 250);

    const onSwipeEnd = debounce((e: any) => {
      swipeRef.current.touchEndX = e.changedTouches[0].screenX;
      swipeRef.current.touchEndY = e.changedTouches[0].screenY;
      const {
        touchEndX,
        touchStartX,
        activeTab,
        touchStartY,
        touchEndY,
      } = swipeRef.current;
      const horizontalDelta = touchStartX - touchEndX;
      const verticalDelta = touchStartY - touchEndY;
      if (
        Math.abs(horizontalDelta) > SWIPE_THRESHOLD &&
        Math.abs(verticalDelta) < SWIPE_THRESHOLD
      ) {
        const isSwipeLeft = horizontalDelta > 0;
        const len = tabs.length;
        if (!isSwipeLeft) {
          const newTabIndex = (activeTab - 1) % len;
          setTab(newTabIndex < 0 ? len - 1 : newTabIndex);
        } else setTab((activeTab + 1) % len);
      }
    }, 250);

    window.addEventListener('touchstart', onSwipeStart);
    window.addEventListener('touchend', onSwipeEnd);

    return () => {
      window.removeEventListener('touchstart', onSwipeStart);
      window.removeEventListener('touchEnd', onSwipeEnd);
    };
  }, []);

  return (
    <TabWrapper>
      <TabControl>
        {tabs.map((tab, index) => (
          <Tab
            // @ts-expect-error TS(2769): No overload matches this call.
            active={index === activeTab}
            key={`tab${index + 1}`}
            onClick={() => setTab(index)}
          >
            {tab.header}
          </Tab>
        ))}
      </TabControl>
      <div>
        {tabs.map((tab, index) => (
          <Panel
            // @ts-expect-error TS(2769): No overload matches this call.
            active={index === activeTab}
            key={index}
            isCollectionCard={isCollectionCard}
          >
            {tab.body}
          </Panel>
        ))}
      </div>
    </TabWrapper>
  );
};

export default SwipeableTabs;
