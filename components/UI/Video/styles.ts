import styled, { css, keyframes } from 'styled-components';
import COLORS from 'const/colors';

const fadeInAnimation = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const fadeInCSS = css`
  .image-wrap {
    animation: ${fadeInAnimation} 1.6s ease-in-out forwards;
  }
`;

const imageFadeIn = css`
  .image-wrap {
    animation: ${fadeInAnimation} 0.6s ease-in-out forwards;
  }
`;

export const VideoContainer = styled.div<{
  $fadeInVideo: boolean;
  $shouldBePlayingVideo: boolean;
}>`
  width: 100%;
  height: 100%;
  position: relative;
  display: grid;

  .image-wrap,
  video {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
  }

  ${({ $fadeInVideo }) => $fadeInVideo && fadeInCSS}
  ${({ $shouldBePlayingVideo }) => $shouldBePlayingVideo && imageFadeIn}
`;

export const StyledVideoContainer = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const VideoIcon = styled.button`
  border: 0;
  background: ${COLORS.BRAND.WHITE};
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  backdrop-filter: blur(12px);
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 2rem;
    height: 2rem;
    fill: ${COLORS.BRAND.WHITE};
  }

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: 2rem;
    svg {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1rem;
      height: 1rem;
      fill: ${COLORS.BRAND.WHITE};
    }
  }
`;
