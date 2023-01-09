import React from 'react';
import { Pagination, Navigation, Autoplay, Lazy } from 'swiper';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import Conditional from 'components/common/Conditional';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/lazy';
import 'swiper/css/autoplay';

interface ISwiperWrapper extends SwiperProps {
  children: React.ReactNode[];
  nextButton?: HTMLElement | React.ReactNode | JSX.Element;
  previousButton?: HTMLElement | React.ReactNode | JSX.Element;
}

const SwiperWrapper: React.FC<ISwiperWrapper> = (props) => {
  const showPagination = props.pagination,
    showNavigation = props.navigation,
    enableAutoplay = props.autoplay,
    isLazy = props.lazy;

  const { nextButton, previousButton, children, ...restProps } = props;
  const modules = [];

  showPagination && modules.push(Pagination);
  showNavigation && modules.push(Navigation);
  enableAutoplay && modules.push(Autoplay);
  isLazy && modules.push(Lazy);

  return (
    <React.Fragment>
      {/* @ts-ignore */}
      <Swiper {...restProps} modules={modules}>
        {children.map((element, index) =>
          element ? <SwiperSlide key={index}>{element}</SwiperSlide> : null
        )}
        <Conditional if={nextButton && showNavigation}>
          {nextButton}
        </Conditional>
        <Conditional if={previousButton && showNavigation}>
          {previousButton}
        </Conditional>
      </Swiper>
    </React.Fragment>
  );
};
export default SwiperWrapper;
