import React, { useEffect, useState } from 'react';
import { Alignment, Fit, Layout } from '@rive-app/react-canvas';
import Conditional from 'components/common/Conditional';
import { useRive } from 'hooks/useRive';
import { RIV_CTA_LTT_BASE, RIVE_CONTENT_TYPE } from 'const/index';
import { TRiveCTAProps } from './interface';
import { riveComponentStyles, RiveCtaWrapper } from './style';

const COMMON_RIVE_PATH = `${RIV_CTA_LTT_BASE}all.riv`;

const checkFileResponse = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.headers.get('content-type');
  } catch (error) {
    return null;
  }
};

const RiveShowPageCTA = ({
  onClick,
  primaryText,
  tgid,
  primarySubCatId,
  onRiveVisible,
}: TRiveCTAProps) => {
  const sources = [
    `${RIV_CTA_LTT_BASE}tgid-${tgid}.riv`,
    `${RIV_CTA_LTT_BASE}subcat-${primarySubCatId}.riv`,
    COMMON_RIVE_PATH,
  ];

  const [riveSrc, setRiveSrc] = useState<string | null>(null);
  const [isSrcDetermined, setIsSrcDetermined] = useState(false);

  useEffect(() => {
    const determineRiveSource = async () => {
      for (const src of sources) {
        if (
          src === COMMON_RIVE_PATH ||
          (await checkFileResponse(src)) === RIVE_CONTENT_TYPE
        ) {
          setRiveSrc(src);
          break;
        }
      }
      setIsSrcDetermined(true);
    };

    determineRiveSource();
  }, []);

  const { RiveComponent, rive, isLoading, isError } = useRive(
    isSrcDetermined && riveSrc
      ? {
          src: riveSrc,
          stateMachines: 'stateMachine',
          artboard: 'artboard',
          layout: new Layout({
            fit: Fit.FitWidth,
            alignment: Alignment.Center,
          }),
          autoplay: true,
        }
      : null
  );

  const showFallback = isLoading || isError || !riveSrc;
  rive?.setTextRunValue('ctaText', primaryText);

  useEffect(() => {
    if (rive) {
      setTimeout(() => {
        onRiveVisible(!showFallback);
      }, 1000);
    }
  }, [showFallback, onRiveVisible]);

  return (
    <Conditional if={!showFallback}>
      <RiveCtaWrapper>
        <RiveComponent onClick={onClick} style={riveComponentStyles} />
      </RiveCtaWrapper>
    </Conditional>
  );
};

export default RiveShowPageCTA;
