import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { Button } from '@headout/eevee';
import { Image } from '@headout/espeon/components/common/Image';
import { cx } from '@headout/pixie/css';
import {
  DROPS_EXIT_INTENT_QR_CODE_IMAGES,
  DROPS_QR_CODE_IMAGES,
} from 'components/AppDrops/constants';
import { TDownloadAppNudgeProps } from 'components/AppDrops/types';
import { trackEvent } from 'utils/analytics';
import { getDownloadAppAssets } from 'utils/appAssets';
import { getLangObject } from 'utils/helper';
import { appAtom } from 'store/atoms/app';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  FALSE,
  LanguagesUnion,
  TRUE,
} from 'const/index';
import { strings } from 'const/strings';
import {
  exitIntentQRContainer,
  nudgeButton,
  qrCodeContainer,
  qrCodeImage,
  qrCodeImageContainer,
  qrCodeLinks,
  qrCodeLinksContainer,
} from './styles';

export const DownloadAppNudge = ({
  isExitIntent,
  cityCode,
}: TDownloadAppNudgeProps) => {
  const appState = useRecoilValue(appAtom);
  const language = getLangObject(appState.language).code as LanguagesUnion;
  const {
    PLAY_STORE_LINK,
    APP_STORE_LINK,
    PLAY_STORE_IMAGE_URL_LIGHT,
    APP_STORE_IMAGE_URL_LIGHT,
  } = getDownloadAppAssets(language);

  const qrCodeImageUrl = useMemo(() => {
    if (isExitIntent) {
      return DROPS_EXIT_INTENT_QR_CODE_IMAGES[
        cityCode as keyof typeof DROPS_EXIT_INTENT_QR_CODE_IMAGES
      ];
    }
    return DROPS_QR_CODE_IMAGES[cityCode as keyof typeof DROPS_QR_CODE_IMAGES];
  }, [cityCode, isExitIntent]);

  const handleStoreClick = (storeType: 'Play Store' | 'App Store') => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.STORE_DOWNLOAD_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.STORE_TYPE]: storeType,
      [ANALYTICS_PROPERTIES.CITY_CODE]: cityCode,
      [ANALYTICS_PROPERTIES.IS_EXIT_INTENT]: isExitIntent ? TRUE : FALSE,
    });
  };

  return (
    <div className={cx(qrCodeContainer, isExitIntent && exitIntentQRContainer)}>
      <div className={qrCodeLinksContainer}>
        <div className={qrCodeLinks}>
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href={PLAY_STORE_LINK}
            onClick={() => handleStoreClick('Play Store')}
          >
            <Image
              url={PLAY_STORE_IMAGE_URL_LIGHT}
              alt="Play Store Button"
              width={isExitIntent ? 88 : 106}
              height={isExitIntent ? 30 : 36}
              quality={100}
              density={2}
              fetchPriority="high"
            />
          </Link>
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href={APP_STORE_LINK}
            onClick={() => handleStoreClick('App Store')}
          >
            <Image
              url={APP_STORE_IMAGE_URL_LIGHT}
              alt="App Store Button"
              width={isExitIntent ? 88 : 106}
              height={isExitIntent ? 30 : 36}
              quality={100}
              density={2}
              fetchPriority="high"
            />
          </Link>
        </div>
      </div>
      <div className={qrCodeImage}>
        <div className={qrCodeImageContainer}>
          <Image
            url={qrCodeImageUrl}
            alt="App QR Code"
            width={148}
            height={170}
            quality={100}
            density={2}
            fetchPriority="high"
          />
          <Button
            as={'button'}
            className={nudgeButton}
            btnType="black"
            variant={'primary'}
            size="small"
            primaryText={strings.DROPS.NUDGE_CTA}
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadAppNudge;
