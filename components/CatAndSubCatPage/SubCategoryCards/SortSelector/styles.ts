import styled, { css } from 'styled-components';
import { HeadingContainer, Separator } from 'components/common/Drawer';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const SortSelectorContainer = styled.div`
  position: relative;
`;

export const SelectorFilter = styled.div<{ $isDropdownOpen: boolean }>`
  display: flex;
  padding: 0.625rem 0.75rem;
  align-items: center;
  gap: 0.375rem;
  border-radius: 120px;
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
  cursor: pointer;

  .arrow-icon {
    width: 1rem;
    height: 1rem;
    transform: rotate(-90deg);
    padding: 0.125rem;
  }

  .chevron-icon {
    width: 0.75rem;
    height: 0.75rem;
    position: relative;
    top: -1px;
    transition: transform 0.3s ease;
    transform-origin: center;
  }

  ${({ $isDropdownOpen }) =>
    $isDropdownOpen &&
    `
      background: ${COLORS.GRAY.G8};
      .chevron-icon {
        top: 1px;
        transform: rotate(0deg) scaleY(-1); 
      }
     `}
`;

export const SelectorDropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  z-index: 3;
  min-width: 13.75vw;
  display: flex;
  padding: 0.75rem 0;
  flex-direction: column;
  border-radius: 4px;
  background: ${COLORS.BRAND.WHITE};
  border: 1px solid ${COLORS.GRAY.G7};
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1),
    0px 0px 1px 0px rgba(0, 0, 0, 0.1);
`;

export const drawerStyles = css`
  height: 24rem;

  ${HeadingContainer} {
    grid-row-gap: 0.5rem;
    padding: 0 1.5rem;

    .close-icon {
      grid-row: 2;
      cursor: pointer;
    }
  }

  ${Separator} {
    display: none;
  }
`;

export const drawerWrapperStyles = css`
  grid-template-rows: auto 1fr;
`;

export const DrawerContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DrawerFilters = styled.div`
  padding: 0 1.5rem 2rem;
`;

export const DrawerControls = styled.div`
  position: absolute;
  bottom: 0;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  width: calc(100% - 3rem);
  box-shadow: 0px -2px 12px 0px rgba(84, 84, 84, 0.1);

  button {
    width: 100%;
    padding: 0.6875rem 1rem 0.8125rem;
    border: none;
    border-radius: 0.5rem;
    ${expandFontToken(FONTS.BUTTON_MEDIUM)};

    & + .reset {
      background: ${COLORS.GRAY.G7};
      color: ${COLORS.GRAY.G2};
    }

    & + .apply {
      background: ${COLORS.BRAND.PURPS};
      color: ${COLORS.BRAND.WHITE};
    }
  }
`;
