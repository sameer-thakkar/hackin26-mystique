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
  display: ${({
    // @ts-expect-error TS(2339): Property 'isActive' does not exist on type 'Pick<D... Remove this comment to see the full error message
    isActive,
  }) => (isActive ? 'block' : 'none')};
`;

const Tab = (props: any) => {
  const { slices, title, sliceProps } = props;
  const { activeTabId, keyIndex } = sliceProps || {};
  return (
    <StyledTabPanel key={keyIndex}>
      {slices.map((slice: any, index: number) => {
        return (
          <StyledTabContent
            key={index}
            // @ts-expect-error TS(2769): No overload matches this call.
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
