import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.section`
  flex: 2;
  flex-shrink: 1;
  position: relative;
  width: 100%;

  .image-wrapper {
    width: 100%;
    padding-top: 27.475%;
    padding-bottom: 27.475%;
    margin-bottom: 1.5rem;
    position: relative;

    .banner-image {
      height: 100%;
      position: absolute;
      inset: 0;
      border-radius: 0.5rem;
      background: ${COLORS.GRAY.G6};

      img {
        border-radius: 0.5rem;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .slice-wrapper {
    padding: 0;
    margin: 0;
    width: 100%;
    ${expandFontToken(FONTS.PARAGRAPH_LARGE)};
    h3,
    h2 {
      margin-bottom: 0.5rem;
    }
  }

  @media (max-width: 768px) {
    flex-basis: 100%;
    .image-wrapper {
      margin-bottom: 1rem;
    }
    .slice-wrapper {
      h2 {
        ${expandFontToken(FONTS.HEADING_SMALL)}
      }
    }
  }
`;
