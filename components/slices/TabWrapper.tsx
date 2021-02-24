import React, { useState } from 'react';
import styled from 'styled-components';
import { useAmp } from 'next/amp';
import { SOLEIL } from 'const/ui-constants';
import Conditional from 'components/common/Conditional';

import sliceHandler from '../Slices';
import RichContent from '../UI/RichContent';
import TitleTextCombo from '../UI/TitleTextCombo';
import { stringIdfy } from '../../utils/helper';

const StyledTabWrapper = styled.div`
  display: grid;
  grid-row-gap: 16px;
  line-height: 1.5;
  font-family: ${SOLEIL.FONT_STACK};
  .tabs {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    font-size: 18px;
    grid-column-gap: 32px;
    border-bottom: 1px solid #ebebeb;
    justify-content: left;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .tab-content-wrap {
    display: grid;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    margin-bottom: 8px;
  }
  @media (max-width: 768px) {
    .tabs {
      overflow-x: scroll;
      grid-auto-columns: max-content;
    }
  }
`;

const StyledTab = styled.div`
  cursor: pointer;
  padding-bottom: 8px;
  display: block;
  width: 100%;
  ${({ isActive }) => {
    return (
      isActive &&
      `
      color: #ec1943;
      border-bottom: 2px solid;
    `
    );
  }}
`;

const AmpSelectorContainer = styled.div`
  amp-selector {
    width: calc(100vw - 32px);
    margin-bottom: 20px;
  }
  amp-selector [role='tab'] {
    cursor: pointer;
    padding-bottom: 8px;
    display: block;
    width: 100%;
  }

  amp-selector [role='tab'][selected] {
    color: #ec1943;
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

type TabWrapperProps = {
  heading: String;
  slices: Array<any>;
  sliceProps?: Object;
  description?: any[];
};

/**
 * Tab Wrapper Start/End Are the Wrapping Slices that are required to add n number of tabs.
 *
 * Inside a Tab Wrapper you're expected to add only `Tab` Slice type as adding any other slice type will cause it to glitch.
 *
 * > Structure
 *
 *```html
 *...
 *
 *<tab_wrapper_start>
 *  <tab />
 *    <slice_a />
 *    <slice_b />
 *  <tab />
 *    <slice_b />
 *    <slice_a />
 *    <slice_c />
 *  <tab />
 *    <slice_z />
 *<tab_wrapper_end>
 *
 * ...
 *```
 *
 *
 */
const TabWrapper = (props: TabWrapperProps) => {
  const { heading, slices, sliceProps: parentSliceProps, description } = props;
  // @ts-ignore
  const { sliceIndex } = parentSliceProps;
  const default_from_prismic = slices.filter(
    (slice) => slice.primary.is_default == 'Yes'
  );
  let modifiedSlices = slices.map((slice, index) => {
    return { ...slice, index };
  });
  const defaultTab = stringIdfy(
    (default_from_prismic[0] || slices[0])?.primary?.title || ''
  );
  const isAmp = useAmp();
  const [activeTabId, setActiveTab] = useState(defaultTab);
  let sliceProps: any = {
    activeTabId,
    ...parentSliceProps,
  };

  return (
    <StyledTabWrapper>
      <TitleTextCombo noMargin={true}>
        <Conditional if={heading?.length}>
          <h2>{heading}</h2>
        </Conditional>
        {description ? <RichContent render={description} /> : null}
      </TitleTextCombo>
      {isAmp ? (
        <AmpSelectorContainer>
          <amp-selector
            className="tabs-with-selector tabs"
            role="tablist"
            on={`select:tabWrapperPanel_${sliceIndex}.toggle(index=event.targetOption, value=true)`}
            keyboard-select-mode="focus"
          >
            {modifiedSlices.map((slice, index) => {
              return (
                <div
                  key={index}
                  role="tab"
                  className="tab-heading"
                  // @ts-ignore
                  option={`${index}`}
                  selected={index === 0}
                >
                  {slice.primary.title}
                </div>
              );
            })}
          </amp-selector>
          <amp-selector id={`tabWrapperPanel_${sliceIndex}`}>
            <div className="tab-content-wrap">
              {modifiedSlices.map((slice, keyIndex) => {
                return (
                  <div
                    key={keyIndex}
                    role="tabpanel"
                    // @ts-ignore
                    option={`${keyIndex}`}
                    selected={keyIndex === 0}
                  >
                    {sliceHandler(slice, {
                      ...sliceProps,
                      keyIndex,
                      ampModified: true,
                    })}
                  </div>
                );
              })}
            </div>
          </amp-selector>
        </AmpSelectorContainer>
      ) : (
        <>
          <div className="tabs">
            {slices.map((slice, index) => {
              const tabId = stringIdfy(slice.primary.title);
              return (
                <StyledTab
                  key={index}
                  isActive={activeTabId == tabId}
                  onClick={() => setActiveTab(tabId)}
                >
                  {slice.primary.title}
                </StyledTab>
              );
            })}
          </div>
          <div className="tab-content-wrap">
            {slices.map((slice, keyIndex) => {
              return sliceHandler(slice, { ...sliceProps, keyIndex });
            })}
          </div>
        </>
      )}
    </StyledTabWrapper>
  );
};

export default TabWrapper;
