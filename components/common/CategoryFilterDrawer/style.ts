import styled, { css } from 'styled-components';
import { PanelAnchor } from 'components/common/Drawer';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const categoryDrawerStyles = css`
  .category-filter__drawer {
    max-height: 28.125rem;
    height: auto;
    grid-row-gap: 0;

    & > div:first-child {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid ${COLORS.GRAY.G6};

      ${PanelAnchor} {
        display: none;
      }
    }
  }

  .close-icon {
    position: absolute;
    top: 0.4rem;
    right: 0.625rem;
    cursor: pointer;
    padding: 0.875rem;
  }
`;

export const DrawerBody = styled.div`
  margin: 0 1.5rem 4.75rem;
  max-height: 17.25rem;
  padding: 0.5rem 0;
  list-style-type: none;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0;
    opacity: 0;
    visibility: hidden;
  }
`;

export const Footer = styled.div`
  padding: 1rem 1.5rem;
  box-shadow: 0 -0.125rem 0.75rem rgba(84, 84, 84, 0.1);
  position: fixed;
  bottom: 0;
  width: calc(100vw - 3rem);
  background: white;

  display: flex;
  flex-direction: row;
  gap: 0.75rem;
`;

export const CheckBoxContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 1.25rem;
  width: 1.25rem;
  border-radius: 0.125rem;

  background-color: ${COLORS.BRAND.WHITE};
  border: 0.0625rem solid ${COLORS.GRAY.G6};

  svg {
    opacity: 0;
    transform: scale(0.75);
    transition: all 0.3s;
  }
`;

export const ListItemInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Icon = styled.div<{
  $svgUrl: string;
}>`
  flex-shrink: 1;
  background-color: ${COLORS.GRAY.G2};
  mask: ${({ $svgUrl }) => `url("${$svgUrl}") no-repeat center / contain`};
  height: 1rem;
  width: 1rem;
  margin-right: 0.5rem;
  transition: all 0.3s;
`;

export const ListItem = styled.label<{ $isSelected?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 0;
  background-color: ${COLORS.BRAND.WHITE};
  cursor: pointer;
  transition: all 0.3s;

  .dropdown-content-title {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
    color: ${COLORS.GRAY.G2};
  }

  input {
    display: none;
  }

  &:hover {
    ${CheckBoxContainer} {
      border: 0.0625rem solid ${COLORS.PURPS.LEVEL_3};
    }
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${COLORS.GRAY.G6};
  }

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      ${CheckBoxContainer} {
        background-color: ${COLORS.BRAND.PURPS};
        border: 0.0625rem solid ${COLORS.BRAND.PURPS};

        svg {
          opacity: 1;
          transform: scale(1);
        }
      }
    `};
`;
