import React, { FC, ReactNode } from 'react';
import { useProductCard } from 'contexts/productCardContext';
import { SWIPESHEET_STATES } from 'const/productCard';
import {
  Header,
  Tab as StyledTab,
  TabContainer as StyledTabContainer,
} from './styles';

interface TabProps {
  isActive: boolean;
  onClick: () => void;
  id: string;
  className?: string;
  isLastElement?: boolean;
}

interface TabComponentProps extends TabProps {
  children: ReactNode;
}

interface TabData {
  heading: string;
  contents: RichTextField;
}

interface TabContainerProps {
  tabs: TabData[];
  activeTab: string;
  onTabClick: (tabHeading: string, index: number) => void;
  ref: any;
}

const Tab: FC<TabComponentProps> = ({
  isActive,
  onClick,
  id,
  className,
  children,
  isLastElement,
}) => (
  <StyledTab
    onClick={onClick}
    id={id}
    className={className}
    $isLastElement={isLastElement}
    $isActive={isActive}
  >
    {children}
  </StyledTab>
);

const TabContainer: FC<TabContainerProps> = React.forwardRef<
  HTMLDivElement,
  TabContainerProps
>(({ tabs, activeTab, onTabClick }, ref) => {
  const { drawerState } = useProductCard();
  return (
    <Header>
      <StyledTabContainer
        ref={ref}
        $isOpen={drawerState === SWIPESHEET_STATES.OPEN}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={tab.heading}
            isActive={tab.heading === activeTab}
            onClick={() => onTabClick(tab.heading, index)}
            id={`tab-${tab.heading}`}
            isLastElement={index === tabs.length - 1}
          >
            {tab.heading}
          </Tab>
        ))}
      </StyledTabContainer>
    </Header>
  );
});

TabContainer.displayName = 'TabContainer';

export default TabContainer;
