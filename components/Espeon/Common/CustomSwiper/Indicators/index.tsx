import React from 'react';
import { css, cx } from '@headout/pixie/css';
import type { TSwiperProps } from '../types';
import {
  paginationDotsWrapper,
  paginationDotWrapperStyles,
  rtlDirection,
} from './styles';

type TProps = Pick<TSwiperProps, 'rtlEnabled'> & {
  numberOfElements: number;
  activeIndex: number;
  dotPositionStandard?: boolean;
};

const PageIndicator = ({
  rtlEnabled,
  numberOfElements,
  activeIndex,
  dotPositionStandard = false,
}: TProps) => {
  return (
    <ul
      className={cx(
        css(rtlEnabled && rtlDirection),
        paginationDotsWrapper(
          dotPositionStandard
            ? {
                dotsPosition: 'standard',
              }
            : {}
        ),
        'pagination-dots-list'
      )}
    >
      {[...Array(numberOfElements)].map((_, i) => (
        <li
          key={i}
          className={cx(
            'pagination-dot',
            i === activeIndex && 'active-pagination-dot',
            paginationDotWrapperStyles({
              state: i === activeIndex ? 'active' : 'default',
            })
          )}
          data-num={i}
          data-active
        />
      ))}
    </ul>
  );
};

export default PageIndicator;
