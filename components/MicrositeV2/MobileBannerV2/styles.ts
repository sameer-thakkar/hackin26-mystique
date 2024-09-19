import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div`
  height: 19.375rem;
  background: #150029;
  position: relative;
  -webkit-transform: translate3d(0, 0, 0);
`;

export const SwiperWrapper = styled.div`
  position: relative;
  height: 14.125rem;
  .swiper {
    width: 100%;
    height: min-content;
    padding-top: 0.875rem;

    .swiper-wrapper {
      height: 12.8125rem;
    }
  }

  .swiper-slide {
    position: relative;
    width: fit-content;
    transition: ease-in-out 300ms;
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    video,
    & img {
      position: relative;
      height: 12.5rem;
      width: calc(100vw - 5.6vw * 2);
      border-radius: 0.75rem;
      border: 0.125rem solid ${COLORS.BRAND.WHITE}33;
      box-sizing: border-box;
    }

    & .banner-video-fallback-image {
      border: none;
      padding: 0.125rem;
      box-sizing: border-box;
    }

    &.swiper-slide-prev,
    &.swiper-slide-next {
      transform-origin: top left;
      transform: scale(0.905) translateX(0.5rem);
      filter: brightness(0.5);
      margin-top: 0.625rem;
    }

    &.swiper-slide-prev {
      transform-origin: top right;
      transform: scale(0.905) translateX(-0.5rem);
    }
  }

  .paginator {
    margin-top: 0.75rem;
    display: flex;
    justify-content: center;
  }
`;

export const SlideDescription = styled.div<{
  index: number;
}>`
  background: transparent;
  .container {
    .banner-header {
      ${expandFontToken(FONTS.HEADING_LARGE)};
      color: ${COLORS.BRAND.WHITE};
      margin: 0;
      padding: 0 1rem;
    }
  }
  height: auto;
  position: absolute;
  bottom: 1rem;
  z-index: 999;
  width: 100%;
`;

export const MediaContainer = styled.div`
  position: relative;
  height: 12.5rem;
  width: calc(100vw - 5.6vw * 2);
`;

export const LinearGradient = styled.div`
  position: relative;
  width: calc(100% - 0.25rem);
  z-index: 99;
  bottom: 4.25rem;
  left: 0.125rem;
  height: 4.125rem;
  background: linear-gradient(180deg, rgba(26, 14, 10, 0) 0%, #150029 50%);
  border-radius: 0 0 0.625rem 0.625rem;
`;
