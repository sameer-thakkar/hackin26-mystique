import React from 'react';
import { Text } from '@headout/eevee';
import { DROPS_BANNER_QR_CODE_URL } from 'components/AppDrops/constants';
import { titleAppNudge } from 'components/AppDrops/styles';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import { Steps } from '../Steps';
import {
  container,
  divider,
  leftSectionAppNudge,
  qrCode,
  qrCodeContainer,
} from './styles';

export const DownloadAppNudge = () => {
  const translations = strings.DROPS.DOWNLOAD_APP_NUDGE;

  return (
    <div className={container}>
      <div className={leftSectionAppNudge}>
        <Text
          as="h3"
          className={titleAppNudge}
          textStyle={'tags.booster'}
          color={'core.candy.800'}
        >
          {translations.TITLE}
        </Text>
        <Steps variant={{ variant: 'default' }} />
      </div>
      <div className={divider} />
      <div className={qrCodeContainer}>
        <Text
          as="span"
          textStyle={'ui.label.small.heavy'}
          color={'semantic.text.grey.2'}
        >
          {translations.QR_SCAN_TEXT}
        </Text>
        <div className={qrCode}>
          <Image
            url={DROPS_BANNER_QR_CODE_URL}
            alt="QR Code"
            width={90}
            height={90}
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadAppNudge;
