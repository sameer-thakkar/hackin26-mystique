import React, { useEffect, useRef, useState } from 'react';
import { HOLIDAY_ASSETS } from 'const/index';
import { AnimationItem } from 'lottie-web';
import { Props } from 'components/common/LottieLogo/interface';
import { LottieWrapper } from 'components/common/LottieLogo/styles';

const LottieLogo = ({ hideHeadoutLogo, isEntertainmentMB }: Props) => {
  const lottieWebAnimationItemRef = useRef<AnimationItem>(null),
    lottieContainerRef = useRef<HTMLDivElement>(null),
    animationFrameCount = useRef<number>(0);

  const [isVisible, setVisible] = useState(false);

  const onDataReady = () => {
    hideHeadoutLogo();
    setVisible(true);
    lottieWebAnimationItemRef.current.play();

    animationFrameCount.current = lottieWebAnimationItemRef.current.getDuration(
      true
    );
    lottieWebAnimationItemRef.current.resize();

    setInterval(() => {
      lottieWebAnimationItemRef.current.playSegments([
        57,
        animationFrameCount.current,
      ]);
    }, 4500);
  };

  useEffect(() => {
    import('lottie-web').then((lottieWebInstance) => {
      lottieWebAnimationItemRef.current = lottieWebInstance.default.loadAnimation(
        {
          autoplay: false,
          loop: false,
          path: HOLIDAY_ASSETS.POWERED_BY_HEADOUT_LOGO,
          container: lottieContainerRef.current,
        }
      );

      lottieWebAnimationItemRef.current.addEventListener('data_ready', () => {
        setTimeout(() => {
          onDataReady();
        }, 2000);
      });
    });
  }, []);

  return (
    <LottieWrapper
      setVisible={isVisible}
      isEntertainmentMB={isEntertainmentMB}
      ref={lottieContainerRef}
    ></LottieWrapper>
  );
};

export default LottieLogo;
