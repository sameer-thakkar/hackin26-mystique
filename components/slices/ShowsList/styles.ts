import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import styled from 'styled-components';

export const Container = styled.div`
  && {
    h2 {
      margin-bottom: 1rem;
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }
    .wrapper {
      display: grid;
      grid-gap: 36px;
    }
  }
  @media (min-width: 768px) {
    width: calc(100vw - (5.46vw * 2));
    max-width: 1200px;
    && {
      h2 {
        margin-bottom: 1.5rem;
        ${expandFontToken(FONTS.HEADING_LARGE)};
      }
    }
    .wrapper {
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 1.5rem;
    }
  }
`;
