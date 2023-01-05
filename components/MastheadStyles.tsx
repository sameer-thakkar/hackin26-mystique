import styled from 'styled-components';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import { FONTS } from 'const/fonts';

export const StyledMasthead = styled.div<{
  isEntMb: boolean;
  withoutImage: boolean;
}>`
  width: 100%;
  display: flex;
  position: relative;

  ${({ isEntMb, withoutImage }) =>
    isEntMb
      ? `
  justify-content: center;
  margin-bottom: 1.25rem;
  overflow-x: hidden;
  img {
    width: 100vw;
    height: 400px;
    filter: brightness(0.7);
    object-fit: cover;
      }
        `
      : `
  margin-bottom: 2rem;
  height: ${withoutImage ? '9.25rem' : '11.75rem'};
  background: ${COLORS.BRAND.BLACK};
  img {
      object-fit: cover;
      }
  `}

  @media (max-width: 768px) {
    ${({ isEntMb, withoutImage }) =>
      isEntMb
        ? `
        img {
        height: 300px;
        }
        `
        : `
        height: auto;
        ${
          withoutImage
            ? `
          background: ${COLORS.BRAND.WHITE};
          margin-bottom: 0;
        `
            : `
        margin-bottom: 1rem;
        flex-direction: column-reverse;
        `
        }
     `}
  }
`;

export const ImageWrapper = styled.div`
  width: 48%;
  margin-left: auto;
  position: relative;

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    height: 13.125rem;
  }
`;

export const TitleWrapper = styled.div<{
  isEntMb: boolean;
  withoutImage: boolean;
}>`
  max-width: 38.125rem;
  margin: auto 0 auto 10rem;

  @media (max-width: 768px) {
    position: static;
    margin: 1.5rem;
    height: auto;
  }
`;

export const Title = styled.h1<{ isEntMb: boolean; withoutImage: boolean }>`
  margin: 0;

  ${({ isEntMb }) =>
    isEntMb
      ? `
    position: absolute;
    top: 50%;
    color: white;
    ${expandFontToken(FONTS.DISPLAY_REGULAR)}
    transform: translateY(-50%);
    max-width: 792px;
    text-align: center;
        `
      : `
    color: ${COLORS.GRAY.G8};
    ${expandFontToken(FONTS.DISPLAY_SMALL)};
    `}

  @media (max-width: 768px) {
    ${({ isEntMb, withoutImage }) =>
      isEntMb
        ? `
      text-align: center;
      top: 42%;
      ${expandFontToken(FONTS.HEADING_LARGE)}
      padding: 0 1rem;
        `
        : `
      color: ${withoutImage ? `${COLORS.GRAY.G1}` : `${COLORS.GRAY.G8}`};
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    `}
  }
`;

export const GradientWrapper = styled.div`
  background-image: linear-gradient(
    90.01deg,
    #111111 16.05%,
    rgba(17, 17, 17, 0.8) 40.39%,
    rgba(17, 17, 17, 0) 77.55%
  );
  position: absolute;
  z-index: 1;
  width: 64%;
  height: 100%;
  left: 0;
  top: 0;
`;
