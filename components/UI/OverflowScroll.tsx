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
  min-width: ${({  
 // @ts-expect-error TS(2339): Property 'minWidth' does not exist on type 'Pick<D... Remove this comment to see the full error message
 minWidth }) => (minWidth ? `${minWidth}` : `max-content`)};
  margin: 0px 10px ${({  
 // @ts-expect-error TS(2339): Property 'marginBottom' does not exist on type 'Pi... Remove this comment to see the full error message
 marginBottom }) => marginBottom}px 0;
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
        // @ts-expect-error TS(2769): No overload matches this call.
        <Child key={index} minWidth={minWidthChild} marginBottom={marginBottom}>
          {child}
        </Child>
      ))}
    </Wrapper>
  );
};

export default OverflowScroll;
