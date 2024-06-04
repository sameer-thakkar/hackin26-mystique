import { useState } from 'react';
import ReactModal from 'react-modal';
import { useRecoilState } from 'recoil';
import Button from '@headout/aer/src/atoms/Button';
import Conditional from 'components/common/Conditional';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { PinIllustrationSVG } from 'assets/airportTransfers/searchUnitSVGs';
import CloseIcon from 'assets/closeIcon';
import { BottomDrawer } from '../BottomDrawer';
import { sharedTransferReturn } from '../state';
import {
  ContentContainer,
  PopupHeader,
  ReturnToggleContainer,
  ToggleSwitch,
} from './style';

export const ReturnToggle = ({ isMobile }: { isMobile: boolean }) => {
  const [isReturn, setIsReturn] = useRecoilState(sharedTransferReturn);

  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const close = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsInfoDrawerOpen(false);
    }, 500);
  };

  const open = () => {
    setIsInfoDrawerOpen(true);
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  };

  const handleToggleClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.SEARCH_FILTER_APPLIED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_NAME]: 'Add Return',
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_VALUE]: !isReturn
        ? 'True'
        : 'False',
    });

    if (!isReturn) {
      open();

      trackEvent({
        eventName: 'Popup Viewed',
        [ANALYTICS_PROPERTIES.LABEL]: 'Return Journey Disclaimer',
      });
    }

    setIsReturn(!isReturn);
  };

  const popupStyles: ReactModal.Styles = {
    overlay: {
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity .5s cubic-bezier(0.7, 0, 0.3, 1)',
    },
    content: {
      maxWidth: '413px',

      maxHeight: 'max-content',
      margin: '32px auto 42px',
      borderRadius: 12,
      overflow: 'visible',
      padding: 0,
      border: 'none',
      opacity: isVisible ? 1 : 0,
      top: '20%',
      transform: `scale(${isVisible ? 1 : 0.8})`,
      transition: 'all .5s cubic-bezier(0.7, 0, 0.3, 1)',
      backgroundColor: 'white',
      boxSizing: 'border-box',
    },
  };

  const popupContent = (
    <ContentContainer>
      <div className="text">
        <div className="title">
          <span>{strings.AIRPORT_TRANSFER.ADDED_RETURN_TRIP}</span>
          <PinIllustrationSVG />
        </div>

        <p>{strings.AIRPORT_TRANSFER.RETURN_NOTE}</p>
      </div>

      <div className="button-wrapper">
        <Button
          onClick={() => setIsInfoDrawerOpen(false)}
          width={'100%'}
          size="medium"
          color="purps"
          variant="primary"
          text={strings.AIRPORT_TRANSFER.OKAY_I_UNDERSTAND}
        />
      </div>
    </ContentContainer>
  );

  if (isMobile) {
    return (
      <ReturnToggleContainer className="return-toggle-switch">
        <ToggleSwitch $isToggled={isReturn} onClick={handleToggleClick} />
        <span> {strings.AIRPORT_TRANSFER.ADD_RETURN}</span>

        <Conditional if={isInfoDrawerOpen && isMobile}>
          <BottomDrawer
            height="max-content"
            handleClose={() => setIsInfoDrawerOpen(false)}
            title={strings.AIRPORT_TRANSFER.HEADS_UP}
          >
            {popupContent}
          </BottomDrawer>
        </Conditional>
      </ReturnToggleContainer>
    );
  }
  return (
    <ReturnToggleContainer className="return-toggle-switch">
      <ToggleSwitch $isToggled={isReturn} onClick={handleToggleClick} />
      <span> {strings.AIRPORT_TRANSFER.ADD_RETURN}</span>

      <ReactModal
        isOpen={isInfoDrawerOpen}
        onRequestClose={() => close()}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        shouldReturnFocusAfterClose
        preventScroll={true}
        style={popupStyles}
      >
        <PopupHeader>
          <h3>{strings.AIRPORT_TRANSFER.HEADS_UP}</h3>
          <CloseIcon onClick={close} />
        </PopupHeader>

        {popupContent}
      </ReactModal>
    </ReturnToggleContainer>
  );
};
