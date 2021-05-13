import React from 'react';
import styled from 'styled-components';
import { SOLEIL, COLORS } from 'const/ui-constants';

import sliceHandler from '../Slices';
import { stringIdfy } from '../../utils/helper';

const StyledTabPanel = styled.div`
  position: relative;
  display: grid;
  grid-row-gap: 16px;
  font-family: ${SOLEIL.FONT_STACK};
  line-height: 1.5;
  a {
    color: ${COLORS.MED_SLATE_BLUE};
  }
  p {
    margin: 0;
  }
`;

const StyledTabContent = styled.div`
  display: ${({ isActive }) => (isActive ? 'block' : 'none')};
  ${({ isGlobalMb }) => isGlobalMb && `border-bottom: 1px solid #e2e2e2`}
`;

const Tab = (props) => {
  const { slices, title, sliceProps } = props;
  const { activeTabId, keyIndex } = sliceProps || {};
  const isGlobalMb = sliceProps?.isGlobalMb;
  return (
    <StyledTabPanel key={keyIndex}>
      {slices.map((slice, index) => {
        return (
          <StyledTabContent
            key={index}
            className="tab-item-amp"
            isActive={activeTabId == stringIdfy(title)}
            isGlobalMb={isGlobalMb}
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
