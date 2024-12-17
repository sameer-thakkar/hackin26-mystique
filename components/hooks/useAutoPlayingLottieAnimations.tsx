import { type MutableRefObject, useEffect, useState } from 'react';
import type { AnimationConfigWithPath, AnimationItem } from 'lottie-web';
import useOnScreen from './useOnScreen';

const useAutoPlayingLottieAnimation = ({
  ref,
  animationProperties,
  additionalAnimationLoadingCondition = true,
}: {
  ref: MutableRefObject<HTMLElement | null>;
  additionalAnimationLoadingCondition?: boolean;
  animationProperties: Omit<
    AnimationConfigWithPath,
    'container' | 'autoplay' | 'renderer'
  >;
  onIntersection?: () => void;
}) => {
  const isOnScreen = useOnScreen({
    ref,
    options: { threshold: 0, rootMargin: '50px' },
  });

  const [animation, setAnimation] = useState<AnimationItem | null>(null);

  useEffect(() => {
    if (
      !ref ||
      !ref.current ||
      animation ||
      !additionalAnimationLoadingCondition
    )
      return;

    import('lottie-web').then((lottieWebInstance) => {
      setAnimation(
        lottieWebInstance.default.loadAnimation({
          ...animationProperties,
          renderer: 'svg',
          autoplay: false,
          container: ref.current!,
        })
      );
    });
  }, [additionalAnimationLoadingCondition]);

  useEffect(() => {
    if (!animation) return;

    if (animation.isLoaded) {
      if (isOnScreen) animation.play();
      else animation.pause();
    }
  }, [animation, animation?.isLoaded, isOnScreen]);

  return animation;
};

export default useAutoPlayingLottieAnimation;
