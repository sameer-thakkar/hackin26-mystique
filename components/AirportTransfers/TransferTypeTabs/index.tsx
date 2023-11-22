import { strings } from 'const/strings';
import { StyledContainer, StyledTabsContainer, Tab } from './styles';

export const TransferTypeTabs = ({
  onTabClick,
  activeTab,
  setActiveTab,
  tabOrder,
}: {
  activeTab: 'private' | 'shared';
  setActiveTab: (tab: 'private' | 'shared') => void;
  onTabClick: (tab: 'private' | 'shared') => void;
  tabOrder: readonly ['shared', 'private'] | readonly ['private', 'shared'];
}) => {
  return (
    <StyledContainer>
      <StyledTabsContainer
        $activeTab={tabOrder[0] === activeTab ? 'first' : 'second'}
      >
        {tabOrder.map((tab) => {
          return (
            <Tab
              $isActive={activeTab === tab}
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                onTabClick(tab);
              }}
            >
              {tab === 'private'
                ? strings.AIRPORT_TRANSFER.PRIVATE_TRANSFERS
                : strings.AIRPORT_TRANSFER.SHARED_TRANSFERS}
            </Tab>
          );
        })}
      </StyledTabsContainer>
    </StyledContainer>
  );
};
