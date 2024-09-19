import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const NeabyCitiesContainer = styled.div`
  margin: 3rem auto 0;
  max-width: ${SIZES.MAX_WIDTH};
  .cities-nearby-title {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
  }

  .city-name {
    ${expandFontToken(FONTS.DISPLAY_SMALL)};
    color: ${COLORS.BRAND.WHITE};
    position: absolute;
    bottom: 0;
    padding: 0.75rem;
  }

  .prev-slide {
    top: 11.5rem;
  }
  .next-slide {
    top: 11.5rem;
  }

  @media (max-width: 768px) {
    padding: 1.875rem 0 1.875rem 1rem;
    margin: 0;
    .cities-nearby-title {
      ${expandFontToken(FONTS.HEADING_LARGE)};
      margin: 0 0 2rem 0;
    }
    .city-name {
      padding: 0.5rem;
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }
  }
`;

export const Card = styled.div<{ height: string; width: string }>`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  position: relative;
  border-radius: 10px;
  background: linear-gradient(
    184.23deg,
    rgba(0, 0, 0, 0) 66.76%,
    #000000 92.25%
  );
  img {
    z-index: -1;
    position: relative;
    border-radius: 10px;
    height: 100%;
    width: 100%;
  }

  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;
