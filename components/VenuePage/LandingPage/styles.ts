import styled from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const PageWrapper = styled.div`
  width: calc(100% - (5.46vw * 2));
  max-width: ${SIZES.MAX_WIDTH};
  margin: 0 auto;
  padding-top: 0.5rem;
  .tabs {
    margin-top: 1rem;
    position: sticky;
    top: 80px;
    background-color: white;
    z-index: 15;
  }

  @media (max-width: 768px) {
    && {
      .tabs {
        grid-column-gap: 8px;
        width: auto;
        overflow-x: hidden;
        margin-top: 0;
        top: 60px;
      }
      .slide-controls {
        display: none;
      }
    }
    .tabs > * {
      svg {
        display: none;
      }
    }
    .tabs > div {
      ${expandFontToken(FONTS.HEADING_XS)}
    }
  }
`;
