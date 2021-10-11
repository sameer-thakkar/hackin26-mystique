import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { COLORS, SOLEIL } from 'const/ui-constants';

const TabWrapper = styled.div`
  display: grid;
  grid-row-gap: 32px;
  max-width: 1200px;
  padding-top: 24px;
  margin: 24px auto 96px auto;
  font-family: ${SOLEIL.FONT_STACK};
  width: calc(100% - (5.46vw * 2));
  @media (max-width: 768px) {
    overflow: hidden;
    padding: 0 16px;
    width: unset;
  }
`;

const SubHeadingLarge = styled.div`
  width: max-content;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  ${({ active }) =>
    active ? `color: ${COLORS.PURPS3};` : `${COLORS.GREY.G2}`};
`;

const TabControl = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: left;
  grid-column-gap: 4rem;
  border-bottom: 1px solid ${COLORS.GREY_G6};
  @media (max-width: 768px) {
    overflow-x: scroll;
  }
`;

const Tab = styled(SubHeadingLarge)`
  padding-bottom: 1rem;
  border-bottom: 2px solid transparent;
  ${({ active }) => (active ? `border-color: ${COLORS.PURPS3};` : ``)};
  transform: translateY(1px);
  cursor: pointer;
`;

const Panel = styled.div`
  display: ${({ active }) => (active ? 'block' : 'none')};
`;

interface TabProps {
  tabs: Array<{ header: any; body: any }>;
  defaultActiveIndex?: number;
  isCollectionCard?: boolean;
}

const Tabs: FunctionComponent<TabProps> = ({
  tabs,
  defaultActiveIndex = 0,
  isCollectionCard = false,
}) => {
  const [activeTab, setTab] = useState(defaultActiveIndex);
  return (
    <TabWrapper>
      <TabControl>
        {tabs.map((tab, index) => (
          <Tab
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

export default Tabs;
