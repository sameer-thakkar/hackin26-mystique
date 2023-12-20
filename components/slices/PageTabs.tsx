import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import LinkResolver from '../LinkResolver';

const Tabs = styled.div`
  display: grid;
  grid-column-gap: 40px;
  grid-auto-flow: column;
  justify-content: left;
  margin: auto;
  border-bottom: 1px solid ${COLORS.GRAY.G6};
  justify-content: ${({
    // @ts-expect-error TS(2339): Property 'align' does not exist on type 'Pick<Deta... Remove this comment to see the full error message
    align,
  }) => {
    switch (align) {
      case 'center':
        return 'space-around';
      case 'left':
        return 'flex-start';
      case 'right':
        return 'flex-end';
      default:
        break;
    }
  }};

  .navigation-tab {
    color: ${COLORS.GRAY.G2};
    padding-bottom: 16px;
    ${expandFontToken('Heading/Regular')}
  }

  .selected-nav-tab {
    border-bottom: 2px solid ${COLORS.TEXT.PURPS_3};
    border-radius: 1px;
    color: ${COLORS.TEXT.PURPS_3};
  }
  @media (max-width: 768px) {
    overflow: scroll;
    margin: 0 -16px;
    justify-content: left;
    padding-left: 16px;
    width: calc(100vw - 16px);
    grid-column-gap: 24px;
    grid-auto-columns: max-content;
    align-items: center;

    a {
      width: 100% !important;
      text-align: center;
    }
    .navigation-tab {
      ${expandFontToken('Heading/Product Card')}
    }
    .navigation-tab:last-child {
      margin-right: 16px;
    }
    .selected-nav-tab {
      border-bottom: 2px solid ${COLORS.TEXT.PURPS_3};
    }
    .content-container {
      margin-left: 15px !important;
      margin-right: 15px !important;
    }
  }
`;

type PageTabsProps = {
  tabs: Array<any>;
  align: String;
};

const PageTabs = (props: PageTabsProps) => {
  const { tabs, align } = props;

  return (
    // @ts-expect-error TS(2769): No overload matches this call.
    <Tabs align={align}>
      {tabs.map((tab, index) => (
        <LinkResolver key={index} url={tab.tab_link.url}>
          <div
            className={classNames('navigation-tab', {
              'selected-nav-tab': tab.is_selected_link === 'Yes',
            })}
          >
            {tab.title}
          </div>
        </LinkResolver>
      ))}
    </Tabs>
  );
};

export default PageTabs;
