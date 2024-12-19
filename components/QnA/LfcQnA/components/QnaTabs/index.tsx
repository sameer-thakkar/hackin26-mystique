import { StyledQnaTabsWrapper, StyledTabBlock } from './styles';
import { TQnaTabs } from './types';

const QnaTabs = ({ activeTabIndex, handleTabClickFn, tabsArray }: TQnaTabs) => {
  return (
    <StyledQnaTabsWrapper currentActiveTabIndex={activeTabIndex}>
      {tabsArray.map((tabLabel, tabIndex) => (
        <StyledTabBlock
          onClick={() => handleTabClickFn(tabIndex)}
          key={tabIndex}
          isActive={tabIndex === activeTabIndex}
        >
          {tabLabel}
        </StyledTabBlock>
      ))}
      <div className="tab-underline"></div>
    </StyledQnaTabsWrapper>
  );
};

export default QnaTabs;
