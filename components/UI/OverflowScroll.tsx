import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 0 16px 40px 20px;
  margin-right: -16px;
  margin-left: -16px;
`;

const StyledChild = styled.div`
  min-width: ${props => props.minWidth}px;
  margin-right: 10px;
  padding-right: 10px;
`;

const OverflowScroll: React.FC<{
  children: React.ReactNode[];
  minWidthChild?: number;
}> = ({ children, minWidthChild = 300 }) => {
  return (
    <StyledWrapper>
      {children.map(child => (
        <StyledChild minWidth={minWidthChild}>{child}</StyledChild>
      ))}
    </StyledWrapper>
  );
};

export default OverflowScroll;
