import React, { useState } from 'react';
import styled from 'styled-components';
import { PrismicRichText } from '@prismicio/react';
import { shortCodeSerializer } from 'utils/shortCodes';
import COLORS from 'const/colors';
import { HALYARD } from 'const/ui-constants';

type ContentTabsProps = {
  tabsArr: any[];
  contentArr: any[];
};

const StyledContentTabsWrapper = styled.div`
  display: grid;
  grid-row-gap: 16px;
  font-family: ${HALYARD.FONT_STACK};
`;

const StyledContentTabs = styled.div`
  display: grid;
  color: ${COLORS.GRAY.G2};
  grid-auto-flow: column;
  font-size: 18px;
  grid-column-gap: 32px;
  border-bottom: 1px solid #ebebeb;
  justify-content: left;
  @media (max-width: 768px) {
    overflow-x: scroll;
  }
`;

// @ts-expect-error TS(2339): Property 'active' does not exist on type 'Pick<Det... Remove this comment to see the full error message
const StyledTab = styled.div(({ active }) => {
  if (active) {
    return `
  color: ${COLORS.BRAND.PURPS};
  border-bottom: 2px solid;
  padding-bottom: 8px;
  `;
  } else {
    return `
    cursor: pointer;
    `;
  }
});

const StyledContent = styled.div`
  p {
    margin: 0;
    color: ${COLORS.GRAY.G2};
  }
  img {
    width: 100%;
    max-width: 100%;
  }
  a {
    color: ${COLORS.BRAND.PURPS};
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
              <PrismicRichText
                field={content.tab_content}
                components={shortCodeSerializer}
              />
            </StyledContent>
          );
      })}
    </StyledContentTabsWrapper>
  );
};

export default ContentTabs;
