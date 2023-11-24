import styled from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const Container = styled.div`
  width: calc(100% - 5.46vw * 2);
  max-width: 1200px;
  margin: 2.625rem auto 0 auto;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
  }
  h1 {
    ${expandFontToken(FONTS.DISPLAY_LARGE)}
  }
  h2 {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
  }

  @media (max-width: 768px) {
    && {
      h1 {
        ${expandFontToken(FONTS.HEADING_LARGE)};
      }
      p,
      u {
        ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
      }
      h2 {
        ${expandFontToken(FONTS.HEADING_LARGE)};
      }
    }
  }
`;

export const Heading = styled.h1`
  && {
    margin-top: 0.75rem;
  }
`;

export const SliderContainer = styled.div`
  width: calc(100% - 5.46vw * 2);
  max-width: ${SIZES.MAX_WIDTH};
  margin: 0 auto;
  h2 {
    margin: 0;
  }
`;
