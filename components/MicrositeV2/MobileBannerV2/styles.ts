import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';

export const Container = styled.div`
  min-height: 400px;
  background: #150029;
  position: relative;
  -webkit-transform: translate3d(0, 0, 0);
`;

export const SwiperWrapper = styled.div`
  position: relative;
  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    position: relative;
    height: auto;
    margin-bottom: 3.75rem;
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    video,
    img {
      position: relative;
      object-fit: cover;
      width: 100%;
      height: 14.5rem;
    }
  }

  .paginator {
    margin-left: 1.5rem;
    margin-top: 1.125rem;
  }
`;

export const SlideDescription = styled.div<{
  index: number;
}>`
  ${({ index }) => {
    if (index > 0) {
      return `
      background: #150029;
      bottom: -2.5rem;
      .container{
        .banner-header {
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
        .banner-header {
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
    button {
      font-family: ${HALYARD.FONT_STACK};
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0.20000000298023224px;
      color: #130029;
      background-color: ${COLORS.BRAND.WHITE};
      padding: 0.5rem 0.84375rem;
      border-radius: 0.25rem;
      margin-top: 1rem;
    }
  }
`;

export const MediaContainer = styled.div`
  position: relative;
`;

export const LinearGradient = styled.div<{
  height: number;
  isTopGradient: boolean;
  index?: number;
  hasSubText?: boolean;
}>`
  position: absolute;
  width: 100%;
  z-index: 99;
  ${({ isTopGradient, height, index, hasSubText }) => {
    return isTopGradient
      ? `
      top: 0;
      height: ${height}px;
      background: linear-gradient(180deg, #150029 -3.07%, rgba(21, 3, 40, 0) 100%);
    `
      : `
      bottom: ${index && index > 0 ? (hasSubText ? '55px' : `-5px`) : `-1px`};
      height: ${height}px;
      background: linear-gradient(180deg, rgba(26, 14, 10, 0) 0%, #150029  ${
        hasSubText ? '25.94%' : '85.94%'
      });
    `;
  }}
`;
