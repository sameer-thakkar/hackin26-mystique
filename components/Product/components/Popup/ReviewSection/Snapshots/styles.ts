import styled, { css, keyframes } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledContainer = styled.div`
  margin-top: 1.5rem;
  max-width: 46.5rem;
  width: 100%;
  padding-bottom: 1.5rem;

  .traveler-media-carousel-container {
    transform: translateX(-0.75rem);
  }

  @media (max-width: 768px) {
    max-width: 21.375rem;
  }
`;

export const StyledHeadingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  @media only screen and (min-width: 768px), print {
    .navigation-buttons-container {
      margin-right: 0.75rem;
      z-index: 1;
    }
  }
`;

export const StyledHeading = styled.div`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
  margin-bottom: 1.5rem;
  color: ${COLORS.GRAY.G2};

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const shimmer = keyframes`
  from {
    transform: rotate(15deg) translate(-90%, -50%)
  }
  to {
    transform: rotate(15deg) translate(10%, -50%)
  }
`;

const shimmerStyle = css`
  &:after {
    content: '';
    height: 260%;
    width: 210%;
    z-index: 1;
    position: absolute;
    border-radius: 6px;
    background: linear-gradient(
      90deg,
      rgba(226, 226, 226, 0) 0%,
      rgba(226, 226, 226, 0.6) 50.37%,
      rgba(226, 226, 226, 0) 100%
    );
    transform: rotate(15deg) translate(-50%, -50%);
    animation: ${shimmer} 1.5s ease-in-out infinite alternate;
  }
`;

export const StyledImage = styled.div<{
  $height: number;
  $width: number;
  $showShimmer?: boolean;
}>`
  border-radius: 6px;
  width: auto;
  height: ${({ $height }) => $height / 16}rem;
  width: ${({ $width }) => $width / 16}rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  ${({ $showShimmer }) => $showShimmer && shimmerStyle}
  img {
    height: 100%;
    width: 100%;
    border-radius: 6px;
    opacity: ${({ $showShimmer }) => ($showShimmer ? 0 : 1)};
    transition: all 0.3s;
  }

  min-height: ${({ $height }) => $height / 16}rem;
  min-width: ${({ $width }) => $width / 16}rem;

  img {
    min-height: ${({ $height }) => $height / 16}rem;
    min-width: ${({ $width }) => $width / 16}rem;
  }

  @media (max-width: 768px) {
    margin: 0;
  }
`;

export const MobileCarousel = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 0 1.5rem;
  margin-left: -1.5rem;
  overflow-x: scroll;
  overflow-y: hidden;
  width: 100vw;

  &::-webkit-scrollbar {
    display: none;
  }
`;
