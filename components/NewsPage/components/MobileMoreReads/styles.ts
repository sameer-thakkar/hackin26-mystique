import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  margin-top: 2rem;
  width: 100%;
  .heading-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      ${expandFontToken(FONTS.HEADING_LARGE)}
    }
    a {
      border-radius: 4px;
      padding: 0.44rem 0.75rem;
      border: 1px solid ${COLORS.GRAY.G2};
      color: ${COLORS.GRAY.G2};
      ${expandFontToken(FONTS.BUTTON_SMALL)}
    }
  }
  .articles {
    margin-top: 1rem;
  }

  .news-article {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }
  .article-image {
    background-color: ${COLORS.GRAY.G6};
    height: 5.5rem;
    width: 8.75rem;
    border-radius: 8px;
    .image-wrap {
      height: auto;
    }
    .image-wrap {
      height: 5.5rem;
      img {
        border-radius: 8px;
        object-position: center;
        object-fit: cover;
      }
    }
  }
  .article-info {
    position: relative;
    flex: 1;
    .published-date {
      display: block;
      margin-bottom: 0.25rem;
      color: ${COLORS.GRAY.G3};
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    }
    h4 {
      max-height: 2.5rem;
      text-overflow: ellipsis;
      overflow: hidden;
      ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
    }
    .author-details {
      position: absolute;
      bottom: 0;
      span {
        display: flex;
        align-items: center;
        ${expandFontToken(FONTS.UI_LABEL_SMALL)};
        svg {
          height: 1.2rem;
          width: 1.2rem;
          margin-right: 0.5rem;
        }
      }
    }
  }
  .load-more {
    width: 100%;
    color: ${COLORS.GRAY.G2};
    border: 1px solid ${COLORS.GRAY.G2};
  }
`;
