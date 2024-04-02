import styled from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div`
  width: calc(100vw - (5.46vw));
  margin-top: 4rem;
  h2 {
    ${expandFontToken(FONTS.HEADING_SMALL)};
    margin: 0;
  }
  .wrapper {
    display: grid;
    grid-auto-flow: column;
    overflow-x: scroll;
    .show-image {
      margin: 1.5rem 1rem 0 0;
      width: 16.875rem;
      height: auto;
    }
    .show-image :last-child {
      margin-right: 1rem;
    }
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
  @media (min-width: 768px) {
    h2 {
      ${expandFontToken(FONTS.HEADING_LARGE)};
    }
    max-width: 1200px;
    width: calc(100%- (5.46vw * 2));
    .wrapper {
      display: flex;
      overflow: none;
      flex-wrap: wrap;
      gap: 1.5rem;
      .show-image {
        margin: 2.125rem 0 0 0;
        width: 17.625rem;
      }
      .show-image :last-child {
        margin-right: 0;
      }
    }
  }
`;
