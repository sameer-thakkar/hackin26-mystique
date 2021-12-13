import React from 'react';
import { useAmp } from 'next/amp';
import styled from 'styled-components';
import classNames from 'classnames';
import { SOLEIL, COLORS } from 'const/ui-constants';

import LinkResolver from '../LinkResolver';

const Tabs = styled.div`
  display: grid;
  grid-column-gap: 40px;
  grid-auto-flow: column;
  justify-content: left;
  margin: auto;
  border-bottom: 1px solid #ebebeb;
  justify-content: ${({ align }) => {
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
    font-weight: 500;
    font-family: ${SOLEIL.FONT_STACK};
    color: #444444;
    font-size: 22px;
    line-height: 1.3;
    padding-bottom: 16px;
  }

  .selected-nav-tab {
    border-bottom: 3px solid ${COLORS.PURPS3};
    border-radius: 1px;
    color: ${COLORS.PURPS3};
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
      font-size: 16px;
    }
    .navigation-tab:last-child {
      margin-right: 16px;
    }
    .selected-nav-tab {
      border-bottom: 2px solid ${COLORS.PURPS3};
    }
    .content-container {
      margin-left: 15px !important;
      margin-right: 15px !important;
    }
  }
`;

const AmpSelectorContainer = styled.div`
  amp-selector {
    white-space: nowrap;
    overflow: scroll;
    margin-bottom: 20px;
    width: calc(100vw - 32px);
    display: grid;
    grid-column-gap: 30px;
    grid-template-columns: max-content;
    grid-auto-flow: column;
    margin: auto;
    justify-content: ${({ align }) => {
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
  }
  amp-selector [role='tab'] {
    cursor: pointer;
    padding-bottom: 8px;
    display: block;
    width: 100%;
  }

  .selected,
  amp-selector [role='tab'][selected] {
    color: ${COLORS.PURPS};
    border-bottom: 2px solid;
    outline: none;
  }

  amp-selector [role='tabpanel'] {
    display: none;
  }

  amp-selector [role='tabpanel'][selected] {
    outline: none;
    display: block;
    .tab-item-amp {
      display: block;
    }
  }
`;

type PageTabsProps = {
  tabs: Array<any>;
  align: String;
};

const PageTabs = (props: PageTabsProps) => {
  const { tabs, align } = props;
  const isAmp = useAmp();

  return (
    <>
      {isAmp ? (
        <AmpSelectorContainer align={align}>
          <amp-selector role="tablist" keyboard-select-mode="focus">
            {tabs.map((tab, index) => {
              return (
                <LinkResolver key={index} url={tab.tab_link.url}>
                  <div
                    key={index}
                    role="tab"
                    // @ts-ignore
                    option={`${index}`}
                    selected={tab.is_selected_link === 'Yes'}
                  >
                    {tab.title}
                  </div>
                </LinkResolver>
              );
            })}
          </amp-selector>
        </AmpSelectorContainer>
      ) : (
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
      )}
    </>
  );
};

export default PageTabs;
