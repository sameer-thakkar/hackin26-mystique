import { Styles } from 'react-modal';
import styled, { css, keyframes } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CarouselContainer = styled.div<{
  $backgroundColor?: string;
  $differentBorderRadiusForMobile?: boolean;
  $showOverlay?: boolean;
  $hideBorderRadius?: boolean;
}>`
  width: 100%;
  height: 100%;
  border-radius: ${({ $hideBorderRadius }) =>
    $hideBorderRadius ? '0 !important' : '0.5rem'};
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background-color: ${({ $backgroundColor }) => $backgroundColor};

  img,
  video {
    display: flex;
  }

  .swiper,
  .swiper-initialized {
    height: 100%;

    ${({ $showOverlay }) =>
      $showOverlay &&
      css`
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 2;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 80%,
            rgba(0, 0, 0, 0.6) 100%
          );
          touch-action: none;
          pointer-events: none;
        }
      `}
  }

  /* pagination styles */
  .swiper-pagination {
    bottom: 0.5rem;
    display: flex;
    justify-content: center;
    grid-gap: 0.25rem;
    width: 100%;
    z-index: 3;

    .swiper-pagination-bullet {
      margin: 0 !important;
      opacity: 0.6;
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 50%;
      cursor: pointer;
      z-index: 2;

      &.swiper-pagination-bullet-active {
        opacity: 1;
      }
    }
  }

  &:hover {
    .navigation-button {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    ${({ $differentBorderRadiusForMobile }) =>
      $differentBorderRadiusForMobile &&
      css`
        border-radius: 0.75rem 0.75rem 0 0;
      `}
  }
`;

const NavigationContainerStyles = css`
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 1;
  height: 100%;
  width: 18%;
  display: flex;
  align-items: center;
  cursor: pointer;

  .navigation-button {
    border: 0;
    padding: 0.7rem 0 0 0.3rem;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    background: none;
    cursor: pointer;
    width: 1.25rem;
    height: fit-content;

    svg {
      height: 2.25rem;
      width: 2.25rem;
    }
  }
`;

export const PrevButtonContainer = styled.div`
  left: 0;
  ${NavigationContainerStyles}
`;

export const NextButtonContainer = styled.div`
  right: 0;
  transform: rotateY(180deg);
  ${NavigationContainerStyles}
`;

export const PaginatorWrapper = styled.div<{ bottomPosition?: string }>`
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  justify-content: center;
  z-index: 2;
  margin-bottom: ${({ bottomPosition }) => bottomPosition ?? 0};
`;

const playAnimation = keyframes`
  0% {
      transform: translateX(-30%);
    }
    15% {
      transform: translateX(100%);
      opacity: 0;
    }
    25% {
      transform: translateX(-30%);
      opacity: 0;
    }
    30% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(-30%);
      opacity: 1;
    }
`;

export const VideoCTA = styled.button`
  display: flex;
  gap: 0.25rem;
  z-index: 2;
  position: absolute;
  align-items: center;
  justify-content: space-between;
  top: 1rem;
  right: 1rem;
  border-radius: 2rem;
  backdrop-filter: blur(0.25rem);
  background: #00000033;
  border: 1px solid #ffffff1a;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  cursor: pointer;
  transition: transform 0.3s;

  p {
    margin: 0;
    margin-bottom: 2px;
    padding: 0;
    width: max-content;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
    color: ${COLORS.BRAND.WHITE};
  }

  svg {
    height: 0.75rem;
    width: 1.25rem;

    path {
      fill: ${COLORS.BRAND.WHITE};
      stroke: ${COLORS.BRAND.WHITE};
      animation-name: ${playAnimation};
      animation-duration: 1.4s;
      animation-iteration-count: infinite;
      animation-delay: 250ms;
      animation-timing-function: ease-in-out;
    }
  }

  &:hover {
    transform: scale(1.05);
  }
`;

export const modalStyles: Styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 99,
  },
  content: {
    height: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    width: '100%',
    backgroundColor: 'transparent',
    maxWidth: '1000px',
    boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    zIndex: 999,
    padding: 0,
    inset: 0,
    border: 0,
  },
};
