import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  margin-top: 2rem;
  .heading-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      ${expandFontToken(FONTS.HEADING_LARGE)}
    }
    button {
      border-radius: 4px;
      padding: 0.44rem 0.75rem;
      border: 1px solid ${COLORS.GRAY.G2};
      color: ${COLORS.GRAY.G2};
      ${expandFontToken(FONTS.BUTTON_SMALL)};
    }
    margin-bottom: 1.5rem;
  }

  .swiper-wrapper {
    width: calc(100vw - 5.46vw * 2);
    height: auto;
  }
  .article-image {
    padding-top: 27%;
    padding-bottom: 27%;
    position: relative;
    background-color: ${COLORS.GRAY.G6};
    border-radius: 8px;
  }
  .image-wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    img {
      border-radius: 8px;
    }
  }
  .published-date {
    margin-top: 0.5rem;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  }
  .article-info {
    h4 {
      margin: 0.25rem 0 0.5rem 0;
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }
  }
  .article-content {
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}
  }
  .paginator {
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;
    li {
      background-color: #9f9f9f6e;
      margin: 0 0.125rem;
    }
    li[data-active='true'] {
      background-color: ${COLORS.GRAY.G4};
    }
  }
`;
