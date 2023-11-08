import { StyledContainer, StyledTabsContainer, Tab } from './styles';

export const TransferTypeTabs = ({
  onTabClick,
  activeTab,
  setActiveTab,
}: {
  activeTab: 'private' | 'shared';
  setActiveTab: (tab: 'private' | 'shared') => void;
  onTabClick: (tab: 'private' | 'shared') => void;
}) => {
  return (
    <StyledContainer>
      <StyledTabsContainer $activeTab={activeTab}>
        <Tab
          $isActive={activeTab === 'shared'}
          onClick={() => {
            setActiveTab('shared');
            onTabClick('shared');
          }}
        >
          Shared transfers
        </Tab>

        <Tab
          $isActive={activeTab === 'private'}
          onClick={() => {
            setActiveTab('private');
            onTabClick('private');
          }}
        >
          Private transfers
        </Tab>
      </StyledTabsContainer>
    </StyledContainer>
  );
};
