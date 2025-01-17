import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  .swiper-wrapper {
    .swiper-slide {
      width: auto;
    }
    margin: 1.5rem 0 2rem 0;
  }
  @media (max-width: 768px) {
    .swiper {
      padding: 0 5.46vw;
    }
  }
`;

export const Title = styled.h2`
  && {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    margin: 0;
    display: flex;
    justify-content: space-between;
    @media (max-width: 768px) {
      ${expandFontToken(FONTS.HEADING_LARGE)};
      margin-left: 5.46vw;
    }
  }
`;

export const Navigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  u {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    cursor: pointer;
  }
`;

export const Arrows = styled.div`
  .icons {
    display: flex;
    gap: 0.5rem;
  }
  .chevron-left,
  .chevron-right {
    cursor: pointer;
    height: 2.25rem;
    width: 2.25rem;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    circle {
      stroke: rgba(121, 121, 121, 0.5);
    }
    &:not(.disabled) {
      &:hover {
        circle {
          stroke: rgba(121, 121, 121, 0.65);
        }
      }

      &:active {
        circle {
          stroke: rgba(121, 121, 121, 0.85);
        }
      }
    }
    path {
      stroke: ${COLORS.GRAY.G2};
    }
    &.disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
`;

export const Tile = styled.a`
  display: block;
  width: 11.25rem;
  height: 11.625rem;
  border-radius: 16px;
  box-sizing: border-box;
  border: 1px solid ${COLORS.GRAY.G6};
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  img {
    object-fit: cover;
    border-radius: 16px 16px 0 0;
    height: 100%;
    width: 100%;
  }
  .subcategory-image {
    height: 6.5rem;
  }
  p {
    margin: 0;
    margin-left: 1rem;
    transform: translateY(-8px);
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: normal;
  }
  &:hover {
    transform: translateY(-4px);
  }
  @media (max-width: 768px) {
    width: 7.5rem;
    height: 10.0625rem;
    border-radius: 12px;
    img,
    .image-wrap {
      border-radius: 12px 12px 0 0;
      width: 7.45rem;
      height: 6.0625rem;
    }
    p {
      margin-left: 8px;
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
    }
  }
`;

export const IconContainer = styled.div`
  height: 3.0625rem;
  width: 3.0625rem;
  border: 1.56px solid ${COLORS.BRAND.WHITE};
  border-radius: 12px;
  background-color: ${COLORS.PURPS.DARK_TONE};
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-24px) translateX(16px);
  .image-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  svg {
    stroke: ${COLORS.BRAND.WHITE};
  }
  @media (max-width: 768px) {
    transform: translateX(8px) translateY(-16px);
    height: 2rem;
    width: 2rem;
    border-radius: 8px;
  }
`;

export const PillIcon = styled.div<{
  $iconUrl: string;
}>`
  height: 1.5rem;
  width: 1.5rem;
  mask: ${({ $iconUrl }) => `url("${$iconUrl}")`};
  background: ${COLORS.BRAND.WHITE};
  mask-repeat: no-repeat;
  mask-size: 1.5rem 1.5rem;

  @media (max-width: 768px) {
    height: 1rem;
    width: 1rem;
    mask-size: 1rem 1rem;
  }
`;
