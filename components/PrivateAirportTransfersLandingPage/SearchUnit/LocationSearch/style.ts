import styled from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const LocationSearchWrapper = styled.div`
  .relative {
    position: relative;
    margin: 1.25rem 1.25rem 0 1.25rem;

    &:focus-within {
      svg path {
        fill: ${COLORS.BRAND.PURPS};
      }
    }

    .clear-search-icon {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      padding: 0.9rem 0.9rem 0.9rem 2.25rem;
      right: 1px;
      border-radius: 0 8px 8px 0;

      background: linear-gradient(
        270deg,
        #ffffff 56.76%,
        rgba(255, 255, 255, 0) 100%
      );

      svg {
        width: 0.875rem;
        height: 0.875rem;
      }
    }
  }

  ul {
    height: 100%;
    padding-bottom: 5rem;
  }

  @media (min-width: 769px) {
    height: 3.875rem;
    .relative {
      margin: 0;
      height: 100%;

      .clear-search-icon {
        display: none;
      }
    }

    ul {
      padding-bottom: 0;
    }

    svg {
      width: 1.375rem;
      height: 1.375rem;
    }
  }
`;

export const IconWrapper = styled.span`
  position: absolute;
  top: calc(50% - 0.65rem);
  left: 1rem;

  svg {
    -webkit-transform: translate(0px, 0px); /* Safari and Chrome */
  }

  @media (min-width: 769px) {
    left: 1rem;
  }
`;

export const TopText = styled.div<{
  $shouldDim: boolean;
}>`
  position: absolute;

  ${({ $shouldDim }) =>
    $shouldDim
      ? getFontDetailsByLabel(FONTS.UI_LABEL_SMALL)
      : getFontDetailsByLabel(FONTS.UI_LABEL_SMALL_HEAVY)};
  transition: font-weight, 0.1s ease-in;
  color: ${({ $shouldDim }) => ($shouldDim ? COLORS.GRAY.G3 : COLORS.GRAY.G2)};

  left: 2.875rem;
  top: 0.75rem;

  @media (min-width: 769px) {
    top: 0.8125rem;
  }
`;

export const StyledInput = styled.input<{
  readOnly?: boolean;
  $hasError?: boolean;
}>`
  border-radius: 8px;
  border: 1px solid
    ${({ $hasError }) =>
      $hasError ? COLORS.TEXT.WARNING_RED_1 : COLORS.GRAY.G6};
  padding: 0.625rem 1.875rem 0.75rem 2.5rem;
  &:focus {
    outline: none;
    border: 1px solid ${COLORS.PURPS.LIGHT_TONE_1};
    box-shadow: 0px 0px 8px 0px rgba(128, 0, 255, 0.16);

    &::placeholder {
      color: ${COLORS.GRAY.G4A};
    }
  }

  box-sizing: border-box;
  min-height: 3.375rem;

  ${getFontDetailsByLabel(FONTS.UI_LABEL_REGULAR)};
  font-size: 0.875rem;

  &::placeholder {
    ${getFontDetailsByLabel(FONTS.UI_LABEL_REGULAR)}
    color: ${COLORS.GRAY.G4A};
    font-weight: 300;
  }

  line-height: unset;

  width: 100%;

  /* overflow: hidden; */
  text-overflow: ellipsis;

  cursor: ${({ readOnly }) => (readOnly ? 'pointer' : 'edit')};

  @media (min-width: 769px) {
    height: 100%;
    ${getFontDetailsByLabel(FONTS.UI_LABEL_MEDIUM_HEAVY)};
    color: ${COLORS.GRAY.G2};

    padding: 1.75rem 0.75rem 0.75rem 2.85rem;

    &::placeholder {
      ${getFontDetailsByLabel(FONTS.UI_LABEL_MEDIUM)};
      color: ${COLORS.GRAY.G3};
    }
  }

  // iOS Safari fix for input scaling
  @supports (-webkit-overflow-scrolling: touch) {
    width: calc(100% + 14.28%);
    font-size: 1rem;
    transform: scale(0.875);
    transform-origin: left center;
    margin-right: -14.28%;

    padding: 0.875rem 1rem 1rem 2.75rem;

    height: 3.875rem;

    &::placeholder {
      font-size: 1rem;
    }
  }
`;
