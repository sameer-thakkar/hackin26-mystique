import React, { CSSProperties, useContext, useMemo } from 'react';
import { Alignment, Layout } from '@rive-app/react-canvas';
import Conditional from 'components/common/Conditional';
import { MBContext } from 'contexts/MBContext';
import { useRive } from 'hooks/useRive';
import { shouldExcludeHolidayTheming } from 'utils/productUtils';
import {
  RAMADAN_CONFIG,
  RAMADAN_HEADER_RIVE,
  RAMADAN_RIVE,
  RAMADAN_RIVE_MWEB,
} from './constants';
import {
  RiveStylesDesktop,
  RiveStylesHeader,
  RiveStylesMobile,
} from './styles';

type TRamadanProps = {
  variant: 'header' | 'desktop' | 'mobile';
};

const RamadanTheming = ({ variant }: TRamadanProps) => {
  const { primaryCity } = useContext(MBContext);

  let riveUrl = null;
  let RiveStyles: CSSProperties = {};
  switch (variant) {
    case 'header':
      riveUrl = RAMADAN_HEADER_RIVE;
      RiveStyles = RiveStylesHeader;
      break;
    case 'desktop':
      riveUrl = RAMADAN_RIVE;
      RiveStyles = RiveStylesDesktop;
      break;
    case 'mobile':
      riveUrl = RAMADAN_RIVE_MWEB;
      RiveStyles = RiveStylesMobile;
      break;
    default:
      riveUrl = null;
  }

  const excludeHolidayTheming = useMemo(() => {
    return shouldExcludeHolidayTheming(
      primaryCity?.country.code,
      primaryCity?.cityCode,
      ...RAMADAN_CONFIG
    );
  }, []);

  const { RiveComponent, isLoading } = useRive(
    riveUrl
      ? {
          src: riveUrl,
          stateMachines: 'State Machine 1',
          autoplay: true,
          layout: new Layout({ alignment: Alignment.TopCenter }),
        }
      : null
  );

  return (
    <Conditional if={!excludeHolidayTheming && !isLoading}>
      <RiveComponent style={RiveStyles} />
    </Conditional>
  );
};

export default RamadanTheming;
