import styled from 'styled-components';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import { FONTS } from 'const/fonts';

export const StyledMasthead = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 2rem;
  height: ${({ withoutImage }) => (withoutImage ? '9.25rem' : '11.75rem')};
  background: ${COLORS.BRAND.BLACK};
  position: relative;
  img {
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: auto;
    ${({ withoutImage }) =>
      withoutImage
        ? `
          background: ${COLORS.BRAND.WHITE};
          margin-bottom: 0;
        `
        : `
        margin-bottom: 1rem;
        flex-direction: column-reverse;
        `}
    }}
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

export const TitleWrapper = styled.div`
  max-width: 38.125rem;
  margin: auto 0 auto 10rem;

  @media (max-width: 768px) {
    position: static;
    margin: 1.5rem;
    height: auto;
  }
`;

export const Title = styled.h1`
  color: ${COLORS.GRAY.G8};
  ${expandFontToken(FONTS.DISPLAY_SMALL)};
  margin: 0;

  @media (max-width: 768px) {
    color: ${({ withoutImage }) =>
      withoutImage ? `${COLORS.GRAY.G1}` : `${COLORS.GRAY.G8}`};
    ${expandFontToken(FONTS.HEADING_REGULAR)};
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
