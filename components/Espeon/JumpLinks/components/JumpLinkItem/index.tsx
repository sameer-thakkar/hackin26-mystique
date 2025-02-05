import React, { type FC, useEffect, useState } from 'react';
import { Text } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import { token } from '@headout/pixie/tokens';
import Conditional from 'components/common/Conditional';
import { cubicBezier } from 'components/Espeon/utils/bezier-easing';
import Image from 'components/UI/Image';
import ChevronRight from 'assets/chevronRight';
import { jumpLinkItemRecipe } from './styles';
import type { TJumpLinkItem } from './types';

const JumpLinkItem: FC<{
  item: TJumpLinkItem;
  isDesktop: boolean;
  trackEvent?: (eventData: any) => void;
}> = ({ item, isDesktop, trackEvent }) => {
  const {
    title,
    subtitle,
    images,
    isClickable = true,
    onClick,
    scrollToId,
    scrollToElement,
    slideShowInterval,
    scrollTopOffset = isDesktop ? 80 : 32,
    eventData,
  } = item;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (slideShowInterval && images.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, slideShowInterval);

      return () => clearInterval(intervalId);
    }
  }, [images, slideShowInterval]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isClickable) return;

    trackEvent?.({
      eventName: 'Jump Link Clicked',
      ...(eventData || {}),
    });

    const targetElement =
      scrollToElement || document.getElementById(scrollToId || '');
    if (targetElement) {
      const elementPosition =
        targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - scrollTopOffset;

      const start = window.scrollY;
      const change = offsetPosition - start;
      let scrollDuration = 1000; // duration in milliseconds

      switch (true) {
        case change <= 500:
          scrollDuration = 300;
          break;
        case change <= 1500:
          scrollDuration = 700;
          break;
        case change <= 2500:
          scrollDuration = 1000;
          break;
        case change <= 3500:
          scrollDuration = 1400;
          break;
        case change <= 4500:
          scrollDuration = 1800;
          break;
        default:
          scrollDuration = 2000;
          break;
      }

      const cubicBezierEasing = cubicBezier(0.7, 0, 0.3, 1); // Define the cubic-bezier curve

      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / scrollDuration, 1);
        const easedProgress = cubicBezierEasing(progress); // Apply cubic-bezier easing

        window.scrollTo(0, start + change * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }

    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(
        event as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>
      );
    }
  };

  const styles = jumpLinkItemRecipe.raw({ isDesktop, isClickable });

  return (
    <div
      className={css(styles.root)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Jump to ${title}`}
    >
      <div className={css(styles.imageContainer)}>
        <Image
          height={80}
          width={80}
          fill
          url={images[currentImageIndex].url}
          alt={images[currentImageIndex].alt}
          className={css(styles.image)}
        />
      </div>
      <div className={css(styles.content)}>
        <Text
          as="p"
          textStyle="Semantics/Subheading/Regular"
          color="core.primary.black"
        >
          {title}
        </Text>
        <div className={css(styles.subtitleContainer)}>
          <Text
            as="span"
            textStyle="Semantics/UI Label/Small"
            color="semantic.text.grey.3"
          >
            {subtitle}
          </Text>
          <Conditional if={isClickable}>
            <span className={css(styles.chevron)}>
              <ChevronRight
                height={10}
                width={10}
                fillColor={token('colors.semantic.icon.grey.2')}
                strokeWidth={1}
              />
            </span>
          </Conditional>
        </div>
      </div>
    </div>
  );
};

export default JumpLinkItem;
