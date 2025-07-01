import React from 'react';
import { Alignment, Fit, Layout } from '@rive-app/react-canvas';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { IHolidayRiveProps } from 'components/HolidayTheming/interface';
import {
  RiveBottomAnchorStyle,
  RiveStylesDesktop,
  RiveStylesHeader,
  RiveStylesMobile,
  RiveTopAnchorStyle,
} from 'components/HolidayTheming/styles';
import { useRive } from 'hooks/useRive';

const HolidayRiveFrame = ({
  variant,
  riveSrc,
  artboard,
  anchor = 'top',
}: IHolidayRiveProps) => {
  let RiveStyles = '';

  switch (variant) {
    case 'header':
      RiveStyles = RiveStylesHeader;
      break;
    case 'desktop':
      RiveStyles = RiveStylesDesktop;
      break;
    case 'mobile':
      RiveStyles = RiveStylesMobile;
      break;
  }

  const { RiveComponent, isLoading } = useRive(
    riveSrc
      ? {
          src: riveSrc,
          stateMachines: 'State Machine 1',
          artboard: artboard,
          autoplay: true,
          layout: new Layout({
            fit: Fit.Cover,
            alignment:
              anchor === 'top' ? Alignment.TopCenter : Alignment.BottomCenter,
          }),
        }
      : null
  );

  return (
    <Conditional if={!isLoading}>
      <RiveComponent
        className={cx(
          RiveStyles,
          anchor === 'top' ? RiveTopAnchorStyle : RiveBottomAnchorStyle
        )}
      />
    </Conditional>
  );
};

export default HolidayRiveFrame;
