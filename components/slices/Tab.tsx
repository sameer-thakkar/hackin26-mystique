import React from 'react';
import styled from 'styled-components';
import { SliceZone } from '@prismicio/react';
import COLORS from 'const/colors';
import { sliceComponents } from './sliceManager';

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

export const StyledTabContent = styled.div<{ isActive?: boolean }>`
  display: ${({ isActive }) => (isActive ? 'block' : 'none')};
`;

const Tab = (props: any) => {
  const { childSlices: slices, title: tabTitle, sliceProps } = props;
  const { activeTabId, keyIndex } = sliceProps || {};
  return (
    <StyledTabPanel key={keyIndex}>
      <SliceZone
        slices={slices}
        components={sliceComponents()}
        context={{ ...sliceProps, wrapperType: 'tab', tabTitle, activeTabId }}
        defaultComponent={() => null}
      />
    </StyledTabPanel>
  );
};

export default Tab;
