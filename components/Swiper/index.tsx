import React, { useEffect, useRef } from 'react';
import {
  Autoplay,
  EffectCards,
  EffectFade,
  FreeMode,
  Lazy,
  Navigation,
  Pagination,
} from 'swiper';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-fade';
import 'swiper/css/lazy';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface ISwiperWrapper extends SwiperProps {
  children: React.ReactNode[];
  nextButton?: HTMLElement | React.ReactNode | JSX.Element;
  previousButton?: HTMLElement | React.ReactNode | JSX.Element;
  isFreeMode?: boolean;
  initialSlide?: number;
}

const SwiperWrapper = (props: ISwiperWrapper) => {
  const swiperRef = useRef<SwiperType>();
  const showPagination = props.pagination,
    showNavigation = props.navigation,
    enableAutoplay = props.autoplay,
    enableFadeEffect = props.fadeEffect,
    isLazy = props.lazy,
    enableCardsEffect = props.cardsEffect;

  const {
    nextButton,
    previousButton,
    children,
    isFreeMode,
    initialSlide,
    ...restProps
  } = props;
  const modules = [];

  showPagination && modules.push(Pagination);
  showNavigation && modules.push(Navigation);
  enableAutoplay && modules.push(Autoplay);
  isLazy && modules.push(Lazy);
  isFreeMode && modules.push(FreeMode);
  enableFadeEffect && modules.push(EffectFade);
  enableCardsEffect && modules.push(EffectCards);

  useEffect(() => {
    if (initialSlide !== undefined && swiperRef.current) {
      swiperRef.current.slideTo(initialSlide, 0);
    }
  }, [initialSlide]);

  return (
    <Swiper
      {...restProps}
      modules={modules}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
        props.onSwiper?.(swiper);
      }}
    >
      {children?.map((element, index) =>
        element ? <SwiperSlide key={index}>{element}</SwiperSlide> : null
      )}
      <Conditional if={nextButton && showNavigation}>{nextButton}</Conditional>
      <Conditional if={previousButton && showNavigation}>
        {previousButton}
      </Conditional>
    </Swiper>
  );
};
export default SwiperWrapper;
