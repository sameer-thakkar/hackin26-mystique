import React, { FC, ReactNode, useEffect, useRef } from 'react';
import Conditional from 'components/common/Conditional';
import { useProductCard } from 'contexts/productCardContext';
import { SWIPESHEET_STATES } from 'const/productCard';
import { strings } from 'const/strings';
import CrossiconSvg from 'assets/crossiconSvg';
import {
  CloseContainer,
  Header,
  HeaderTabs,
  NewTabTag,
  Tab as StyledTab,
  TabContainer as StyledTabContainer,
  Title,
  TitleContainer,
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
  isNew?: boolean;
  type: 'richTextField' | 'itinerary' | 'reviews' | 'nonRichText';
}

interface TabContainerProps {
  tabs: TabData[];
  activeTab: string;
  onTabClick: (tabHeading: string, index: number) => void;
  ref: any;
  hideTitle?: boolean;
}

const Tab: FC<React.PropsWithChildren<TabComponentProps>> = ({
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

const TabContainer: FC<React.PropsWithChildren<TabContainerProps>> =
  React.forwardRef<HTMLDivElement, TabContainerProps>(
    ({ tabs, activeTab, onTabClick, hideTitle = false }, ref) => {
      const { drawerState, title, setHeaderHeight } = useProductCard();
      const headRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (!headRef.current) return;
        setHeaderHeight(headRef.current.clientHeight);
      }, [headRef]);

      useEffect(() => {
        return () => setHeaderHeight(0);
      }, []);

      return (
        <Header>
          <StyledTabContainer
            ref={headRef}
            $isOpen={drawerState === SWIPESHEET_STATES.OPEN}
          >
            <Conditional if={!hideTitle}>
              <TitleContainer>
                <Title>{title}</Title>
                <CloseContainer
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    document.getElementById('bottomsheet-overlay')?.click();
                  }}
                >
                  <CrossiconSvg height={'0.625rem'} width={'0.625rem'} />
                </CloseContainer>
              </TitleContainer>
            </Conditional>
            <HeaderTabs ref={ref}>
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.heading}
                  isActive={tab.heading === activeTab}
                  onClick={() => onTabClick(tab.heading, index)}
                  id={`tab-${tab.heading}`}
                  isLastElement={index === tabs.length - 1}
                >
                  <div className="tab-content">
                    {tab.heading}
                    <Conditional if={tab.isNew}>
                      <NewTabTag>{strings.NEW}</NewTabTag>
                    </Conditional>
                  </div>
                </Tab>
              ))}
            </HeaderTabs>
          </StyledTabContainer>
        </Header>
      );
    }
  );

TabContainer.displayName = 'TabContainer';

export default TabContainer;
