import { useEffect, useRef } from 'react';
import {
  StyledBannerWrapper,
  StyledLottieWrapper,
  StyledTextWrapper,
  StyledCTAWrapper,
} from 'components/WanderfestBanner/styles';
import type { TWanderfestBannerProps } from 'components/WanderfestBanner/interface';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, WANDERFEST_ASSETS } from 'const/index';
import { strings } from 'const/strings';

const WanderfestBanner: React.FC<TWanderfestBannerProps> = ({
  isV1Design,
  isMobile,
}) => {
  const lottieContainerRef = useRef(null);

  useEffect(() => {
    import('lottie-web').then((lottieWebInstance) => {
      if (!lottieContainerRef.current) return;
      lottieWebInstance.default.destroy();
      lottieWebInstance.default.loadAnimation({
        autoplay: true,
        loop: true,
        path: isMobile
          ? WANDERFEST_ASSETS.MWEB_LOGO_URL
          : WANDERFEST_ASSETS.DWEB_LOGO_URL,
        container: lottieContainerRef.current,
      });
    });
  }, [isMobile]);

  useEffect(() => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.WF_BANNER_VIEWED,
    });
  }, []);

  const handleClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.WF_BANNER_CTA_CLICKED,
    });
  };

  return (
    <a
      target={'_blank'}
      href={'https://www.headout.com/wanderfest-uae/'}
      rel="noreferrer"
    >
      <StyledBannerWrapper
        $isV1Design={isV1Design}
        onClick={() => handleClick()}
      >
        <StyledLottieWrapper ref={lottieContainerRef} />
        <StyledTextWrapper>
          <h3>{strings.WANDERFEST.UAE_BEST_EXP}</h3>
          <p>{strings.WANDERFEST.UNBELIEVABLE_DISCOUNTS}</p>
        </StyledTextWrapper>
        <StyledCTAWrapper>
          <button type="button">{strings.WANDERFEST.SEIZE_THE_DEALS}</button>
        </StyledCTAWrapper>
      </StyledBannerWrapper>
    </a>
  );
};

export default WanderfestBanner;
