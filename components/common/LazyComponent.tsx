import React, { PropsWithChildren, ReactNode, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import useOnScreen from 'hooks/useOnScreen';
import { appAtom } from 'store/atoms/app';
import { lazyLoadOverrideAtom } from 'store/atoms/lazy';

const DEFAULT_PLACEHOLDER_HEIGHT = '22rem';

const PlaceHolder = styled.div``;

const LazyComponent = ({
  children,
  target = 'USER',
  placeHolderHeight = DEFAULT_PLACEHOLDER_HEIGHT,
}: PropsWithChildren<{
  target?: 'BOT' | 'USER' | 'BOTH' | 'NONE';
  placeHolderHeight?: string;
}>) => {
  const lazyElementRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useOnScreen({
    ref: lazyElementRef,
    unobserve: true,
  });
  const { isBot } = useRecoilValue(appAtom);
  const overrideLazyLoading = useRecoilValue(lazyLoadOverrideAtom);

  const shouldRender = useMemo(() => {
    switch (true) {
      case overrideLazyLoading:
        return true;
      case isBot && target === 'USER': // If Bot and target audience for Lazy Loading is User, render.
      case !isBot && target === 'BOT': // If User and target audience for Lazy Loading is Bot, render
        return true;
      case target === 'BOT' && isBot && isIntersecting: // if Bot and target audience is Bot and element in view, render.
      case target === 'USER' && !isBot && isIntersecting: // if user and target audience is User & element is in view, render.
      case target === 'BOTH' && isIntersecting: // if target audience is Both, and element is in view, render.
      case target === 'NONE': // if target audience is NONE, render
        return true;
      default:
        return false;
    }
  }, [isBot, isIntersecting, target, overrideLazyLoading]);

  if (shouldRender) return <>{children}</>;

  // TODO: After React 18 Upgrade, move this block to work with `useTransition` + actual shimmer placeholder.
  return (
    <PlaceHolder
      style={{ minHeight: placeHolderHeight || DEFAULT_PLACEHOLDER_HEIGHT }}
      ref={lazyElementRef}
    />
  );
};

export default LazyComponent;

export const WrapInLazyComponent = (children: any) => {
  return <LazyComponent>{children}</LazyComponent>;
};

export const ConditionallyLazyComponent = ({
  children,
  placeholderHeight,
  isLazy,
}: {
  children: ReactNode;
  placeholderHeight?: string;
  isLazy: boolean;
}) => {
  if (!isLazy) return <>{children}</>;
  return (
    <LazyComponent placeHolderHeight={placeholderHeight}>
      {children}
    </LazyComponent>
  );
};
