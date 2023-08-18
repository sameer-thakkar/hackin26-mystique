import styled from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div<{
  $isMarginBottomNeeded: boolean | undefined;
}>`
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
  margin-bottom: ${({ $isMarginBottomNeeded }) =>
    $isMarginBottomNeeded ? '2.5rem' : '0'};

  @media (min-width: 768px) {
    width: calc(100vw - (5.46vw * 2));
    max-width: 1200px;
    margin-bottom: ${({ $isMarginBottomNeeded }) =>
      $isMarginBottomNeeded ? '4rem' : '0'};

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
