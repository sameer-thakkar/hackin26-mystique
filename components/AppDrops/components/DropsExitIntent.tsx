import React, { useContext, useMemo, useState } from 'react';
import { ExitIntentContentWrapper } from 'components/common/ExitIntentPopup/ExitIntentContentWrapper';
import useExitIntent from 'components/hooks/useExitIntent';
import { MBContext } from 'contexts/MBContext';
import { checkIsEligibleForExitIntent } from 'utils/dropsUtils';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { TDropsComponentProps } from '../types';
import ExitIntentDialogContent from './ExitIntentDialogContent';
import ExitIntentBottomSheetContent from './ExitIntentSheetContent';

const EXIT_INTENT_INACTIVITY_TIMEOUT = 30000;

export const DropsExitIntent = ({ cityCode }: TDropsComponentProps) => {
  const [showExitIntentPopup, setShowExitIntentPopup] = useState(false);
  const { uid, countryCode } = useContext(MBContext);
  const isEnabled = useMemo(
    () => checkIsEligibleForExitIntent(uid, countryCode),
    [uid, countryCode]
  );

  const handleExitIntent = () => {
    setShowExitIntentPopup(true);
  };

  const handleClose = () => {
    setShowExitIntentPopup(false);
  };

  const { exitIntentType } = useExitIntent({
    enabled: isEnabled,
    onExitIntent: handleExitIntent,
    inactivityTimeout: EXIT_INTENT_INACTIVITY_TIMEOUT,
  });

  if (!isEnabled) {
    return null;
  }

  return (
    <ExitIntentContentWrapper
      isOpen={showExitIntentPopup}
      onClose={handleClose}
      contentComponent={<ExitIntentDialogContent cityCode={cityCode} />}
      mobileComponent={
        <ExitIntentBottomSheetContent
          onClose={handleClose}
          cityCode={cityCode}
        />
      }
      trackingEventName={ANALYTICS_EVENTS.DROPS_BANNER_SHOWN}
      trackingProperties={{
        [ANALYTICS_PROPERTIES.BANNER_TYPE]: 'Exit Modal',
        [ANALYTICS_PROPERTIES.EXIT_INTENT_TYPE]: exitIntentType,
      }}
    />
  );
};
