import type { CSSProperties, MutableRefObject } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@headout/eevee';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import LeftArrow from 'components/Espeon/Assets/LeftArrow';
import RightArrow from 'components/Espeon/Assets/RightArrow';
import { debounce } from 'utils/gen';
import {
  DATA_INDEX_ATTRIBUTE,
  DEFAULT_BLUR_WIDTH_IN_PX,
  DIRECTIONS,
} from './constants';
import PageIndicator from './Indicators';
import {
  buttonWrapper,
  container,
  slidesWrapper,
  slideWrapper,
} from './styles';
import type { TSwiperDirection, TSwiperProps } from './types';
import {
  ESlideWidth,
  ESwiperNextPrevControls,
  ESwiperNextPrevPosX,
  ESwiperNextPrevSize,
} from './types';
import {
  getDirection,
  getSlideDynamicStyles,
  getSlideIndex,
  getSlidesWrapperDynamicStyles,
  wheelListener,
} from './utils';

const { FORWARD, BACKWARD } = DIRECTIONS;

// TODO: Breakdown into smaller components
export const Swiper = (props: TSwiperProps) => {
  const {
    slidesToShow = 0,
    slideWidth,
    blurWidthInPx = DEFAULT_BLUR_WIDTH_IN_PX,
    slidesToScrollBy = 1,
    loop = false,
    pauseAutoPlayOnHover = true,
    autoPlay = false,
    autoPlayTimeMs = 3000,
    onSlideChanged,
    nextPrevControls = ESwiperNextPrevControls.Hide,
    nextPrevControlSize = ESwiperNextPrevSize.Medium,
    nextPrevControlPosX = ESwiperNextPrevPosX.Edge,
    nextPrevControlPosY = '50%',
    paginationDots = false,
    swiperRef,
    children = [],
    beforeChangeCallback,
    allowLoopOnMobile = false,
    rtlEnabled = false,
    edgeCompensation = 0,
    variant,
    showBlurNearEdges = false,
    isMobile,
  } = props;
  const { consumer } = variant || {};

  const slidesWrapperRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const [currentPaginationIndex, setCurrentPaginationIndex] = useState(0);
  const [currIndex, setCurrIndex] = useState(0);
  const autoPlayTimerId = useRef<number | undefined>();

  const [direction, setDirection] = useState<TSwiperDirection>(FORWARD);
  const [showNextPrevControls, setShowNextPrevControls] = useState(
    nextPrevControls === ESwiperNextPrevControls.Show
  );

  const [isCustomScrollingInProgress, setIsCustomScrollingInProgress] =
    useState(false);
  const [wasLastScrollCustom, setWasLastScrollCustom] = useState<
    boolean | null
  >(null); // null means no scroll has happened yet

  const isLoop = useCallback(() => {
    const slidesWrapperEl = slidesWrapperRef?.current;
    if (!slidesWrapperEl) return false;

    const firstSlide = slideRefs.current[0];

    return (
      (!isMobile || allowLoopOnMobile) &&
      loop &&
      children.length > 2 &&
      slidesWrapperEl.offsetWidth === firstSlide.offsetWidth
    );
  }, [allowLoopOnMobile, children.length, isMobile, loop]);
  const isSlideWidthVariable = slideWidth === ESlideWidth.Variable;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigate = (direction: TSwiperDirection) => {
    setDirection(direction);
    setIsCustomScrollingInProgress(true);
    slidesWrapperRef?.current?.parentElement?.addEventListener(
      'wheel',
      wheelListener,
      { passive: false }
    );
  };

  useEffect(() => {
    setShowNextPrevControls(nextPrevControls === ESwiperNextPrevControls.Show);
  }, [nextPrevControls]);

  useEffect(() => {
    const slidesWrapperEl = slidesWrapperRef?.current;
    if (!slidesWrapperEl || !isCustomScrollingInProgress) {
      slidesWrapperEl?.parentElement?.removeEventListener(
        'wheel',
        wheelListener
      );
      return;
    }

    let scrollTo = 0;
    const elements = slideRefs.current;
    const wrapperWidth = slidesWrapperEl.offsetWidth;

    if (isSlideWidthVariable) {
      let wrapperOffset = slidesWrapperEl.scrollLeft;
      const actualBlurWidth = showBlurNearEdges ? blurWidthInPx : 0;

      wrapperOffset +=
        direction === FORWARD
          ? wrapperWidth - actualBlurWidth
          : actualBlurWidth;

      const elementAtTheEdgeIndex = elements.findIndex((element) => {
        return element.offsetLeft + element.offsetWidth > wrapperOffset;
      });

      const elementAtTheEdge = elements[elementAtTheEdgeIndex];
      if (elementAtTheEdge) {
        scrollTo = elementAtTheEdge.offsetLeft - actualBlurWidth;

        if (direction === BACKWARD) {
          const rightOfElementAtTheEdge =
            elementAtTheEdge.offsetLeft +
            elementAtTheEdge.offsetWidth +
            actualBlurWidth;

          scrollTo = rightOfElementAtTheEdge - wrapperWidth;
        }
      }
    } else {
      const firstSlide = elements[0];
      const fixedSlideWidth = firstSlide.offsetWidth;
      const scrollBy = fixedSlideWidth * slidesToScrollBy;
      const maxScrollLeft = slidesWrapperEl.scrollWidth - wrapperWidth;

      if (direction === FORWARD) {
        scrollTo = Math.abs(slidesWrapperEl.scrollLeft) + scrollBy;
        scrollTo = Math.min(scrollTo, maxScrollLeft);
      } else if (direction === BACKWARD) {
        scrollTo = Math.abs(slidesWrapperEl.scrollLeft) - scrollBy;
        if (!loop && scrollTo < 0) {
          scrollTo = 0;
        }
      }

      // right edge. Specially handle to ensure a non-edge slide is starts at the left and it does
      // no affected when we put the snap scrolling back
      if (
        direction === BACKWARD &&
        slidesWrapperEl.scrollLeft === maxScrollLeft
      ) {
        const fractionOfPartialSlideVisible = wrapperWidth % fixedSlideWidth;
        scrollTo =
          slidesWrapperEl.scrollLeft -
          (fractionOfPartialSlideVisible > 0
            ? fixedSlideWidth - fractionOfPartialSlideVisible
            : Math.min(wrapperWidth, slidesWrapperEl.scrollLeft));
      }
    }

    // set custom scrolling flag to false after scroll is complete
    let scrollTimeout: NodeJS.Timeout;
    slidesWrapperEl.addEventListener(
      'scroll',
      function onScroll() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          setIsCustomScrollingInProgress(false);
          slidesWrapperEl.removeEventListener('scroll', onScroll);
        }, 50);
      },
      {
        passive: true,
      }
    );

    requestAnimationFrame(() => {
      slidesWrapperEl.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      });
    });
  }, [isCustomScrollingInProgress]);

  const startAutoPlay = useCallback(() => {
    if (!autoPlay) return;

    stopAutoPlay();
    autoPlayTimerId.current = window.setInterval(
      () => navigate(FORWARD),
      autoPlayTimeMs
    );
  }, [autoPlay, autoPlayTimeMs, navigate]);

  const stopAutoPlay = () => {
    window.clearInterval(autoPlayTimerId.current);
    autoPlayTimerId.current = undefined;
  };

  const moveForward = () => {
    navigate(FORWARD);
  };

  const moveBackward = () => {
    navigate(BACKWARD);
  };

  const updateShowNextPrevControls = (show: boolean) => {
    if (nextPrevControls === 'show-on-hover') {
      setShowNextPrevControls(show);
    }
  };

  const onMouseEnter = () => {
    if (autoPlay && pauseAutoPlayOnHover) {
      stopAutoPlay();
    }
    updateShowNextPrevControls(true);
  };

  const onMouseLeave = () => {
    if (autoPlay && pauseAutoPlayOnHover) {
      startAutoPlay();
    }
    updateShowNextPrevControls(false);
  };

  const onArrowClicked: (isLeft: boolean) => void = debounce(
    (isLeft: boolean) => {
      if (isCustomScrollingInProgress) {
        return;
      }

      const shouldStopStartAutoPlay = autoPlay && !pauseAutoPlayOnHover;
      if (shouldStopStartAutoPlay) {
        stopAutoPlay();
      }
      if (rtlEnabled) {
        (isLeft ? moveForward : moveBackward)();
      } else {
        (isLeft ? moveBackward : moveForward)();
      }
      if (shouldStopStartAutoPlay) {
        startAutoPlay();
      }
    },
    100
  );

  useEffect(() => {
    if (swiperRef) {
      swiperRef.current = {
        ...swiperRef?.current,
        nextSlide: moveForward,
        prevSlide: moveBackward,
        scrollToSlide(index) {
          const slidesWrapperEl = slidesWrapperRef?.current;
          if (slidesWrapperEl) {
            const slide = slidesWrapperEl.querySelector<HTMLDivElement>(
              `[${DATA_INDEX_ATTRIBUTE}="${index}"]`
            );
            if (slide) {
              slidesWrapperEl.scrollLeft = slide.offsetLeft;
            }
          }
        },
      };
    }

    const slidesWrapperEl = slidesWrapperRef?.current;

    const startEvent = isMobile ? 'touchstart' : 'mouseenter';
    const endEvent = isMobile ? 'touchend' : 'mouseleave';

    if (slidesWrapperEl) {
      slidesWrapperEl.parentElement?.addEventListener(
        startEvent,
        onMouseEnter,
        { passive: true }
      );
      slidesWrapperEl.parentElement?.addEventListener(endEvent, onMouseLeave, {
        passive: true,
      });
    }

    return () => {
      slidesWrapperEl?.parentElement?.removeEventListener(
        endEvent,
        onMouseLeave
      );
      slidesWrapperEl?.parentElement?.removeEventListener(
        startEvent,
        onMouseLeave
      );
      observer.current?.disconnect();
      stopAutoPlay();
    };
  }, []);

  useEffect(() => {
    observer.current?.disconnect(); // when children change dynamically. May need to support activeIndex as props

    const handler = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio === 1) {
          const slideIndex = getSlideIndex(entry.target);
          if (!isNaN(slideIndex)) {
            setCurrIndex((oldCurrIndex) => {
              setDirection(getDirection(oldCurrIndex, slideIndex));
              return slideIndex;
            });
          }
        } else if (entry.intersectionRatio >= 0.52) {
          const slideIndex = getSlideIndex(entry.target);
          if (!isNaN(slideIndex)) {
            beforeChangeCallback?.(slideIndex);
            setCurrentPaginationIndex(slideIndex);
            setWasLastScrollCustom(isCustomScrollingInProgress);

            /* If isCustomScrollingInProgress is false, and still observer runs means
                it is coming because of a swipe. If it is coming from a swipe, call stopAutoplay fn
                if autoplay is true, and start it again. This ensures that the interval restarts. */
            if (!isCustomScrollingInProgress) {
              startAutoPlay(); // Didn't call stopAutoPlay as this fn intercally calls stopAutoPlay
            }
          }
        }
      });
    };

    const options = {
      root: slidesWrapperRef?.current,
      rootMargin: '0px',
      threshold: [1, 0.52],
    };

    observer.current = new IntersectionObserver(handler, options);
    for (const node of slideRefs.current) {
      if (node) {
        observer.current.observe(node);
      }
    }
  }, [children.length, isCustomScrollingInProgress]);

  useEffect(() => {
    if (onSlideChanged) {
      onSlideChanged({
        index: currIndex,
        isLeftArrowEnabled: shouldShowNextPrevBtn(true, true),
        isRightArrowEnabled: shouldShowNextPrevBtn(false, true),
        isScrollCustom: wasLastScrollCustom,
      });
    }

    const slidesWrapperEl = slidesWrapperRef?.current;
    if (!slidesWrapperEl || !isLoop()) return;

    let { scrollLeft } = slidesWrapperEl;

    const {
      scrollWidth,
      offsetWidth: width,
      children: childrenNodes,
    } = slidesWrapperEl;

    const dir = rtlEnabled ? -1 : 1;
    scrollLeft = Math.abs(scrollLeft);

    if (scrollLeft <= width) {
      slidesWrapperEl.prepend(childrenNodes[childrenNodes.length - 1]);
      slidesWrapperEl.scrollLeft = (scrollLeft + width) * dir;
    } else if (Math.floor(scrollWidth - scrollLeft) <= width) {
      slidesWrapperEl.append(childrenNodes[0]);
      slidesWrapperEl.scrollLeft = (scrollLeft - width) * dir;
    }
  }, [currIndex, children.length, wasLastScrollCustom]);

  useEffect(() => {
    if (autoPlay) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  }, [autoPlay, autoPlayTimeMs, startAutoPlay]);

  const shouldShowNextPrevBtn = useCallback(
    (isLeft: boolean, isExternalArrowButtons = false): boolean => {
      const slidesWrapperEl = slidesWrapperRef?.current;
      if (
        !slidesWrapperEl ||
        (!isExternalArrowButtons && !showNextPrevControls) ||
        children.length === 1
      )
        return false;

      if (isLoop()) {
        return true;
      }

      return isLeft
        ? slidesWrapperEl.scrollLeft > 0
        : Math.floor(
            slideRefs.current[
              slideRefs.current.length - 1
            ]?.getBoundingClientRect()?.right
          ) -
            Math.floor(slidesWrapperEl?.getBoundingClientRect()?.right) >
            0;
    },
    [children.length, isLoop, isMobile, showNextPrevControls]
  );

  const shouldSnapScroll = useCallback(() => {
    if (isMobile) {
      if (isLoop()) return true;
      return false;
    } else {
      return !isCustomScrollingInProgress && !isSlideWidthVariable;
    }
  }, [isMobile, isCustomScrollingInProgress, isLoop]);

  if (!children.length) {
    return null;
  }

  const onSlideClick = (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>
  ) => {
    const slideEle = event.currentTarget;
    if (!isSlideWidthVariable || !slideEle) return;

    const slidesWrapperEl = slidesWrapperRef?.current;
    if (!slidesWrapperEl || !slideEle) return;

    /**
         Usecases to scroll to center
         - intersecting at left edge
         - intersecting at right edge and we also want to center a slide that is fully
         visible when next slide is not so that user knows there is more content
         */
    const actualBlurWidth = showBlurNearEdges ? blurWidthInPx : 0;

    if (
      isMobile ||
      slideEle.offsetLeft < slidesWrapperEl.scrollLeft + actualBlurWidth ||
      slideEle.offsetLeft + slideEle.offsetWidth >
        slidesWrapperEl.scrollLeft +
          slidesWrapperEl.offsetWidth -
          actualBlurWidth
    ) {
      slideEle.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  };

  const showPrevBtn = shouldShowNextPrevBtn(true);
  const showNextBtn = shouldShowNextPrevBtn(false);

  // const getButtonSize = () => {
  // 	if (nextPrevControlSize === 'small') {
  // 		return '1.5rem';
  // 	} else {
  // 		return '2rem';
  // 	}
  // };

  const slideWrapperDynamicStyles = getSlidesWrapperDynamicStyles({
    isMobile,
    edgeCompensation,
    isVariable: isSlideWidthVariable,
  });
  const slideWrapperStyles = slidesWrapper({
    enableForward: !!showNextBtn && showBlurNearEdges,
    enablePrev: !!showPrevBtn && showBlurNearEdges,
    rtlEnabled: rtlEnabled,
    isSnapScrolling: !isCustomScrollingInProgress,
  });
  const buttonDynamicStyles = {
    '--top': nextPrevControlPosY,
    '--left': nextPrevControlPosX === 'edge' ? '0' : nextPrevControlPosX,
    '--right': nextPrevControlPosX === 'edge' ? '0' : nextPrevControlPosX,
  } as CSSProperties;
  // const buttonSize = getButtonSize();

  return (
    <div className={container({ consumer })}>
      <div
        ref={slidesWrapperRef as MutableRefObject<HTMLDivElement>}
        className={cx(slideWrapperStyles, 'custom-swiper-slides-wrapper')}
        style={slideWrapperDynamicStyles}
        role="region"
        aria-roledescription="carousel"
      >
        {children.map((child, index) => {
          const slideDynamicStyles = getSlideDynamicStyles({
            slidesToShow,
            slideWidth,
          });
          const slideStyle = slideWrapper({
            shouldSnapScroll: shouldSnapScroll(),
            enableLastChildMargin:
              isSlideWidthVariable && index === children.length - 1,
          });

          return (
            <div
              key={index}
              ref={(node: HTMLDivElement | null) => {
                if (node) slideRefs.current[index] = node;
              }}
              {...{ [DATA_INDEX_ATTRIBUTE]: index }}
              className={cx(slideStyle, 'custom-swiper-slide')}
              style={slideDynamicStyles}
              onClick={onSlideClick}
              onKeyDown={onSlideClick}
              role="button"
              tabIndex={0}
              aria-roledescription="slide"
            >
              {child}
            </div>
          );
        })}
      </div>
      <Conditional if={paginationDots && children.length > 1}>
        <PageIndicator
          rtlEnabled={rtlEnabled}
          numberOfElements={children.length}
          activeIndex={currentPaginationIndex}
          dotPositionStandard
        />
      </Conditional>
      <Conditional if={showPrevBtn}>
        <Button
          as="button"
          btnType="black"
          icon={<LeftArrow />}
          iconPosition="leading"
          onClick={(event) => {
            event.stopPropagation();
            onArrowClicked(true);
          }}
          primaryText=""
          size="small"
          state="default"
          variant="secondary"
          // borderRadius={'radius.50p'}
          // height={buttonSize}
          // width={buttonSize}
          className={buttonWrapper({ size: nextPrevControlSize })}
          style={buttonDynamicStyles}
          aria-label="Previous slide"
        />
      </Conditional>
      <Conditional if={showNextBtn}>
        <Button
          as="button"
          btnType="black"
          icon={<RightArrow />}
          iconPosition="leading"
          onClick={(event) => {
            event.stopPropagation();
            onArrowClicked(false);
          }}
          primaryText=""
          size="small"
          state="default"
          variant="secondary"
          // borderRadius={'radius.50p'}
          // height={buttonSize}
          // width={buttonSize}
          className={buttonWrapper({
            alignment: 'right',
            size: nextPrevControlSize,
          })}
          style={buttonDynamicStyles}
          aria-label="Next slide"
        />
      </Conditional>
    </div>
  );
};
