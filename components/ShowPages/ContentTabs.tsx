import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { SOLEIL, COLORS } from 'const/ui-constants';
import { shortCodeSerializer } from 'utils/shortCodes';

type ContentTabsProps = {
  tabsArr: any[];
  contentArr: any[];
};

const StyledContentTabsWrapper = styled.div`
  display: grid;
  grid-row-gap: 10px;
  margin-bottom: 48px;
  font-family: ${SOLEIL.FONT_STACK};
`;

const StyledContentTabs = styled.div`
  display: grid;
  color: ${COLORS.DAVY_GREY};
  grid-auto-flow: column;
  font-size: 18px;
  grid-column-gap: 40px;
  border-bottom: 1px solid #ebebeb;
  justify-content: left;

  @media (max-width: 768px) {
    overflow-x: scroll;
  }
`;

const StyledTab = styled.h3(({ active }) => {
  return `
  ${active ? `color: #ec1943;` : ``}
  cursor: pointer;
  ${active ? `border-bottom: 2px solid;` : ``}
  padding-bottom: 8px;
  font-size: 18px;
  line-height: 24px;
  height: min-content;
  margin: 0;
  font-weight: 600;
  `;
});

const StyledContent = styled.div(({ active }) => {
  if (active) {
    return `
    display:block;
    font-size: 15px;
    max-width: 776px;
    line-height: 24px;

    h2{
      margin: 32px 0px 16px;
      font-size: 16px;
      line-height: 20px;
      color: #666666;
    }
    p{
      margin: 16px 0 0;
    }
    img {
      width: 100%;
      max-width: 100%;
    }
    a {
      color: #ec1943;
    }
    ul{
      padding: 0;
    }
    li {
      list-style-position: inside;
      padding-left: 1.5rem;
      text-indent: -1.5em;
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
            <RichText
              render={content.tab_content}
              htmlSerializer={shortCodeSerializer}
            />
          </StyledContent>
        );
      })}
    </StyledContentTabsWrapper>
  );
};

export default ContentTabs;
