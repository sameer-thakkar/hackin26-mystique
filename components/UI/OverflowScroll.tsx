import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  overflow-x: auto;
  margin: 0 -16px;
  max-width: calc(100vw - 32px);
  padding: 0 16px;
`;

const Child = styled.div`
  min-width: ${({ minWidth }) => (minWidth ? `${minWidth}` : `max-content`)};
  margin: 0px 10px ${({ marginBottom }) => marginBottom}px 0;
  padding-right: 10px;
`;

const OverflowScroll: React.FC<{
  children: React.ReactNode[];
  minWidthChild?: string;
  marginBottom?: number;
}> = ({ children, minWidthChild = null, marginBottom = 0 }) => {
  return (
    <Wrapper>
      {children?.map((child, index) => (
        <Child key={index} minWidth={minWidthChild} marginBottom={marginBottom}>
          {child}
        </Child>
      ))}
    </Wrapper>
  );
};

export default OverflowScroll;
