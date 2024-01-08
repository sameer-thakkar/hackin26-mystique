import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.section`
  flex: 1;
  flex-shrink: 2;
  border-radius: 8px;
  position: sticky;
  top: 100px;
`;

export const BookNowCTA = styled.div`
  h2 {
    display: flex;
    align-items: center;
    svg {
      margin-left: 0.25rem;
    }
  }
  margin-bottom: 1rem;
  @media (min-width: 768px) {
    display: none;
  }
`;

export const Card = styled.div<{
  isShowAvailable?: boolean;
}>`
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.12),
    0px -1px 2px 0px rgba(0, 0, 0, 0.08);
  width: 100%;
  position: relative;
  .card-content {
    padding: 1rem;
    display: flex;
    gap: 1rem;
    .card-image {
      border-radius: 8px;
      padding-top: 28.25%;
      padding-bottom: 28.25%;
      position: relative;
      flex: 1;
      background-color: ${COLORS.GRAY.G6};
      .image-wrap {
        position: absolute;
        top: 0;
        bottom: 0;
      }
    }
    @media (min-width: 768px) and (max-width: 1100px) {
      .card-image {
        display: none;
      }
    }
  }
  .card-info {
    position: relative;
    flex: 1.5;
    .category-and-ratings {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
      color: ${COLORS.GRAY.G3};
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    }
    .ratings-and-reviews {
      display: flex;
      align-items: center;
      a {
        display: flex;
        align-items: center;
      }
    }
    .rating {
      margin-right: 0.25rem;
      display: flex;
      gap: 0.25rem;
      padding-bottom: 2px;
      align-items: center;
      color: ${COLORS.TEXT.CANDY_1};
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
      svg {
        width: 0.736rem;
        height: 0.736rem;
        flex-shrink: 0;
      }
    }
    .rating:hover {
      color: ${COLORS.TEXT.CANDY_1};
      path {
        fill: ${COLORS.TEXT.CANDY_1};
      }
    }
    .review-count {
      transform: translateY(-1px);
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    }
    h3 {
      overflow-wrap: break-word;
      text-overflow: ellipsis;
    }
    .location {
      display: flex;
      align-items: center;
      margin-top: 0.25rem;
      gap: 0.25rem;

      span {
        ${expandFontToken(FONTS.UI_LABEL_SMALL)};
        border-bottom: 1px dotted ${COLORS.GRAY.G3};
      }
      svg {
        transform: translateY(2px);
        color: ${COLORS.GRAY.G2};
      }
    }
    .show-unavailable-warning {
      display: block;
      margin-top: 1rem;
      color: ${COLORS.TEXT.WARNING_RED_1};
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
    }
    .price-block {
      margin: 1rem 0 0.5rem 0;
      .tour-scratch-price {
        ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      }
      .strike-through {
        color: ${COLORS.GRAY.G3};
        ${expandFontToken(FONTS.HEADING_SMALL)};
      }
    }
    button {
      ${({ isShowAvailable }) =>
        !isShowAvailable
          ? `
      position: absolute;
      bottom: 10px;
      `
          : ``}
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    button:hover {
      box-shadow: 0px 8px 15px 0px rgba(128, 0, 255, 0.3);
    }
  }
  img {
    border-radius: 8px;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    margin-bottom: 0;
    button {
      position: absolute;
      bottom: 0;
      padding: 0.5rem 1.5rem;
      border-radius: 4px;
      ${expandFontToken(FONTS.BUTTON_SMALL)};
    }

    .card-content {
      padding: 0.75rem;
      gap: 0.75rem;
      h3 {
        width: 50vw;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .location {
      span {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;

export const FeaturedNewsContainer = styled.div`
  margin-top: 1.5rem;
  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    u {
      cursor: pointer;
      ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
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
    }
    .author-details {
      position: absolute;
      bottom: 0;
      span {
        ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      }
    }
  }
  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;
