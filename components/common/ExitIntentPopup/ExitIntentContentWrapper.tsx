import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { BottomSheet } from 'components/common/DraggableBottomSheet';
import Modal from 'components/common/Modal';
import { trackEvent } from 'utils/analytics';
import { appAtom } from 'store/atoms/app';
import { ANALYTICS_PROPERTIES, FALSE, TRUE } from 'const/index';
import { TExitIntentContentWrapperProps } from './types';

export const ExitIntentContentWrapper = ({
  isOpen,
  onClose,
  contentComponent,
  mobileComponent,
  trackingEventName,
  trackingProperties = {},
  bottomSheetProps = {
    sheetHeight: 'auto',
    hidePill: true,
    roundedBorder: true,
  },
}: TExitIntentContentWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { isMobile } = useRecoilValue(appAtom);

  useEffect(() => {
    if (isOpen) {
      if (trackingEventName) {
        trackEvent({
          eventName: trackingEventName,
          platformName: isMobile ? 'Mobile' : 'Desktop',
          [ANALYTICS_PROPERTIES.QR_CODE_SHOWN]: !isMobile ? TRUE : FALSE,
          [ANALYTICS_PROPERTIES.DOWNLOAD_CTA_SHOWN]: isMobile ? TRUE : FALSE,
          ...trackingProperties,
        });
      }

      setTimeout(() => {
        setIsVisible(true);
      }, 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, isMobile, trackingEventName, trackingProperties]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (isMobile) {
    return isOpen ? (
      <BottomSheet onCloseCompletion={() => onClose()} {...bottomSheetProps}>
        {mobileComponent || contentComponent}
      </BottomSheet>
    ) : null;
  }

  return (
    <Modal
      active={isOpen && isVisible}
      closeModal={handleClose}
      onCloseCallback={onClose}
    >
      {React.isValidElement(contentComponent)
        ? React.cloneElement(contentComponent as React.ReactElement, {
            onClose: handleClose,
            isVisible,
          })
        : contentComponent}
    </Modal>
  );
};
