import React, { useState } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { AVENIR } from '../../constants/ui-constants';

type ContentTabsProps = {
  tabsArr: any[];
  contentArr: any[];
};

const StyledContentTabsWrapper = styled.div`
  display: grid;
  grid-row-gap: 16px;
  font-family: ${AVENIR.FONT_STACK};
`;

const StyledContentTabs = styled.div`
  display: grid;
  grid-auto-flow: column;
  font-size: 18px;
  grid-column-gap: 32px;
  border-bottom: 1px solid #ebebeb;
  justify-content: left;
  @media (max-width: 768px) {
    overflow-x: scroll;
  }
`;

const StyledTab = styled.div(({ active }) => {
  if (active) {
    return `
  color: #ec1943;
  border-bottom: 2px solid;
  padding-bottom: 8px;
  `;
  }
});

const StyledContent = styled.div`
  p {
    margin: 0;
  }
  img {
    width: 100%;
    max-width: 100%;
  }
  a {
    color: #ec1943;
  }
`;

const ContentTabs: React.FC<ContentTabsProps> = ({ tabsArr, contentArr }) => {
  const defaultTab = contentArr.find(tab => tab.default_tab == 'Yes');
  const defaultTabName = defaultTab ? defaultTab.tab_name : '';
  const [activeTabName, setActiveTab] = useState(defaultTabName);

  return (
    <StyledContentTabsWrapper>
      <StyledContentTabs>
        {tabsArr.map((tab, index) => {
          return (
            <StyledTab
              key={index}
              {...(activeTabName === tab && { active: true })}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </StyledTab>
          );
        })}
      </StyledContentTabs>
      {contentArr.map((content, index) => {
        if (content.tab_name == activeTabName)
          return (
            <StyledContent key={index}>
              <RichText render={content.tab_content} />
            </StyledContent>
          );
      })}
    </StyledContentTabsWrapper>
  );
};

export default ContentTabs;
