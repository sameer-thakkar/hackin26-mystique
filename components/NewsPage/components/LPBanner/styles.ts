import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  margin: 4rem auto;
  border-radius: 20px;
  border: 2px solid #e1e1e1;
  box-sizing: border-box;
  height: 27.5rem;
  padding: 2rem;
  position: relative;
  .swiper {
    height: 100%;
    .swiper-slide {
      -webkit-transform: translateZ(0);
      -webkit-backface-visibility: hidden;
      .swiper-container {
        height: 100%;
        display: flex;
        gap: 1.5rem;
        cursor: pointer;
      }
    }
  }
  .previous-button,
  .next-button {
    cursor: pointer;
    position: absolute;
    top: 45%;
    svg:hover {
      path {
        fill: ${COLORS.GRAY.G8};
      }
    }
  }
  .previous-button {
    left: -20px;
  }
  .next-button {
    right: -20px;
  }

  @media (max-width: 768px) {
    margin: 1.5rem 0 0.75rem 0;
    padding: 0.75rem 0.75rem 1rem;
    height: 25rem;
    border: 1px solid #e1e1e1;
    border-radius: 8px;
    .swiper {
      height: 100%;
      .swiper-slide {
        .swiper-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
      }
    }
    .previous-button,
    .next-button {
      display: none;
    }
  }
`;

export const PaginatorContainer = styled.div`
  && {
    ul {
      display: flex;
      justify-content: center;
      li {
        background-color: #9f9f9f6e;
        margin: 0 0.125rem;
      }
      li[data-active='true'] {
        background-color: ${COLORS.GRAY.G4};
      }
    }
  }
  @media (min-width: 768px) {
    display: none;
  }
`;

export const ImageContainer = styled.div`
  background-color: ${COLORS.GRAY.G6};
  flex: 1.5;
  border-radius: 0.75rem;
  position: relative;
  .banner-image {
    border-radius: 0.75rem;
    img {
      border-radius: 0.75rem;
      object-fit: cover;
      cursor: pointer;
    }
  }
  @media (max-width: 768px) {
    flex: 1.5;
    flex-basis: 180px;
    .banner-image {
      border-radius: 4px;
      img {
        border-radius: 4px;
      }
    }
  }
`;

export const BannerInfo = styled.div`
  flex: 1;
  && {
    h2 {
      display: -webkit-box;
      margin-bottom: 0.75rem;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    }
    p {
      margin: 0;
      color: ${COLORS.GRAY.G2};
      ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
    }
    @media (max-width: 768px) {
      && {
        h2 {
          ${expandFontToken(FONTS.HEADING_REGULAR)}
          -webkit-line-clamp: 2;
          line-clamp: 2;
          margin-bottom: 0.375rem;
        }
        p {
          ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
        }
      }
    }
  }
`;

export const Content = styled.div`
  display: -webkit-box;

  p {
    display: inline;
  }
  u {
    cursor: pointer;
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
  }
`;

export const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1.375rem;
  .author-name {
    margin-right: 0.25rem;
    color: ${COLORS.GRAY.G3};
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
  @media (max-width: 768px) {
    margin-top: 1rem;
    span,
    time {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    }
    svg {
      height: 1.5rem;
      width: 1.5rem;
    }
  }
`;

export const Tag = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
  padding: 0.375rem 0.5rem;
  background-color: ${COLORS.BRAND.WHITE};
  border-radius: 2.162px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1),
    0px 0px 1px 0px rgba(0, 0, 0, 0.1);
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};

  @media (max-width: 768px) {
    top: 12px;
    left: 12px;
    ${expandFontToken(FONTS.MISC_BOOSTER)};
    padding: 0.25rem 0.375rem;
  }
`;
