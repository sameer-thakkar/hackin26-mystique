import React, { useContext, useMemo, useState } from 'react';
import { ExitIntentContentWrapper } from 'components/common/ExitIntentPopup/ExitIntentContentWrapper';
import useExitIntent from 'components/hooks/useExitIntent';
import { MBContext } from 'contexts/MBContext';
import { checkIsEligibleForExitIntent } from 'utils/dropsUtils';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import ExitIntentDialogContent from './ExitIntentDialogContent';
import ExitIntentBottomSheetContent from './ExitIntentSheetContent';

export const DropsExitIntent = () => {
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

  useExitIntent({
    enabled: isEnabled,
    onExitIntent: handleExitIntent,
  });

  if (!isEnabled) {
    return null;
  }

  return (
    <ExitIntentContentWrapper
      isOpen={showExitIntentPopup}
      onClose={handleClose}
      contentComponent={<ExitIntentDialogContent />}
      mobileComponent={<ExitIntentBottomSheetContent onClose={handleClose} />}
      trackingEventName={ANALYTICS_EVENTS.DROPS_BANNER_SHOWN}
      trackingProperties={{
        [ANALYTICS_PROPERTIES.BANNER_TYPE]: 'Exit Modal',
      }}
    />
  );
};
