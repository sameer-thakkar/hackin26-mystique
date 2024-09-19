import { Styles } from 'react-modal';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const Container = styled.div`
  width: calc(100% - 5.46vw * 2);
  max-width: 1200px;
  padding: 4rem 0;
  margin: 0 auto;
  .swiper {
    width: 100%;
    height: 100%;

    .swiper-wrapper {
      -webkit-transform-style: preserve-3d;
      .swipe-slide {
        -webkit-transform: translateZ(0) !important;
        transform: translateZ(1px);
        -webkit-transform: translate3d (0, 0, 0);
        -webkit-backface-visibility: hidden;
        -webkit-transform: translate3d(0, 0, 0);
        backdrop-filter: blur(3.5px);
        -webkit-backdrop-filter: blur(3.5px);
        -moz-backdrop-filter: blur(3.5px);
      }
    }
  }
  .paginator {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    li {
      margin: 0 0.125rem;
      background-color: ${COLORS.GRAY.G5};
    }
    li[data-active='true'] {
      background-color: ${COLORS.BRAND.WHITE};
    }
  }
`;

export const TitleBar = styled.div`
  h2 {
    margin: 0;
    color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
  @media (max-width: 768px) {
    h2 {
      ${expandFontToken(FONTS.HEADING_LARGE)};
    }
  }
`;

export const Navigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  a {
    color: ${COLORS.BRAND.WHITE};
  }
  a:hover {
    color: #f8f8f8;
  }
`;

export const NavigationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  > svg {
    cursor: pointer;
  }
  svg:hover {
    fill: rgba(255, 255, 255, 0.2);
    path {
      fill: none;
    }
  }

  svg {
    circle,
    path {
      stroke: white;
    }
  }
`;

export const Slider = styled.div``;

export const TrailerCard = styled.div`
  box-sizing: border-box;
  position: relative;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(31.5px);
  width: 24rem;
  height: 25.6875rem;
`;

export const CardContainer = styled.div`
  padding: 1.5rem;
  .image-wrap {
    height: 13.4375rem;
    img {
      border-radius: 4px;
      height: 100%;
      width: 100%;
    }
  }

  button {
    z-index: 1;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
    border-radius: 8px;
    border: none;
    background-color: ${COLORS.PURPS.LIGHT_TONE_4};
    color: ${COLORS.BRAND.PURPS};
    svg {
      path {
        stroke: ${COLORS.BRAND.PURPS};
      }
    }
  }
  button:hover {
    background-color: ${COLORS.PURPS.LEVEL_15};
  }
`;

export const ImageContainer = styled.div`
  width: 21rem;
  position: relative;
  svg {
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
`;

export const CardInfoHeader = styled.div`
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  .subcategory-name {
    color: ${COLORS.GRAY.G6};
  }
  .separator {
    color: ${COLORS.GRAY.G6};
  }

  .ratings-and-reviews {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    .ratings {
      color: ${COLORS.BRAND.WHITE};
      display: flex;
      align-items: center;
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
      svg {
        transform: scale(0.7);
        path {
          fill: ${COLORS.BRAND.WHITE};
          stroke: ${COLORS.BRAND.WHITE};
        }
      }
    }
    .reviews-count {
      color: ${COLORS.GRAY.G6};
    }
  }
`;

export const TrailerName = styled.h3`
  margin: 0.25rem 0 0 0;
  height: 3.375rem;
  color: ${COLORS.BRAND.WHITE};
  ${expandFontToken(FONTS.HEADING_LARGE)}
`;

export const BackgroundCircle = styled.div<{
  position: {
    left?: number;
    bottom?: number;
    right?: number;
  };
}>`
  position: absolute;
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 50%;
  filter: blur(45px);
  left: ${({ position }) => position.left}px;
  right: ${({ position }) => position.right}px;
  bottom: ${({ position }) => position.bottom}px;
  background: rgba(174, 179, 217, 0.5);
  z-index: -1;
`;

export const modalStyles: Styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 99,
  },
  content: {
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    width: 'calc(100% - 5.46vw * 2)',
    backgroundColor: 'transparent',
    maxWidth: `${SIZES.MAX_WIDTH}`,
    boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    zIndex: 999,
    padding: 0,
    inset: 0,
    border: 0,
  },
};
