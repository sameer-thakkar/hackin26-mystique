import styled from 'styled-components';
import COLORS from 'const/colors';

export const ShowPageBannerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  position: relative;
  background: -webkit-linear-gradient(
    0deg,
    ${COLORS.BACKGROUND.LTT_INDIGO} calc(100vw - 45.6875rem),
    rgba(21, 0, 41, 0) 80%
  );
  div {
    background: -webkit-linear-gradient(
        0deg,
        #150029 0%,
        #150029 59.74%,
        rgba(21, 0, 41, 0) 70%,
        rgba(21, 0, 41, 0) 100%
      )
      to right;
  }

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    background-color: ${COLORS.BACKGROUND.LTT_INDIGO};
  }

  @media (min-width: 1600px) {
    background: -webkit-linear-gradient(
      0deg,
      ${COLORS.BACKGROUND.LTT_INDIGO} 40vw,
      rgba(21, 0, 41, 0) 70%
    );
  }
`;

export const BannerBackground = styled.div`
  position: absolute;
  right: 0;
  z-index: -1;
  height: 100%;
  width: auto;
  background-color: ${COLORS.BACKGROUND.LTT_INDIGO};
  video {
    width: 45.6875rem;
    aspect-ratio: auto 891 / 381.857;
    height: 23.8rem;
    position: absolute;
    right: 0;
  }
  @media (max-width: 768px) {
    position: relative;
    width: 100vw;
    overflow: hidden;
    z-index: 0;
    width: 100%;
    video {
      width: 100vw;
      aspect-ratio: auto 487 / 208.714;
      height: 13.04rem;
      right: auto;
      left: 0;
    }
  }

  @media (min-width: 1600px) {
    padding-right: calc((100vw - 75rem) / 2);
    background-color: ${COLORS.BACKGROUND.LTT_INDIGO};
    video {
      width: 48.6875rem;
    }
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
    switch (position) {
      case 'top':
        return `top: 0px;`;
      case 'bottom':
        return `bottom: 0;`;
      case 'right':
        return `right: -2.5rem;`;
    }
  }};

  background: ${({ position }) =>
    position === 'right'
      ? 'linear-gradient(to left, #150328 35%, rgba(21, 3, 40, 0) 45%)'
      : `linear-gradient(${position === 'top' ? '180deg' : '0deg'}, #150328 ${
          position === 'top' ? '-5.07%' : '5.07%'
        }, rgba(21, 3, 40, 0) 100%)`};
  height: ${({ position }) => (position === 'right' ? '100%' : '7.125rem')};

  ${({ position }) => position === 'right' && `display: none`};

  @media (min-width: 1600px) {
    ${({ position }) => position === 'right' && `display: block`};
  }
`;
