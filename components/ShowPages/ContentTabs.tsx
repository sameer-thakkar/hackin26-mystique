import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { PrismicRichText } from '@prismicio/react';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { shortCodeSerializer } from 'utils/shortCodes';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { expandFontToken } from 'const/typography';

type ContentTabsProps = {
  tabsArr: any[];
  contentArr: any[];
};

const StyledContentTabsWrapper = styled.div`
  display: grid;
  grid-row-gap: 10px;
  margin-bottom: 48px;
`;

const StyledContentTabs = styled.div`
  display: grid;
  color: ${COLORS.GRAY.G2};
  grid-auto-flow: column;
  grid-column-gap: 40px;
  border-bottom: 1px solid ${COLORS.GRAY.G6};
  justify-content: left;

  @media (max-width: 768px) {
    overflow-x: scroll;
  }
`;

// @ts-expect-error TS(2339): Property 'active' does not exist on type 'Pick<Det... Remove this comment to see the full error message
const StyledTab = styled.h3(({ active }) => {
  return `
  ${active ? `color: ${COLORS.TEXT.PURPS_3};` : ``}
  cursor: pointer;
  ${active ? `border-bottom: 2px solid;` : ``}
  padding-bottom: 12px;
  ${expandFontToken('Heading/Regular')}
  height: min-content;
  margin: 0;
  `;
});

// @ts-expect-error TS(2339): Property 'active' does not exist on type 'Pick<Det... Remove this comment to see the full error message
const StyledContent = styled.div(({ active }) => {
  if (active) {
    return `
    display:block;
    ${expandFontToken('Paragraph/Large')}
    max-width: 792px;

    h2{
      margin: 32px 0px 16px;
      ${expandFontToken('Heading/Small')}
    }
    p{
      margin: 16px 0 0;
    }
    img {
      width: 100%;
      max-width: 100%;
    }
    a {
      color: ${COLORS.BRAND.PURPS};
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
  const pageMetaData = useRecoilValue(metaAtom);

  useEffect(() => {
    const defaultTab = contentArr.find((tab) => tab.default_tab == 'Yes');
    const defaultTabName = defaultTab ? defaultTab.tab_name : '';
    if (defaultTabName === '') {
      setActiveTab(tabsArr[0]);
    } else {
      setActiveTab(defaultTabName);
    }
  }, [tabsArr, contentArr]);

  const trackTabClick = ({ tab, index }: any) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.INFO_TAB_CLICKED,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      [ANALYTICS_PROPERTIES.INFO_HEADING]: tab,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Standalone',
      [ANALYTICS_PROPERTIES.SECTION]: 'Longform Content',
      ...getCommonEventMetaData(pageMetaData),
    });
  };

  return (
    <StyledContentTabsWrapper>
      <StyledContentTabs>
        {tabsArr.map((tab, index) => {
          return (
            <StyledTab
              key={index}
              {...(activeTabName === tab && { active: true })}
              onClick={() => {
                trackTabClick({ tab, index });
                setActiveTab(tab);
              }}
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
