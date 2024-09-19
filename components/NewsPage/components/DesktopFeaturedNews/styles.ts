import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const FeaturedNewsContainer = styled.div`
  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    a {
      ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
      text-decoration: underline;
      color: ${COLORS.GRAY.G2};
    }
    a:hover {
      color: ${COLORS.BRAND.BLACK};
    }
  }
  .articles {
    margin-top: 1.25rem;
  }
  .news-article {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .article-image {
    height: 5.5rem;
    width: 8.75rem;
    border-radius: 8px;
    background-color: ${COLORS.GRAY.G6};
    .image-wrap {
      height: auto;
    }
    .image-wrap {
      height: 5.5rem;
      img {
        border-radius: 8px;
        object-position: center;
        object-fit: cover;
        height: 100%;
        width: 100%;
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
    }
    .author-details {
      position: absolute;
      bottom: 0;
      display: flex;
      align-items: center;
      svg {
        height: 1.25rem;
        width: 1.25rem;
        margin-right: 0.5rem;
      }
      span {
        ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      }
    }
  }
  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;
