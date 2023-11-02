import React, { PropsWithChildren, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import useOnScreen from 'hooks/useOnScreen';
import { appAtom } from 'store/atoms/app';
import { lazyLoadOverrideAtom } from 'store/atoms/lazy';
import { LAZY_LOAD_ENABLED_DOMAINS } from 'const/index';

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
  const { isBot, uid } = useRecoilValue(appAtom);
  const overrideLazyLoading = useRecoilValue(lazyLoadOverrideAtom);
  const isLazyLoadApplicable =
    LAZY_LOAD_ENABLED_DOMAINS.findIndex((domain) => uid.includes(domain)) > -1;

  const shouldRender = useMemo(() => {
    switch (true) {
      case overrideLazyLoading:
        return true;
      case isLazyLoadApplicable && isBot && target === 'USER': // If Bot and target audience for Lazy Loading is User, render.
      case isLazyLoadApplicable && !isBot && target === 'BOT': // If User and target audience for Lazy Loading is Bot, render
        return true;
      case isLazyLoadApplicable && target === 'BOT' && isBot && isIntersecting: // if Bot and target audience is Bot and element in view, render.
      case isLazyLoadApplicable &&
        target === 'USER' &&
        !isBot &&
        isIntersecting: // if user and target audience is User & element is in view, render.
      case isLazyLoadApplicable && target === 'BOTH' && isIntersecting: // if target audience is Both, and element is in view, render.
      case target === 'NONE': // if target audience is NONE, render
      case !isLazyLoadApplicable:
        return true;
      default:
        return false;
    }
  }, [
    isBot,
    isIntersecting,
    isLazyLoadApplicable,
    target,
    overrideLazyLoading,
  ]);

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
