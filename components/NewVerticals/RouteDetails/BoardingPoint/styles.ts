import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div<{ $isSideModal?: boolean }>`
  display: grid;
  gap: 0.375rem;
  padding-bottom: 1rem;
  &:not(:last-of-type) {
    border-bottom: 1px dashed ${COLORS.GRAY.G6};
  }
  ${({ $isSideModal }) =>
    $isSideModal &&
    css`
      margin: 0 1.25rem 1.25rem 0;
      &:first-of-type {
        margin-top: 1.5rem;
      }
    `}

  @media (max-width: 768px) {
    ${({ $isSideModal }) =>
      $isSideModal &&
      css`
        margin: 0 1rem 1rem 0;
        &:first-of-type {
          margin-top: 1.25rem;
        }
      `}
  }
`;

export const Title = styled.div`
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
  text-transform: uppercase;
  color: ${COLORS.GRAY.G2};

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
  }
`;
export const StopName = styled.div`
  ${expandFontToken(FONTS.HEADING_SMALL)}
  color: ${COLORS.GRAY.G2};

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.SUBHEADING_LARGE)}
  }
`;
export const DirectionCTA = styled.a`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
  text-decoration: underline;
  color: ${COLORS.TEXT.CANDY_1};

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
  }
`;
