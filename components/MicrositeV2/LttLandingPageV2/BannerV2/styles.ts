import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div<{ isMobile: boolean }>`
  ${({ isMobile }) =>
    !isMobile &&
    `
  position: relative;
  
  `}
  background: #150029;
  height: auto;
`;
export const LinearGradient = styled.div<{
  height: number;
  isTopGradient: boolean;
  index?: number;
}>`
  position: absolute;
  width: 100%;
  z-index: 99;
  ${({ isTopGradient, height, index }) => {
    return isTopGradient
      ? `
      top: 0;
      height: ${height}px;
      background: linear-gradient(180deg, #150029 -3.07%, rgba(21, 3, 40, 0) 100%);
    `
      : `
      bottom: ${index! > 0 ? `52px` : `-1px`};
      height: ${height}px;
      background: linear-gradient(180deg, rgba(26, 14, 10, 0) 0%, #150029 85.94%);
    `;
  }}
`;

export const GradientWrapper = styled.div<{
  position: 'top' | 'bottom';
}>`
  position: absolute;
  width: 100%;
  z-index: 2;
  ${({ position }) => {
    return position === 'top' ? `top: 0;` : `bottom: 0;`;
  }};
  background: linear-gradient(
    ${({ position }) => (position === 'top' ? '180deg' : '0deg')},
    #150328 -3.07%,
    rgba(21, 3, 40, 0) 100%
  );
  height: 7.125rem;
`;

export const SwiperWrapper = styled.div<{ isMobile: boolean }>`
  position: relative;
  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    height: auto;
    ${({ isMobile }) =>
      isMobile
        ? `
        position: relative;
        margin-bottom: 4rem;`
        : `display: flex;
        justify-content: flex-end;`}

    video {
      position: relative;
      object-fit: cover;

      ${({ isMobile }) =>
        isMobile
          ? `
        width: 100%;
      height: 14.5rem;`
          : `width: 70vw;
        height: 27.0625rem;`}
    }
    img {
      position: relative;
      object-fit: cover;

      ${({ isMobile }) =>
        isMobile
          ? `
          height: 11.8125rem;
          width: 100%;`
          : `height: 27.0625rem;
          width: 70vw;`}
    }
  }

  .paginator {
    ${({ isMobile }) =>
      isMobile
        ? `margin-left: 1.5rem;`
        : ` margin: 0 auto;
          position: absolute;
          z-index: 9;
          bottom: 40px;
          width: 100%;`}

    .paginator-container {
      ${({ isMobile }) =>
        isMobile
          ? `margin: 0;`
          : ` width: calc(100% - (5.46vw * 2));
        max-width: 1200px;
        margin: 0 auto;`}
    }
  }
`;

export const MediaContainer = styled.div`
  position: relative;
`;

export const SlideDescriptionDesktop = styled.div<{
  index: number;
}>`
  position: absolute;
  left: 0;
  z-index: 9;
  height: 100%;
  height: 27.0625rem;
  width: 100vw;
  background: linear-gradient(90deg, #150029 59.74%, rgba(21, 0, 41, 0) 100%)
    no-repeat 0px 0px;
  background-size: 60vw;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .container {
    width: calc(100% - (5.46vw * 2));
    max-width: 1200px;
    margin: 0 auto;
    h1 {
      display: inline-block;
      max-width: ${({ index }) => (index === 0 ? `31.25rem;` : `23.9375rem;`)};
      margin: 0;
      color: ${COLORS.BRAND.WHITE};
      ${({ index }) =>
        index === 0
          ? `
       ${expandFontToken(FONTS.DISPLAY_LARGE)};
       font-size: 56px;
       line-height: 64px;
       letter-spacing: 0.9px;
      `
          : `
        ${expandFontToken(FONTS.DISPLAY_LARGE)};
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
      margin-top: 2.25rem;
      ${expandFontToken(FONTS.TABLE_REGULAR_HEAVY)};
      color: #130029;
      background-color: ${COLORS.BRAND.WHITE};
      padding: 0.8125rem 1rem;
      border-radius: 0.5rem;
    }
    h2 {
      ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};
      color: #ef9494;
    }
  }
`;

export const SlideDescriptionMobile = styled.div<{
  index: number;
}>`
  ${({ index }) => {
    if (index > 0) {
      return `
      background: #150029;
      bottom: -2.5rem;
      .container{
        h1{
          ${expandFontToken(FONTS.HEADING_LARGE)};
        }
        p{
          ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
        }
      }
      `;
    } else {
      return `
      background: transparent;
      bottom: -3rem;
      .container{
        h1{
          ${expandFontToken(FONTS.DISPLAY_SMALL)};
        }
      }
      `;
    }
  }}
  height: auto;
  position: absolute;
  z-index: 999;
  width: 100%;
  .container {
    padding-left: 1.5rem;
    h1,
    h2,
    p {
      color: ${COLORS.BRAND.WHITE};
      margin: 0;
      width: 84vw;
    }
    h2 {
      color: #ef9494;
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
      margin-bottom: 0.5rem;
    }
    button {
      ${expandFontToken(FONTS.TABLE_REGULAR_HEAVY)};
      color: #130029;
      background-color: ${COLORS.BRAND.WHITE};
      padding: 0.5rem 0.84375rem;
      border-radius: 0.25rem;
      margin-top: 1rem;
    }
  }
`;

export const SwiperControls = styled.div`
  position: absolute;
  top: 50%;
  z-index: 1;
  display: flex;
  align-items: center;
  transform: scale(1.2);
  .prev-slide,
  .next-slide {
    position: absolute;
    height: 44px;
    pointer-events: none;
    cursor: pointer;
  }
  .prev-slide {
    left: 0;
  }
  .right-slide {
    right: 0;
  }
`;
