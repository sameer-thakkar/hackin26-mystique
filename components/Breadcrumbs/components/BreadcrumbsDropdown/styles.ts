import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledBreadcrumbsDropdownContainer = styled.div<{
  $leftOffset: number;
}>`
  display: grid;
  grid-gap: 0.25rem;
  position: absolute;
  z-index: 2;
  background: ${COLORS.BRAND.WHITE};
  margin-top: 0.07rem;
  margin-left: ${({ $leftOffset }) =>
    `${$leftOffset - 0.125 * window.innerWidth}px`};
  padding: 0.5rem 0;
  border-radius: 0.25rem;
  border: 1px solid ${COLORS.GRAY.G6};
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1),
    0px 0px 1px 0px rgba(0, 0, 0, 0.1);
`;

export const StyledBreadcrumbsDropdownItem = styled.a`
  padding: 0.25rem 0.75rem;
  ${expandFontToken(FONTS.UI_LABEL_SMALL)}
  color: ${COLORS.GRAY.G2};
  cursor: pointer;

  :hover {
    color: ${COLORS.BRAND.PURPS};
  }
`;
