import styled from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

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
  margin-bottom: 2.5rem;

  @media (min-width: 768px) {
    width: calc(100vw - (5.46vw * 2));
    max-width: 1200px;
    margin-bottom: 4rem;

    && {
      h2 {
        margin-bottom: 1.5rem;
        ${expandFontToken(FONTS.HEADING_LARGE)};
      }
    }
    .wrapper {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
  }
`;
