import React, { useLayoutEffect } from 'react';
import { Button, Text } from '@headout/eevee';
import {
  CITY_WISE_LABELS,
  DEFAULT_PRICE,
  DROPS_FALLBACK_LINK,
  DROPS_MOBILE_EXIT_INTENT_LINK,
  DROPS_RIVE_URI,
} from 'components/AppDrops/constants';
import { TExitIntentBottomSheetContentProps } from 'components/AppDrops/types';
import Conditional from 'components/common/Conditional';
import { useRive } from 'hooks/useRive';
import { trackEvent } from 'utils/analytics';
import { setRiveExperienceNames } from 'utils/dropsUtils';
import { pickByKeys } from 'utils/gen';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'constants/strings';
import { DiscountTag } from '../DiscountTag';
import {
  exitIntentBottomSheetContent,
  exitIntentButton,
  exitIntentButtonContainer,
  exitIntentDescriptionMargin,
  exitIntentHeadingMargin,
  exitIntentRiveContainer,
  riveBlendingBG,
} from './styles';

const ExitIntentBottomSheetContent = ({
  onClose,
  cityCode,
}: TExitIntentBottomSheetContentProps) => {
  const { RiveComponent, isLoading, isError, rive } = useRive({
    src: DROPS_RIVE_URI,
    stateMachines: 'State Machine 1',
    artboard: `mWeb_${cityCode}_Exit`,
    autoplay: true,
  });

  useLayoutEffect(() => {
    setRiveExperienceNames(
      rive,
      cityCode,
      pickByKeys(strings as Record<string, any>, ['DROPS']),
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityCode, rive]);

  const handleDownloadApp = () => {
    const link =
      DROPS_MOBILE_EXIT_INTENT_LINK[
        cityCode as keyof typeof DROPS_MOBILE_EXIT_INTENT_LINK
      ] ?? DROPS_FALLBACK_LINK;
    trackEvent({
      eventName: ANALYTICS_EVENTS.DROPS_BANNER_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: 'Download',
    });
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleNotNow = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.DROPS_BANNER_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: 'Not Now',
    });
    if (onClose) {
      onClose();
    }
  };

  return (
    <div>
      <div className={exitIntentBottomSheetContent}>
        <DiscountTag variant={{ variant: 'exitIntent' }} />
        <div className={riveBlendingBG} />
        <Text
          as="h1"
          className={exitIntentHeadingMargin}
          textStyle={'heading.medium'}
          color={'core.candy.700'}
        >
          {strings.formatString(
            strings.DROPS.TITLE,
            CITY_WISE_LABELS?.[cityCode as keyof typeof CITY_WISE_LABELS]
              ?.price ?? DEFAULT_PRICE
          )}
        </Text>

        <Text
          as="p"
          className={exitIntentDescriptionMargin}
          textStyle={'ui.label.small'}
          color={'semantic.text.grey.2'}
        >
          {strings.formatString(
            strings.DROPS.SUBTITLE,
            CITY_WISE_LABELS?.[cityCode as keyof typeof CITY_WISE_LABELS]
              ?.city ?? ''
          )}
        </Text>

        <div className={exitIntentButtonContainer}>
          <Button
            as="button"
            variant="primary"
            size="small"
            className={exitIntentButton}
            btnType="black"
            primaryText={strings.DROPS.EXIT_INTENT.DOWNLOAD_APP}
            onClick={handleDownloadApp}
          />
          <Button
            as="button"
            variant="tertiary"
            className={exitIntentButton}
            size="small"
            btnType="black"
            primaryText={strings.DROPS.EXIT_INTENT.NOT_NOW}
            onClick={handleNotNow}
          />
        </div>
      </div>
      <Conditional if={!isLoading && !isError}>
        <div className={exitIntentRiveContainer}>
          <RiveComponent />
        </div>
      </Conditional>
    </div>
  );
};

export default ExitIntentBottomSheetContent;
