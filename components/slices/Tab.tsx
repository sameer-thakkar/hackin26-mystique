import React, { useState } from 'react';
import styled from 'styled-components';
import sliceHandler from '../Slices';
import { GRAPHIK } from '../../constants/ui-constants';
import { stringIdfy } from '../../utils/helper';

const StyledTabPanel = styled.div`
  position: relative;
  display: grid;
  grid-row-gap: 16px;
  font-family: ${GRAPHIK.FONT_STACK};
  line-height: 1.5;
  a {
    color: #ec1943;
  }
  p {
    margin: 0;
  }
`;

const StyledTabContent = styled.div`
  display: ${({ isActive }) => (isActive ? 'block' : 'none')};
`;

const Tab = props => {
  const { slices, title, sliceProps } = props;
  const { activeTabId } = sliceProps;
  return (
    <StyledTabPanel>
      {slices.map((slice, index) => {
        return (
          <StyledTabContent isActive={activeTabId == stringIdfy(title)}>
            {sliceHandler(slice, {
              index,
              ...sliceProps,
            })}
          </StyledTabContent>
        );
      })}
    </StyledTabPanel>
  );
};

export default Tab;
