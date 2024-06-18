import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const IconContainer = styled.div`
  height: 2.1875rem;
  width: 3.5rem;
  border-radius: 4px;
  background-color: ${COLORS.GRAY.G3};
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    path {
      stroke: ${COLORS.BRAND.WHITE};
    }
  }
`;

export const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;

  .swiper,
  .swiper-initialized {
    height: 100%;
  }

  max-width: calc(100vw - 2rem);

  @media only screen and (min-width: 768px), print {
    max-width: calc(753px - 3.125rem);
  }
`;

export const HeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.625rem;

  p.passby-heading {
    margin: 0;
    ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
    color: ${COLORS.GRAY.G3};
  }
`;

export const PassByContent = styled.div<{ $isClickable?: boolean }>`
  display: grid;
  grid-template-areas: ${({ $isClickable }) =>
    $isClickable ? "'name arrow' 'duration arrow'" : "'name' 'duration'"};
  ${({ $isClickable }) =>
    $isClickable &&
    css`
      grid-template-columns: 1fr 0.75rem;
    `};
  grid-template-rows: 1fr auto;
  column-gap: 0.5rem;
  flex-grow: 1;

  .passby-name {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
    color: ${COLORS.GRAY.G2};
    grid-area: name;
    line-height: 19px;
  }

  .passby-duration {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    color: ${COLORS.GRAY.G3};
    grid-area: duration;
  }

  .passby-arrow {
    grid-area: arrow;
    align-self: center;

    path {
      stroke: ${COLORS.GRAY.G2};
    }
  }
`;

export const PassByContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  width: calc(100% - 1rem);
  background-color: ${COLORS.GRAY.G8};

  border-radius: 8px;
  padding: 0.5rem;

  .image-wrap {
    height: 2.1875rem;
    width: 3.5rem;
    aspect-ratio: 16 / 10;

    img {
      height: 2.1875rem;
      width: 3.5rem;
      border-radius: 4px;
    }
  }
`;

export const Container = styled.div``;
