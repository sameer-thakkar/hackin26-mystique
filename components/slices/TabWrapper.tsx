import React, { useState } from 'react';
import styled from 'styled-components';
import sliceHandler from '../Slices';
import { GRAPHIK } from '../../constants/ui-constants';
import { stringIdfy } from '../../utils/helper';

const StyledTabWrapper = styled.div`
  display: grid;
  grid-row-gap: 16px;
  line-height: 1.5;
  font-family: ${GRAPHIK.FONT_STACK};
  .tabs {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    font-size: 18px;
    grid-column-gap: 32px;
    border-bottom: 1px solid #ebebeb;
    justify-content: left;
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
type TabWrapperProps = {
  heading: String;
  slices: Array<any>;
  sliceProps?: Object;
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
  const { heading, slices, sliceProps: parentSliceProps } = props;
  const default_from_prismic = slices.filter(
    (slice) => slice.primary.is_default == 'Yes'
  );
  const defaultTab = stringIdfy(
    (default_from_prismic[0] || slices[0])?.primary?.title || ''
  );
  const [activeTabId, setActiveTab] = useState(defaultTab);
  let sliceProps: any = {
    activeTabId,
    ...parentSliceProps,
  };

  return (
    <StyledTabWrapper>
      <h2>{heading}</h2>
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
        {slices.map((slice) => {
          return sliceHandler(slice, sliceProps);
        })}
      </div>
    </StyledTabWrapper>
  );
};

export default TabWrapper;
