import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants/ui-constants';

const StyledLine = styled.div`
  border-bottom: 1px solid;
  border-color: ${COLORS.CHALK};
`;

const HorizontalLine = props => {
  return <StyledLine />;
};

export default HorizontalLine;
