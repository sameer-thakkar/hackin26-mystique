import React from 'react';
import { Text } from '@headout/eevee';
import { css, cx } from '@headout/pixie/css';
import {
  DROPS_EXIT_INTENT_QR_CODE_URL,
  DROPS_RIVE_URI,
} from 'components/AppDrops/constants';
import { titleAppNudge } from 'components/AppDrops/styles';
import { TExitIntentDialogContentProps } from 'components/AppDrops/types';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { useRive } from 'hooks/useRive';
import { strings } from 'constants/strings';
import CloseIcon from 'assets/closeIcon';
import { CurvedSeparator } from '../../assets/curvedSeperator';
import { DiscountTag } from '../DiscountTag';
import { Steps } from '../Steps';
import {
  dialogCloseButton,
  dialogCurvedBottomSection,
  dialogCurvedSvgContainer,
  dialogFlexContainer,
  dialogFlexDisplay,
  dialogGradientTopSection,
  dialogPopupContainer,
  dialogPopupContent,
  dialogPopupHidden,
  dialogPopupVisible,
  dialogQrCode,
  dialogQrCodeContainer,
  dialogRiveContainer,
  textTitleStyle,
} from './styles';

const ExitIntentDialogContent = ({
  onClose,
  isVisible = true,
}: TExitIntentDialogContentProps) => {
  const { RiveComponent, isLoading, isError } = useRive({
    src: DROPS_RIVE_URI,
    autoplay: true,
  });

  const handleClose = () => {
    onClose?.();
  };

  const translations = strings.DROPS.DOWNLOAD_APP_NUDGE;

  return (
    <div
      className={cx(
        dialogPopupContainer,
        isVisible ? dialogPopupVisible : dialogPopupHidden
      )}
      role="document"
    >
      <button
        className={dialogCloseButton}
        onClick={handleClose}
        aria-label="Close popup"
      >
        <CloseIcon width={16} height={16} strokeWidth={2} />
      </button>

      <div className={dialogGradientTopSection}>
        <div className={dialogFlexDisplay}>
          <div className={dialogPopupContent}>
            <DiscountTag isMobile={false} variant={{ variant: 'dialog' }} />
            <Text
              as="h1"
              className={textTitleStyle}
              textStyle={'display.small'}
              color={'core.candy.800'}
            >
              {strings.DROPS.EXIT_INTENT.TITLE}
            </Text>
            <Text
              as="p"
              className={css({ marginTop: '4px' })}
              textStyle={'para.regular'}
              color={'semantic.text.grey.2'}
            >
              {strings.DROPS.EXIT_INTENT.DESCRIPTION}
            </Text>
          </div>
          <div className={dialogRiveContainer}>
            <Conditional if={!isLoading && !isError}>
              <RiveComponent />
            </Conditional>
          </div>
        </div>

        <div className={dialogCurvedBottomSection}>
          <div className={dialogCurvedSvgContainer}>
            <CurvedSeparator />
          </div>
        </div>
      </div>
      <div className={dialogFlexContainer}>
        <div>
          <Text
            as="h3"
            className={titleAppNudge}
            textStyle={'tags.booster'}
            color={'core.candy.800'}
          >
            {translations.TITLE}
          </Text>
          <Steps
            variant={{ variant: 'dialog' }}
            showHighlightedTextLine={true}
          />
        </div>
        <div className={dialogQrCodeContainer}>
          <Text
            as="span"
            textStyle={'ui.label.small.heavy'}
            color={'semantic.text.grey.2'}
          >
            {translations.QR_SCAN_TEXT}
          </Text>
          <div className={dialogQrCode}>
            <Image
              url={DROPS_EXIT_INTENT_QR_CODE_URL}
              alt="QR Code"
              width={90}
              height={90}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentDialogContent;
