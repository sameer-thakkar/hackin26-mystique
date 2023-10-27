import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const Container = styled.main`
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
    ${expandFontToken(FONTS.HEADING_LARGE)};
  }
  h3 {
    ${expandFontToken(FONTS.HEADING_REGULAR)};
  }
  h4 {
    ${expandFontToken(FONTS.SUBHEADING_LARGE)};
  }
  width: calc(100vw - (5.46vw * 2));
  max-width: ${SIZES.MAX_WIDTH};
  margin: 2rem auto 0 auto;

  .news-meta {
    margin-bottom: 1.5rem;
    height: 100%;
    max-width: 49.5rem;
      ${expandFontToken(FONTS.DISPLAY_LARGE)};
      margin: 0.5rem 0 1rem 0;
    }
    .author-meta {
      display: flex;
      align-items: center;
      .author-name {
        margin-right: 0.25rem;
      }
      svg {
        height: 2rem;
        width: 2rem;
        margin-right: 0.5rem;
      }
      span,
      time {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
      }
      span {
        color: ${COLORS.GRAY.G2};
      }
      time::before {
        content: '• ';
        font-family: serif; // Overwritten because of • appearing as square in Halyard Text font
      }
      time {
        color: ${COLORS.GRAY.G3};
      }
    }
  }

  @media (max-width: 768px) {
    h2 {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }
    .news-meta {
      margin-bottom: 1rem;
      .author-meta {
        svg {
          height: 1.25rem;
          width: 1.25rem;
          margin-right: 0.5rem;
        }
      }
      h1 {
        ${expandFontToken(FONTS.HEADING_LARGE)};
        margin: 0.5rem 0 0.5rem 0;
      }
      span,
      time {
        ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      }
    }
  }
`;

export const MainContent = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    gap: 2rem;
  }
`;
