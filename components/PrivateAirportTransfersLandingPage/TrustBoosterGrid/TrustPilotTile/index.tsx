import React from 'react';
import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import {
  NumberHighlighterSVG,
  TrustPilotRatingSVG,
  TrustPilotSVG,
} from 'assets/airportTransfers/privateAirportTransfers';
import { TRUSTPILOT_IMAGE_BG_URL } from '../../constants';
import {
  backgroundImageStyle,
  containerStyle,
  contentContainerStyle,
  desktopBgSvgStyle,
  mobileBgSvgStyle,
  ratingStarsStyle,
  ratingStyle,
  trustPilotLogoStyle,
} from './style';

export const TrustpilotTile = ({ isMobile }: { isMobile: boolean }) => {
  const trackClick = () => {
    trackEvent({
      eventName: 'Trust Numbers Clicked',
    });
  };

  return (
    <a
      href="https://www.trustpilot.com/review/headout.com"
      target="_blank"
      onClick={trackClick}
    >
      <div className={containerStyle}>
        <svg
          width="391"
          height="241"
          viewBox="0 0 391 241"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={desktopBgSvgStyle}
        >
          <path d="M391 0C187 23.5823 35 161.5 0 241V0H391Z" fill="#15243A" />
        </svg>

        <svg
          width="164"
          height="100%"
          viewBox="0 0 164 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={mobileBgSvgStyle}
          preserveAspectRatio="none"
        >
          <path
            d="M0 140V0H164C136.579 48.8649 152.574 113.694 164 140H0Z"
            fill="#15243A"
          />
        </svg>

        <Image
          url={TRUSTPILOT_IMAGE_BG_URL}
          alt="Trustpilot"
          aspectRatio={isMobile ? '268:140' : undefined}
          className={backgroundImageStyle}
          fitCrop
          cropMode={'focalpoint'}
          focalPointParams={{
            x: 0.45,
            y: 0.4,
            zoom: 1.2,
          }}
        />

        <TrustPilotSVG className={trustPilotLogoStyle} />

        <div className={contentContainerStyle}>
          <div className={ratingStyle}>
            4.3
            <NumberHighlighterSVG />
          </div>

          <TrustPilotRatingSVG className={ratingStarsStyle} />
        </div>
      </div>
    </a>
  );
};
