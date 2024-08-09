import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledMapViewCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: calc(100vw - 4.5rem);
  height: fit-content;
  background: ${COLORS.BRAND.WHITE};
  border-radius: 12px;
  padding: 3.375rem 1rem 1rem;
  flex-shrink: 0;
  scroll-snap-align: start;
  filter: drop-shadow(0px 4px 25px rgba(0, 0, 0, 0.12))
    drop-shadow(0px -1px 2px rgba(0, 0, 0, 0.08));

  p,
  h6 {
    margin: 0;
  }

  &:first-child {
    margin-left: 1.5rem;
  }

  &:last-child {
    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: -1.5rem;
      width: 1.5rem;
      height: 100%;
    }
  }

  .tag-container {
    position: absolute;
    top: 0;
    left: 0;
  }

  .heading {
    ${expandFontToken(FONTS.HEADING_SMALL)};
    letter-spacing: 0.6px;
    color: ${COLORS.GRAY.G2};
    margin-bottom: 0.375rem;
  }

  .cta-container {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .nearby-things-container {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-top: 0.75rem;
  }

  .nearby-things-value-container {
    display: flex;
    gap: 0.25rem;
  }

  .nearby-things-heading {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    color: ${COLORS.GRAY.G3};
  }

  .nearby-things-value {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    color: ${COLORS.GRAY.G3};
    white-space: nowrap;
    overflow: hidden;
    padding-bottom: 0.125rem; // this is added to prevent text from cutting off from the bottom
    text-overflow: ellipsis;
  }

  .endpoint-same-callout-label {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    color: ${COLORS.GRAY.G3};
  }
`;

export const StyledMapViewCardButton = styled.button<{
  $type: 'primary' | 'secondary';
}>`
  height: 2rem;
  min-width: 8.9375rem;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  margin: 0;
  border-radius: 8px;
  outline: none;
  border: none;

  p {
    margin: 0;
  }

  .label {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    color: inherit;
  }

  ${({ $type }) => {
    switch ($type) {
      case 'primary':
        return css`
          background: ${COLORS.BRAND.PURPS};
          color: ${COLORS.BRAND.WHITE};
        `;
      case 'secondary':
        return css`
          background: ${COLORS.BACKGROUND.FLOATING_PURPS};
          color: ${COLORS.TEXT.PURPS_3};
        `;
    }
  }}
`;

export const StyledButtonIconContainer = styled.div<{
  $svgPathColor?: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  svg {
    height: 0.75rem;
    width: 0.75rem;
  }

  ${({ $svgPathColor }) =>
    $svgPathColor &&
    css`
      svg {
        path {
          stroke: ${$svgPathColor};
        }
      }
    `}
`;
