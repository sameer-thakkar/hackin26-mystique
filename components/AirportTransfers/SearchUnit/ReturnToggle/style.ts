import styled from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const ReturnToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    color: ${COLORS.GRAY.G2};
    ${getFontDetailsByLabel(FONTS.SUBHEADING_SMALL)};
  }

  @media (min-width: 769px) {
    span {
      ${getFontDetailsByLabel(FONTS.SUBHEADING_REGULAR)};
    }
  }
`;

export const ToggleSwitch = styled.div<{
  $isToggled: boolean;
}>`
  grid-column: span 4;
  width: 2.5rem;
  height: 1.25rem;
  background-color: ${({ $isToggled }) =>
    $isToggled ? COLORS.BRAND.PURPS : COLORS.GRAY.G6};
  border-radius: 1rem;
  position: relative;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0.125rem;
    left: ${({ $isToggled }) =>
      $isToggled ? 'calc(100% - 1.125rem)' : '0.125rem'};
    width: 1rem;
    height: 1rem;
    background-color: white;
    border-radius: 50%;
    transition: position, 0.3s cubic-bezier(0.3, 1, 0.7, 1);
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* height: 100%; */
  box-sizing: border-box;
  width: 100%;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin: 1rem 1rem 0.75rem 1rem;
    box-sizing: border-box;

    ${getFontDetailsByLabel(FONTS.HEADING_SMALL)};
    color: ${COLORS.GRAY.G1};
  }

  .button-wrapper {
    margin-top: 1.875rem;
    padding: 1rem 1.25rem 2rem 1.25rem;

    border-top: 1px solid ${COLORS.GRAY.G6};
  }

  p {
    ${getFontDetailsByLabel(FONTS.PARAGRAPH_MEDIUM)};
    color: ${COLORS.GRAY.G2};
    margin: 0 1rem;
  }

  @media (min-width: 769px) {
    .button-wrapper {
      margin-top: 0.25rem;
      padding: 1.25rem;
      border-top: none;
    }

    .title {
      ${getFontDetailsByLabel(FONTS.HEADING_REGULAR)};

      svg {
        width: 1.9375rem;
        height: 1.9375rem;

        flex-shrink: 0;
      }
    }

    .title,
    p {
      margin-inline: 1.25rem;
    }

    p {
      ${getFontDetailsByLabel(FONTS.PARAGRAPH_LARGE)};
      font-size: 1.0625rem;
    }
  }
`;

export const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.25rem 0.75rem 1.25rem;
  border-bottom: 1px solid ${COLORS.GRAY.G6};

  h3 {
    margin: 0;
  }

  svg {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  svg {
    fill: ${COLORS.GRAY.G2};
  }

  @media (min-width: 769px) {
    h3 {
      ${getFontDetailsByLabel(FONTS.HEADING_SMALL)};
    }
  }
`;
