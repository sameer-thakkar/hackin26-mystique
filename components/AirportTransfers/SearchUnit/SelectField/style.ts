import styled, { css } from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const FieldWrapper = styled.div<{
  $isFocused: boolean;
  $hasError: boolean;
}>`
  margin-bottom: 0;

  border: 1px solid
    ${({ $isFocused, $hasError }) =>
      $isFocused
        ? COLORS.BRAND.PURPS
        : $hasError
        ? COLORS.PRIMARY.WARNING_RED
        : COLORS.GRAY.G6};

  ${({ $hasError }) => $hasError && css``};

  border-radius: 8px;

  ${({ $isFocused }) =>
    $isFocused &&
    `
  box-shadow: 0px 0px 8px 0px rgba(128, 0, 255, 0.16);

  `};

  padding: 0.75rem;

  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 0.5rem;
  align-items: center;
  box-sizing: border-box;
  min-height: 3.6rem;
  height: 100%;

  cursor: pointer;

  svg {
    grid-row: span 2;

    &:not(.location-pin-svg) path {
      ${({ $isFocused }) => $isFocused && `stroke: ${COLORS.BRAND.PURPS};`}
    }

    &.location-pin-svg path {
      ${({ $isFocused }) => $isFocused && `fill: ${COLORS.BRAND.PURPS};`};
    }
  }

  @media (min-width: 769px) {
    grid-auto-flow: dense;
    padding: 0.8125rem 1rem;
    height: 3.875rem;
    svg {
      width: 1.375rem;
      height: 1.375rem;
    }
  }
`;

export const TopLabel = styled.span<{
  $hasValue: boolean;
}>`
  display: none;
  color: ${COLORS.GRAY.G3};

  @media (min-width: 769px) {
    display: block;
    color: ${COLORS.GRAY.G2};

    ${({ $hasValue }) =>
      $hasValue
        ? getFontDetailsByLabel(FONTS.UI_LABEL_SMALL)
        : getFontDetailsByLabel(FONTS.UI_LABEL_SMALL_HEAVY)};
  }
`;

export const PlaceHolderText = styled.span<{
  $hasValue: boolean;
  $isFocused: boolean;
}>`
  color: ${COLORS.GRAY.G3};

  ${({ $hasValue }) =>
    $hasValue
      ? css`
          ${getFontDetailsByLabel(FONTS.UI_LABEL_XS)};
        `
      : css`
          ${getFontDetailsByLabel(FONTS.UI_LABEL_REGULAR)};
          grid-row: span 2;
        `};

  transition: font-size 0.3s cubic-bezier(0.7, 1, 0.3, 1);

  align-self: center;

  @media (min-width: 769px) {
    ${getFontDetailsByLabel(FONTS.UI_LABEL_MEDIUM)};
    color: ${({ $isFocused }) =>
      $isFocused ? COLORS.GRAY.G4A : COLORS.GRAY.G3};

    ${({ $hasValue }) => $hasValue && `display: none;`};
  }
`;

export const Value = styled.div`
  ${getFontDetailsByLabel(FONTS.UI_LABEL_REGULAR_HEAVY)};
  color: ${COLORS.GRAY.G2};
  line-height: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 769px) {
    ${getFontDetailsByLabel(FONTS.UI_LABEL_MEDIUM_HEAVY)};
  }
`;
