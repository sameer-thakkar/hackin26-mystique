import { useEffect, useContext, useState } from 'react';
import styled from 'styled-components';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SortSelector } from 'components/MicrositeV2/SortSelector';
import InteractionContext from 'contexts/Interaction';
import Conditional from 'components/common/Conditional';

import LinkResolver from '../LinkResolver';

const Tabs = styled.div`
  display: grid;
  grid-auto-flow: column;

  .tabs {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 12px;
    justify-content: left;
    overflow: scroll;
    -ms-overflow-style: none; //IE 10+
    scrollbar-width: none; //Firefox
    ::-webkit-scrollbar {
      display: none; // Safari, Chrome
    }
  }

  .navigation-tab {
    padding: 8px 12px;
    background: ${COLORS.BRAND.WHITE};
    border: 1px solid ${COLORS.GRAY.G6};
    border-radius: 4px;
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
  }

  .selected-nav-tab {
    background: #f3e9ff;
    color: ${COLORS.PURPS};
    justify-content: right;
  }

  .sort-wrapper {
    justify-self: right;
    padding-top: 8px;
    margin-left: 10px;
  }

  @media (max-width: 768px) {
    grid-column-gap: 8px;

    .tab-link:first-of-type {
      padding-left: 16px;
    }

    .tab-link:last-of-type {
      padding-right: 16px;
    }

    .navigation-tab {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
      white-space: nowrap;
    }
  }
`;

type MonthTabsProps = {
  tabs: Array<any>;
  categories: Array<{ id: any; name: any; rank: any; ranking: any }>;
  hideSortBySelector: boolean;
  isMobile: boolean;
};

const MonthTabs = (props: MonthTabsProps) => {
  const { tabs, categories, hideSortBySelector, isMobile } = props;

  const interactionContext = useContext(InteractionContext);
  // @ts-expect-error TS(2339): Property 'changeCategory' does not exist on type '... Remove this comment to see the full error message
  const { changeCategory } = interactionContext || {};

  const [filterDropdownActive, setFilterDropdownActive] = useState(false);

  useEffect(() => {
    const tgidArray = categories[0].ranking.popularity;
    changeCategory(tgidArray, 0);
  }, []);

  const toggleFilterDropdown = (dropdownState: any) => {
    setFilterDropdownActive((oldState) =>
      typeof dropdownState !== 'undefined' ? dropdownState : !oldState
    );
  };

  const changeOrder = (orderKey: any) => {
    changeCategory(categories[0].ranking[orderKey], 0);
  };

  return (
    <Tabs>
      <div className="tabs">
        {tabs?.map((tab, index) => (
          <LinkResolver key={index} url={tab.tab_link.url} className="tab-link">
            <div
              className={classNames('navigation-tab', {
                'selected-nav-tab': tab.is_selected_link === 'Yes',
              })}
            >
              {tab.title}
            </div>
          </LinkResolver>
        ))}
      </div>
      <Conditional if={!hideSortBySelector && !isMobile}>
        <div className="sort-wrapper">
          <SortSelector
            isFilterDropdownActive={filterDropdownActive}
            toggleFilterDropdown={toggleFilterDropdown}
            changeOrder={changeOrder}
            isEntertainmentMb={true}
          />
        </div>
      </Conditional>
    </Tabs>
  );
};

export default MonthTabs;
