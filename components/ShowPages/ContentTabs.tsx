import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { SOLEIL, COLORS } from 'const/ui-constants';

type ContentTabsProps = {
  tabsArr: any[];
  contentArr: any[];
};

const StyledContentTabsWrapper = styled.div`
  margin-bottom: 20px;
  display: grid;
  grid-row-gap: 16px;
  font-family: ${SOLEIL.FONT_STACK};
`;

const StyledContentTabs = styled.div`
  display: grid;
  color: ${COLORS.DAVY_GREY};
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
  cursor: pointer;
  border-bottom: 2px solid;
  padding-bottom: 8px;
  `;
  } else {
    return `
    cursor: pointer;
    `;
  }
});

const StyledContent = styled.div(({ active }) => {
  if (active) {
    return `
    display:block;
    font-size: 15px;
    max-width: 776px;
    h2{
      margin: 16px 0px;
      font-size: 16px;
    }
    img {
      width: 100%;
      max-width: 100%;
    }
    a {
      color: #ec1943;
    }
    @media (max-width: 768px) {
      width:100%;
    }
  `;
  } else {
    return `
    display:none;
    `;
  }
});

const ContentTabs: React.FC<ContentTabsProps> = ({ tabsArr, contentArr }) => {
  const defaultTab = contentArr.find((tab) => tab.default_tab == 'Yes');
  const defaultTabName = defaultTab ? defaultTab.tab_name : '';
  const [activeTabName, setActiveTab] = useState(defaultTabName);

  useEffect(() => {
    const defaultTab = contentArr.find((tab) => tab.default_tab == 'Yes');
    const defaultTabName = defaultTab ? defaultTab.tab_name : '';
    if (defaultTabName === '') {
      setActiveTab(tabsArr[0]);
    } else {
      setActiveTab(defaultTabName);
    }
  }, [tabsArr, contentArr]);

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
        return (
          <StyledContent
            key={index}
            {...(activeTabName === content.tab_name && { active: true })}
          >
            <RichText render={content.tab_content} />
          </StyledContent>
        );
      })}
    </StyledContentTabsWrapper>
  );
};

export default ContentTabs;
