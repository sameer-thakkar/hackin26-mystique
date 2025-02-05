import React from 'react';
import { Button } from '@headout/eevee';
import { cx } from '@headout/pixie/css';
import LeftArrow from 'components/Espeon/Assets/LeftArrow';
import RightArrow from 'components/Espeon/Assets/RightArrow';
import { buttonWrapper } from './styles';
import type { TProps } from './types';

const ArrowButton = ({
  direction,
  onArrowClicked,
  isDisabled = false,
}: TProps) => {
  const isNext = direction === 'next';
  return (
    <Button
      as="button"
      btnType="black"
      icon={isNext ? <RightArrow /> : <LeftArrow />}
      iconPosition="leading"
      // onClick={onArrowClicked}
      onClick={(event) => {
        event.stopPropagation();
        onArrowClicked();
      }}
      className={cx(
        buttonWrapper({
          alignment: isNext ? 'right' : 'left',
        }),
        'arrow-button',
        isNext ? 'arrow-button-right' : 'arrow-button-left'
      )}
      primaryText=""
      size={'medium'}
      state={isDisabled ? 'disabled' : 'default'}
      variant="secondary"
      aria-label={isNext ? 'Next Slide' : 'Previous slide'}
      aria-disabled={isDisabled}
    />
  );
};

export default ArrowButton;
