import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const Wrapper = styled.div`
  background-color: ${COLORS.CHINESE_BLACK};
  position: relative;
  margin-top: 4rem;
  min-height: 31.25rem;
  .bg-illustration {
    z-index: 0;
    img {
      position: absolute;
      right: 0;
    }
  }
  .swiper-slide {
    -webkit-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
  }

  .swiper-wrapper {
    -webkit-transform-style: preserve-3d;
  }
`;

export const TrailerHeading = styled.h2`
  width: calc(100% - 5.46vw);
  max-width: ${SIZES.MAX_WIDTH};
  position: absolute;
  z-index: 9;
  margin: 2.25rem 0 2rem 0;
  color: ${COLORS.BRAND.WHITE};
  ${expandFontToken(FONTS.DISPLAY_REGULAR)};
`;

export const LinearGradient = styled.div<{
  position: 'top' | 'bottom' | 'left';
}>`
  position: absolute;
  pointer-events: none;
  ${({ position }) => {
    switch (position) {
      case 'top':
        return 'top:0; width: 45vw; right:0;';
      case 'bottom':
        return 'bottom:0; width: 45vw; right:0;';
      case 'left':
        return 'left: 54.3%; width: 7.125rem; top:0; bottom:0;';
      default:
        return '';
    }
  }};
  max-width: ${SIZES.MAX_WIDTH};
  margin: 0 auto;
  z-index: 9;
  height: ${({ position }) => (position === 'left' ? '28.125rem' : '7.375rem')};
  background: ${({ position }) => {
    switch (position) {
      case 'top':
        return 'linear-gradient(180deg, #150029 0%, rgba(21, 0, 41, 0.00) 100%)';
      case 'bottom':
        return 'linear-gradient(0deg, #150029 0%, rgba(21, 0, 41, 0.00) 100%)';
      case 'left':
        return 'linear-gradient(90deg, #150029 0%, rgba(21, 0, 41, 0.00) 100%)';
      default:
        return '';
    }
  }};
`;

export const Container = styled.div`
  width: calc(100% - 5.46vw);
  margin: 0 auto;
  max-width: ${SIZES.MAX_WIDTH};
  border-width: 0 0 1px 0;
  border-style: solid;
  border-image: linear-gradient(
      270deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.24) 100%
    )
    1;

  .video-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 45vw;
    video {
      position: relative;
      height: 20.9rem;
      object-fit: cover;
    }
  }
  .trailer-info {
    margin-top: 7.375rem;
    padding-bottom: 2rem;
    width: 30vw;
    z-index: 999;
    .ratings-and-reviews {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      .rating {
        display: flex;
        align-items: center;
        gap: 0.125rem;
        cursor: pointer;
        border-bottom: 1px dotted ${COLORS.BRAND.CANDY};
        color: ${COLORS.BRAND.CANDY};
        ${expandFontToken(FONTS.HEADING_SMALL)};
      }
      .rating:hover {
        color: ${COLORS.TEXT.CANDY_1};
        path {
          fill: ${COLORS.TEXT.CANDY_1};
        }
      }
      .review-count {
        color: ${COLORS.GRAY.G4};
        ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
      }
    }
    h3 {
      margin: 0.5rem 0;
      color: ${COLORS.GRAY.G8};
    }
    .summary {
      margin: 0 0 1.5rem 0;
      max-width: 21rem;
      color: ${COLORS.GRAY.G8};
      ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
    }
    button {
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: ${COLORS.BRAND.WHITE};
      color: ${COLORS.GRAY.G2};
    }
    button:hover {
      box-shadow: 0px 8px 15px 0px rgba(255, 255, 255, 0.24);
    }
  }
  .all-trailers-cta {
    margin-top: 1.625rem;
    color: #ffffffd9;
    opacity: 0.85;

    width: 35rem;
    display: flex;
    justify-content: flex-end;
  }
  .all-trailers-cta:hover {
    color: #f8f8f8;
  }
`;

export const Slider = styled.div<{
  $noOfSlides: number;
}>`
  margin-top: 1.625rem;
  width: 33rem;
  margin-bottom: 3.25rem;
  ${({ $noOfSlides }) =>
    $noOfSlides > 3 ? 'margin-left:2.25rem' : 'margin-left:0'};
  position: relative;
  .swiper-wrapper {
    .swiper-slide {
      /* To avoid flickering issue on Safari - https://github.com/nolimits4web/swiper/issues/3527 */
      -webkit-transform: translateZ(0);
      -webkit-backface-visibility: hidden;
      position: relative;
    }
    .image-wrap {
      border-radius: 4px;
      height: 5.625rem;
      img {
        background-color: ${COLORS.GRAY.G6};
        border-radius: 4px;
        cursor: pointer;
      }
    }
    .swiper-slide-active {
      img {
        box-sizing: border-box;
        border: 1px solid ${COLORS.BRAND.WHITE};
      }
    }
  }
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: #00000066;
  opacity: 0;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

export const SwiperControls = styled.div`
  width: 100%;
  top: calc(50% - 0.75rem);
  display: flex;
  align-items: center;
  height: 1.5rem;
  position: absolute;
  .prev-slide,
  .next-slide {
    position: absolute;
    transform: scale(0.55);
    cursor: pointer;
    rect {
      background: rgba(255, 255, 255, 0.2);
    }
    rect:hover {
      fill: white;
      opacity: 0.4;
    }
  }
  .prev-slide {
    left: -50px;
  }
  .next-slide {
    right: -50px;
  }
`;
