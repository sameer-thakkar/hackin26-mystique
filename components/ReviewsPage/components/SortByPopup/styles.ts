import styled, { css } from 'styled-components';
import { HeadingContainer } from 'components/common/Drawer';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const PopupContainer = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export const SelectedValue = styled.div`
  cursor: pointer;
  width: fit-content;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  & > *:hover {
    color: ${COLORS.GRAY.G2};
  }
  & > span {
    ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};
    color: ${COLORS.GRAY.G3};
  }
  @media (max-width: 768px) {
    & > span {
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
    }
  }
`;

export const Toggle = styled.div<{
  $expanded: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${expandFontToken(FONTS.PARAGRAPH_LARGE)};
  color: ${COLORS.GRAY.G3};
  svg {
    transition: transform 0.3s ease;
    transform-origin: center;
  }
  ${({ $expanded }) => {
    return (
      $expanded &&
      `
    svg{
        transform: rotate(180deg);
    }
    `
    );
  }}

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
    svg {
      height: 0.75rem;
      width: 0.75rem;
    }
  }
`;

export const OptionsPopup = styled.div`
  padding: 1rem;
  background-color: ${COLORS.BRAND.WHITE};
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.12),
    0px -1px 2px 0px rgba(0, 0, 0, 0.08);
  position: absolute;
  z-index: 2;
  border-radius: 12px;
  top: 32px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 16.5rem;
  box-sizing: border-box;
`;

export const Option = styled.div`
  & > * {
    cursor: pointer;
  }
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  ${expandFontToken(FONTS.UI_LABEL_LARGE)}
  input {
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border: 1px solid ${COLORS.GRAY.G3};
    border-radius: 50%;
  }
  input[type='radio']:checked {
    border: 6px solid ${COLORS.BRAND.PURPS};
  }
`;

export const DrawerStyles = css`
  height: auto;
  ${HeadingContainer} {
    grid-row-gap: 1rem;
    ${expandFontToken(FONTS.HEADING_SMALL)};
    .close-icon {
      display: none;
    }
  }
`;

export const DrawerOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 16.5rem;
  box-sizing: border-box;
  margin-bottom: 1.875rem;
`;
