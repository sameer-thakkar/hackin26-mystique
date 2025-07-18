import React, { useLayoutEffect, useMemo } from 'react';
import { Text } from '@headout/eevee';
import { css, cx } from '@headout/pixie/css';
import {
  DROPS_IMAGE_URLS,
  DROPS_RIVE_URI,
} from 'components/AppDrops/constants';
import { TExitIntentDialogContentProps } from 'components/AppDrops/types';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { useRive } from 'hooks/useRive';
import { setRiveExperienceNames } from 'utils/dropsUtils';
import { pickByKeys } from 'utils/gen';
import { strings } from 'constants/strings';
import CloseIcon from 'assets/closeIcon';
import { DiscountTag } from '../DiscountTag';
import { DownloadAppNudge } from '../DownloadAppNudge';
import {
  dialogCloseButton,
  dialogFlexDisplay,
  dialogGradientTopSection,
  dialogPopupContainer,
  dialogPopupContent,
  dialogPopupHidden,
  dialogPopupVisible,
  dialogRiveContainer,
  DWEB_LEFT_BOTTOM_SECTION_BG,
  DWEB_RIGHT_SECTION_BG,
  textTitleStyle,
} from './styles';

const ExitIntentDialogContent = ({
  onClose,
  isVisible = true,
  cityCode,
}: TExitIntentDialogContentProps) => {
  const { RiveComponent, isLoading, isError, rive } = useRive({
    src: DROPS_RIVE_URI,
    stateMachines: 'State Machine 1',
    artboard: `dWeb_${cityCode}`,
    autoplay: true,
  });

  const bannerTitle = useMemo(
    () =>
      strings.formatString(
        strings.DROPS.TITLE,
        strings.DROPS.CITY_WISE_LABELS[
          cityCode as keyof typeof strings.DROPS.CITY_WISE_LABELS
        ]?.price
      ),
    [cityCode]
  );

  const bannerSubtitle = useMemo(
    () =>
      strings.formatString(
        strings.DROPS.SUBTITLE,
        strings.DROPS.CITY_WISE_LABELS[
          cityCode as keyof typeof strings.DROPS.CITY_WISE_LABELS
        ]?.cityName
      ),
    [cityCode]
  );

  useLayoutEffect(() => {
    setRiveExperienceNames(
      rive,
      cityCode,
      pickByKeys(strings as Record<string, any>, ['DROPS'])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityCode, rive]);

  const handleClose = () => {
    onClose?.();
  };

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
        <CloseIcon width={16} height={16} strokeWidth={2} color="#ffffff" />
      </button>

      <div className={dialogGradientTopSection}>
        <div className={dialogFlexDisplay}>
          <div className={dialogPopupContent}>
            <DiscountTag />
            <Text
              as="h1"
              className={textTitleStyle}
              textStyle="display.regular"
              color="core.candy.700"
            >
              {bannerTitle}
            </Text>
            <Text
              as="p"
              className={css({ marginTop: '8px' })}
              textStyle="para.medium"
              color="semantic.text.grey.2"
            >
              {bannerSubtitle}
            </Text>
            <DownloadAppNudge cityCode={cityCode} isExitIntent />
          </div>
          <div className={dialogRiveContainer}>
            <Conditional if={!isLoading && !isError}>
              <RiveComponent />
            </Conditional>
          </div>
        </div>
      </div>
      <Image
        url={DROPS_IMAGE_URLS.DWEB_RIGHT_SECTION_BG}
        alt="Drops Web Banner Section BG"
        width={754}
        height={378}
        className={DWEB_RIGHT_SECTION_BG}
      />
      <div className={DWEB_LEFT_BOTTOM_SECTION_BG} />
    </div>
  );
};

export default ExitIntentDialogContent;
