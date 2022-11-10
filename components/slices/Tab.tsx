import React from 'react';
import styled from 'styled-components';
import COLORS from 'const/colors';

import sliceHandler from '../Slices';
import { stringIdfy } from '../../utils/helper';

const StyledTabPanel = styled.div`
  position: relative;
  display: grid;
  a {
    color: ${COLORS.TEXT.CANDY_1};
  }
  p {
    margin: 0;
  }
`;

const StyledTabContent = styled.div`
  display: ${({ isActive }) => (isActive ? 'block' : 'none')};
`;

const Tab = (props) => {
  const { slices, title, sliceProps } = props;
  const { activeTabId, keyIndex } = sliceProps || {};
  return (
    <StyledTabPanel key={keyIndex}>
      {slices.map((slice, index) => {
        return (
          <StyledTabContent
            key={index}
            isActive={activeTabId == stringIdfy(title)}
          >
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
