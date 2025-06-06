import React from 'react';
import { Button, Text } from '@headout/eevee';
import {
  DROPS_MOBILE_EXIT_INTENT_LINK,
  DROPS_RIVE_URI,
} from 'components/AppDrops/constants';
import { titleAppNudge } from 'components/AppDrops/styles';
import { TExitIntentBottomSheetContentProps } from 'components/AppDrops/types';
import { useRive } from 'hooks/useRive';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'constants/strings';
import { DiscountTag } from '../DiscountTag';
import { Steps } from '../Steps';
import {
  exitIntentAnimationContainer,
  exitIntentBottomSheetContent,
  exitIntentButton,
  exitIntentButtonContainer,
  exitIntentDescriptionMargin,
  exitIntentHeadingMargin,
  exitIntentRiveContainer,
  exitIntentStepsMarginTop,
} from './styles';

const ExitIntentBottomSheetContent = ({
  onClose,
}: TExitIntentBottomSheetContentProps) => {
  const { RiveComponent, isLoading, isError } = useRive({
    src: DROPS_RIVE_URI,
    autoplay: true,
  });

  const translations = strings.DROPS.DOWNLOAD_APP_NUDGE;

  const handleDownloadApp = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.DROPS_BANNER_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: 'Download',
    });
    window.open(DROPS_MOBILE_EXIT_INTENT_LINK, '_blank', 'noopener,noreferrer');
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
      <DiscountTag isMobile={true} variant={{ variant: 'exitIntent' }} />

      <div className={exitIntentAnimationContainer}>
        <div className={exitIntentRiveContainer}>
          {!isLoading && !isError && <RiveComponent />}
        </div>
      </div>

      <Text
        as="h1"
        className={exitIntentHeadingMargin}
        textStyle={'heading.regular'}
        color={'core.candy.800'}
      >
        {strings.DROPS.EXIT_INTENT.TITLE}
      </Text>

      <Text
        as="p"
        className={exitIntentDescriptionMargin}
        textStyle={'ui.label.small'}
        color={'semantic.text.grey.2'}
      >
        {strings.DROPS.EXIT_INTENT.DESCRIPTION}
      </Text>

      {/* Steps Section */}
      <div className={exitIntentStepsMarginTop}>
        <Text
          as="h3"
          className={titleAppNudge}
          textStyle={'tags.booster'}
          color={'core.candy.800'}
        >
          {translations.TITLE}
        </Text>
        <Steps
          variant={{ variant: 'exitIntent' }}
          showHighlightedTextLine={true}
        />
      </div>

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
  );
};

export default ExitIntentBottomSheetContent;
