import React, { type FC } from 'react';
import { css, cx } from '@headout/pixie/css';
import JumpLinkItem from './components/JumpLinkItem';
import { jumpLinksRecipe } from './styles';
import type { TJumpLinksProps } from './types';

export const JumpLinks: FC<TJumpLinksProps> = ({
  items,
  isDesktop = true,
  className,
  trackEvent,
}) => {
  const styles = jumpLinksRecipe.raw({ isDesktop });

  return (
    <div className={cx(css(styles.root), className)}>
      {items.map((item) => (
        <JumpLinkItem
          key={item.title}
          item={item}
          isDesktop={isDesktop}
          trackEvent={trackEvent}
        />
      ))}
    </div>
  );
};
