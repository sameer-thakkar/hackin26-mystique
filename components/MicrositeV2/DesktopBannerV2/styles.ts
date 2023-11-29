import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div`
  position: relative;
  height: auto;
  background: #150029;
  -webkit-transform: translate3d(0, 0, 0);
  margin-bottom: 0.875rem;

  .banner-cta-button:hover {
    box-shadow: 0px 8px 15px 0px rgba(255, 255, 255, 0.24);
  }

  .pinned-card-wrapper {
    background: linear-gradient(
      to bottom,
      #150029 50%,
      ${COLORS.BRAND.WHITE} 50%
    );
  }
`;

export const GradientWrapper = styled.div<{
  position: 'top' | 'bottom' | 'right';
}>`
  pointer-events: none;
  position: absolute;
  width: 100%;
  z-index: 2;

  ${({ position }) => {
    if (position === 'top') {
      return `top: 0;`;
    } else if (position === 'bottom') {
      return `bottom: 0px;`;
    } else if (position === 'right') {
      return `right: 0;`;
    }
  }};

  background: ${({ position }) => {
    if (position === 'top') {
      return 'linear-gradient(180deg, #150328 -0.07%, rgba(21, 3, 40, 0) 100%)';
    } else if (position === 'bottom') {
      return 'linear-gradient(0deg, #150328 -0.07%, rgba(21, 3, 40, 0) 100%)';
    } else if (position === 'right') {
      return 'linear-gradient(90deg, rgba(21, 3, 40, 0) -0.7%, #150328 100%)';
    }
  }};

  height: ${({ position }) =>
    position === 'right' ? '21.875rem' : '7.125rem'};

  @media (min-width: 768px) {
    width: ${({ position }) => (position === 'right' ? '7.125rem' : '70vw')};
    ${({ position }) => (position === 'right' ? 'top: 0;' : 'right: 0;')};
  }
`;

export const SwiperWrapper = styled.div`
  position: relative;
  -webkit-transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;

  .swiper-wrapper {
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
  }
  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    display: flex;
    height: auto;
    justify-content: flex-end;
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
    video {
      position: relative;
      object-fit: cover;
      width: 65vw;
      height: 19.25rem;
    }
    img {
      position: relative !important;
      height: 19.25rem !important;
      width: 65vw;
      object-fit: cover;
    }
  }

  .paginator {
    margin: 0 auto;
    position: absolute;
    z-index: 9;
    bottom: 1rem;
    width: 100%;

    .paginator-container {
      width: calc(100% - (5.46vw * 2));
      max-width: 1200px;
      margin: 0 auto;
    }
  }
`;

export const MediaContainer = styled.div`
  position: relative;
`;

export const SlideDescription = styled.div<{
  index: number;
}>`
  pointer-events: none;
  position: absolute;
  left: 0;
  z-index: 9;
  height: 100%;
  width: 100%;
  background: -webkit-linear-gradient(
    0deg,
    #150029 67.74%,
    rgba(21, 0, 41, 0) 100%
  );
  background-repeat: repeat-y;
  background-position: 0px 0;
  background-size: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  -webkit-transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;
  .container {
    width: calc(100% - (5.46vw * 2));
    max-width: 1200px;
    margin: 0 auto;
    .banner-header {
      display: inline-block;
      max-width: ${({ index }) => (index === 0 ? `31.25rem;` : `23.9375rem;`)};
      margin: 0;
      color: ${COLORS.BRAND.WHITE};
      ${({ index }) =>
        index === 0
          ? `
       ${expandFontToken(FONTS.DISPLAY_LARGE)};
      `
          : `
        ${expandFontToken(FONTS.DISPLAY_REGULAR)};
        margin-bottom: 0.5rem;
      `}
    }
    p {
      display: block;
      margin: 0;
      max-width: ${({ index }) => (index === 0 ? `31.25rem;` : `23.9375rem;`)};
      ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
      color: ${COLORS.BRAND.WHITE};
    }
    button {
      pointer-events: all;
      margin-top: 1.25rem;
      ${expandFontToken(FONTS.BUTTON_MEDIUM)};
      color: #130029;
      background-color: ${COLORS.BRAND.WHITE};
      padding: 0.8125rem 1rem;
      border-radius: 0.5rem;
    }
  }
`;

export const SwiperControls = styled.div`
  position: absolute;
  top: calc(50% - 22px);
  z-index: 99;
  height: 44px;
  width: 100%;
  pointer-events: none;
  .swiper-controls-container {
    position: relative;
    height: 44px;
    width: 100%;
  }
  .prev-slide,
  .next-slide {
    pointer-events: all;
    position: absolute;
    z-index: 99;
    cursor: pointer;
  }
  .prev-slide {
    left: 3%;
  }
  .next-slide {
    right: 3%;
  }
`;
