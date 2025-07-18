import React, { useLayoutEffect, useMemo } from 'react';
import { Button, Text } from '@headout/eevee';
import {
  DROPS_FALLBACK_LINK,
  DROPS_MOBILE_EXIT_INTENT_LINK,
  DROPS_RIVE_MWEB_URI,
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
import { DropsTimer } from '../DropsTimer';
import {
  exitIntentBottomSheetContent,
  exitIntentButtonContainer,
  exitIntentDescriptionMargin,
  exitIntentHeadingMargin,
  exitIntentRiveContainer,
} from './styles';

const ExitIntentBottomSheetContent = ({
  onClose,
  cityCode,
}: TExitIntentBottomSheetContentProps) => {
  const { RiveComponent, isLoading, isError, rive } = useRive({
    src: DROPS_RIVE_MWEB_URI,
    stateMachines: 'State Machine 1',
    artboard: `mWeb_${cityCode}_Banner`,
    autoplay: true,
  });

  const bannerTitle = useMemo(
    () =>
      strings.formatString(
        strings.DROPS.TITLE_MOBILE,
        strings.DROPS.CITY_WISE_LABELS[
          cityCode as keyof typeof strings.DROPS.CITY_WISE_LABELS
        ]?.cityNameMWeb,
        strings.DROPS.CITY_WISE_LABELS[
          cityCode as keyof typeof strings.DROPS.CITY_WISE_LABELS
        ]?.price
      ),
    [cityCode]
  );

  const bannerSubtitle = useMemo(
    () =>
      strings.formatString(
        strings.DROPS.SUBTITLE_MOBILE,
        strings.DROPS.CITY_WISE_LABELS[
          cityCode as keyof typeof strings.DROPS.CITY_WISE_LABELS
        ]?.cityNameMWeb
      ),
    [cityCode]
  );

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
    <div className={exitIntentBottomSheetContent}>
      <DiscountTag variant={{ variant: 'exitIntent' }} />
      <Text
        as="h1"
        className={exitIntentHeadingMargin}
        textStyle="display.xs"
        color="core.candy.700"
      >
        {bannerTitle}
      </Text>
      <Text
        as="p"
        className={exitIntentDescriptionMargin}
        textStyle="para.small"
        color="semantic.text.grey.2"
      >
        {bannerSubtitle}
      </Text>
      <Conditional if={!isLoading && !isError}>
        <div className={exitIntentRiveContainer}>
          <RiveComponent />
        </div>
      </Conditional>
      <div className={exitIntentButtonContainer}>
        <DropsTimer cityCode={cityCode || 'ROME'} />
        <Button
          as="button"
          variant="primary"
          size="medium"
          btnType="black"
          primaryText={strings.DROPS.EXIT_INTENT.DOWNLOAD_APP}
          onClick={handleDownloadApp}
        />
        <Button
          as="button"
          variant="tertiary"
          size="medium"
          btnType="black"
          primaryText={strings.DROPS.EXIT_INTENT.NOT_NOW}
          onClick={handleNotNow}
        />
      </div>
    </div>
  );
};

export default ExitIntentBottomSheetContent;
