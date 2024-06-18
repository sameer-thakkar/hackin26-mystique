import React, { useState } from 'react';
import styled from 'styled-components';
import { trackEvent, TTrackEvent } from 'utils/analytics';

const Wrapper = styled.div<{
  sidePadding?: number;
  wrapperMargin?: number;
  $gap: number;
  $unsetWrapperMargin: boolean;
}>`
  display: flex;
  ${({ $gap }) => $gap && `gap: ${$gap}rem;`}
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 ${({ sidePadding }) => sidePadding}px;
  margin: ${({ $unsetWrapperMargin, wrapperMargin }) =>
    $unsetWrapperMargin ? '0' : `0 ${wrapperMargin}px`};
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
  wrapperPadding?: number;
  wrapperMargin?: number;
  unsetWrapperMargin?: boolean;
  unsetChildrenMargin?: boolean;
  unsetChildrenPadding?: boolean;
  gap?: number;
  trackingObject?: TTrackEvent;
}> = ({
  children,
  minWidthChild = null,
  marginBottom = 0,
  wrapperPadding = 16,
  wrapperMargin = -16,
  unsetWrapperMargin = false,
  unsetChildrenMargin = false,
  unsetChildrenPadding = false,
  gap = 0,
  trackingObject,
}) => {
  const [isTracked, setIsTracked] = useState(false);
  const scrollViewProps: React.HTMLAttributes<HTMLDivElement> = {};
  if (trackingObject && !isTracked) {
    scrollViewProps.onScroll = () => {
      trackEvent(trackingObject);
      setIsTracked(true);
    };
  }

  return (
    <Wrapper
      $gap={gap}
      $unsetWrapperMargin={unsetWrapperMargin}
      sidePadding={wrapperPadding}
      wrapperMargin={wrapperMargin}
      {...scrollViewProps}
    >
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
