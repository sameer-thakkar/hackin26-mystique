import Image from 'UI/Image';
import { trackEvent } from 'utils/analytics';
import { TRUSTPILOT_IMAGE_BG_URL } from '../../constants';
import TrustpilotWidget from '../TrustPilotWidget';
import {
  backgroundImageStyle,
  containerStyle,
  mobileBgSvgStyle,
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
        <TrustpilotWidget
          isMobile={isMobile}
          height={isMobile ? '80px' : '112px'}
        />
      </div>
    </a>
  );
};
