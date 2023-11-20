import { strings } from 'const/strings';
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
          {strings.AIRPORT_TRANSFER.SHARED_TRANSFERS}
        </Tab>

        <Tab
          $isActive={activeTab === 'private'}
          onClick={() => {
            setActiveTab('private');
            onTabClick('private');
          }}
        >
          {strings.AIRPORT_TRANSFER.PRIVATE_TRANSFERS}
        </Tab>
      </StyledTabsContainer>
    </StyledContainer>
  );
};
