import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const SideNavButton = styled.div`
  display: inline;
  position: fixed;
  cursor: pointer;
  top: 22.5rem;
  padding: 0.5rem 0.75rem;
  background: ${COLORS.BRAND.WHITE};
  z-index: 10;
  border: 1px solid ${COLORS.GRAY.G7};
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0 8px 8px 0;
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};
    bottom: 1.5rem;
    left: 1rem;
    top: unset;
    position: fixed;
    border-radius: 8px;
  }
`;
export const StyledItem = styled.div`
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  display: grid;
  svg {
    display: none;
  }
  &.active {
    position: relative;
    background: ${COLORS.BACKGROUND.FLOATING_PURPS};
  }
  .sidenav-item.active {
    color: ${COLORS.TEXT.PURPS_3};
  }
  :last-child {
    margin-bottom: unset;
  }
  ${expandFontToken(FONTS.LIST_REGULAR)};
  cursor: pointer;

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
    border-bottom: 1px solid ${COLORS.GRAY.G6};
    grid-template-columns: auto 1rem;
    margin: 0 1rem 0 1.5rem;
    padding: 1rem 0;
    .sidenav-item {
      margin-right: 1.5rem;
    }
    .sidenav-item.active {
      color: ${COLORS.BRAND.PURPS};
    }
    &.active {
      margin-top: 0;
      border-left: none;
      background: unset;
    }
    :last-child {
      border-bottom: none;
      padding-bottom: 2.5rem;
    }
    svg {
      display: block;
    }
  }
`;

export const StyledIcon = styled.div`
  display: inline;
  &.double-chevron {
    margin-left: 0.5rem;
    svg {
      margin-bottom: -1px;
    }
  }
  &.list-icon {
    margin-right: 0.5rem;
    svg {
      margin-bottom: -2px;
    }
  }
`;

export const BorderHighlight = styled.div`
  background: ${COLORS.BRAND.PURPS};
  width: 3px;
  height: 100%;
  position: absolute;
  border-radius: 0 12px 12px 0;
  @media (max-width: 768px) {
    display: none;
  }
`;
