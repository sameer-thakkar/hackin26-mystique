import React, { useState } from 'react';
import { useAmp } from 'next/amp';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { SOLEIL, COLORS } from '../../constants/ui-constants';

type ContentTabsProps = {
  tabsArr: any[];
  contentArr: any[];
};

const StyledContentTabsWrapper = styled.div`
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
  border-bottom: 2px solid;
  padding-bottom: 8px;
  `;
  } else {
    return `
    cursor: pointer;
    `;
  }
});

const AmpSelectorContainer = styled.div`
  amp-selector [role='tab'][selected] {
    color: #ec1943;
    border-bottom: 2px solid;
    padding-bottom: 8px;
    outline: none;
  }

  amp-selector [role='tabpanel'] {
    display: none;
  }

  amp-selector [role='tabpanel'][selected] {
    outline: none;
    display: block;
  }
`;

const StyledContent = styled.div`
  p {
    margin: 0;
    color: ${COLORS.DAVY_GREY};
  }
  img {
    width: 100%;
    max-width: 100%;
  }
  a {
    color: #ec1943;
  }
`;

/**
 *
 * A tabs component with each tab having rich text as content
 *
 * **All fields marked with a * are mandatory and will break the slice if left blank.**
 *
 * ### Non-repeatable zone
 * - *Tab List
 *  - A comma separated tabs list. eg: Fire, Water, Earth
 *
 * ### Repeatable zone
 * - *Tab Name
 *  - One of the tab names specified in the 'Tab List'
 * - Default Open Tab
 *  - Displays the tab by default when the page loads
 *  - Only select this as 'Yes' for one of the tabs
 * - *Tab Content
 *  - Rich Text field
 *
 */

const ContentTabs: React.FC<ContentTabsProps> = ({ tabsArr, contentArr }) => {
  const defaultTab = contentArr.find((tab) => tab.default_tab == 'Yes');
  const defaultTabName = defaultTab ? defaultTab.tab_name : '';
  const [activeTabName, setActiveTab] = useState(defaultTabName);
  const isAmp = useAmp();
  return isAmp ? (
    <AmpSelectorContainer>
      <amp-selector
        className="tabs-with-selector"
        role="tablist"
        on="select:contentTabPanel.toggle(index=event.targetOption, value=true)"
        keyboard-select-mode="focus"
      >
        <StyledContentTabs>
          {tabsArr.map((tab, index) => {
            return (
              <div
                key={index}
                role="tab"
                className="tab-heading"
                // @ts-ignore
                option={`${index}`}
                selected={index === 0}
              >
                {tab}
              </div>
            );
          })}
        </StyledContentTabs>
      </amp-selector>
      <amp-selector id="contentTabPanel">
        {contentArr.map((content, index) => {
          return (
            <div
              key={index}
              role="tabpanel"
              // @ts-ignore
              option={`${index}`}
              selected={index === 0}
            >
              <RichText render={content.tab_content} />
            </div>
          );
        })}
      </amp-selector>
    </AmpSelectorContainer>
  ) : (
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
