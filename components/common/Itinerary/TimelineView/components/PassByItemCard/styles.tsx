import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

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

export const IconContainer = styled.div`
  height: 2.1875rem;
  width: 3.5rem;
  border-radius: 4px;
  background-color: ${COLORS.GRAY.G3};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  svg {
    path {
      stroke: ${COLORS.BRAND.WHITE};
    }
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
  row-gap: 0.125rem;
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
