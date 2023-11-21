import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ $gap: number; $unsetWrapperMargin: boolean }>`
  display: flex;
  ${({ $gap }) => $gap && `gap: ${$gap}rem;`}
  overflow-x: auto;
  overflow-y: hidden;
  margin: ${({ $unsetWrapperMargin }) =>
    $unsetWrapperMargin ? '0' : '0 -1rem'};
  max-width: calc(100vw - 2rem);
  padding: 0 1rem;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

const Child = styled.div<{
  minWidth: string | null;
  marginBottom: number;
  $unsetChildrenMargin: boolean;
  $unsetChildrenPadding: boolean;
}>`
  min-width: ${({ minWidth }) => (minWidth ? `${minWidth}` : `max-content`)};
  margin: ${({ $unsetChildrenMargin, marginBottom }) =>
    $unsetChildrenMargin ? '0' : `0px 10px ${marginBottom}px 0`};
  padding-right: ${({ $unsetChildrenPadding }) =>
    $unsetChildrenPadding ? '0' : '10px'};
`;

const OverflowScroll: React.FC<{
  children: React.ReactNode[];
  minWidthChild?: string;
  marginBottom?: number;
  unsetWrapperMargin?: boolean;
  unsetChildrenMargin?: boolean;
  unsetChildrenPadding?: boolean;
  gap?: number;
}> = ({
  children,
  minWidthChild = null,
  marginBottom = 0,
  unsetWrapperMargin = false,
  unsetChildrenMargin = false,
  unsetChildrenPadding = false,
  gap = 0,
}) => {
  return (
    <Wrapper $gap={gap} $unsetWrapperMargin={unsetWrapperMargin}>
      {children?.map((child, index) => (
        <Child
          key={index}
          minWidth={minWidthChild}
          marginBottom={marginBottom}
          $unsetChildrenMargin={unsetChildrenMargin}
          $unsetChildrenPadding={unsetChildrenPadding}
        >
          {child}
        </Child>
      ))}
    </Wrapper>
  );
};

export default OverflowScroll;
