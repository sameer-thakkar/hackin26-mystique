import styled from 'styled-components';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';

export const StyledVerticalDivider = styled.div<{ $isDarkMode?: boolean }>`
  height: 1.5rem;
  width: 0.031rem;
  opacity: 0.8;
  background-color: ${({ $isDarkMode }) =>
    $isDarkMode ? `${COLORS.GRAY.G8}` : `${COLORS.GRAY.G3}`};
  margin: 0 0.25rem;

  @media (max-width: 768px) {
    height: 1.625rem;
    padding-bottom: 0.25rem;
  }
`;

export const StyledButtonWrapper = styled.div<{ $isDarkMode?: boolean }>`
  display: flex;
  padding: 0.5rem 0.75rem;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  border-radius: 0.25rem;
  cursor: pointer;
  ${expandFontToken('UI/Label Medium')};
  &:hover {
    background: ${({ $isDarkMode }) =>
      !$isDarkMode ? `${COLORS.GRAY.G8}` : `${COLORS.VIOLET.DARK_TONE}`};
  }
  .button-text {
    color: ${({ $isDarkMode }) =>
      $isDarkMode ? `${COLORS.GRAY.G8}` : `${COLORS.GRAY.G3}`};
  }
  .icon {
    padding-top: 1px;
    display: flex;
  }
`;

export const StyledPopOverWrapper = styled.div<{ $isOpen?: boolean }>`
  display: ${(props) => (props?.$isOpen ? 'flex' : ' none')};
  position: absolute;
  transform: translateX(-50%);
  top: 50px;
  left: -180px;
  background-color: ${COLORS.BRAND.WHITE};
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1),
    0px 0px 1px 0px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  max-height: 27rem;
  max-width: 40.625rem;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  z-index: 1;
  :after {
    height: 10px;
    content: '';
    display: block;
  }
  .selected-header-active {
    color: ${COLORS.BRAND.PURPS};
  }
  .head {
    color: ${COLORS.GRAY.G1};
  }
`;

export const StyledPopOverHeader = styled.header`
  padding: 0.25rem 0.75rem 0;
  display: flex;
  align-items: start;
  height: 2.75rem;
  width: 39.125rem;
  border-bottom: 1px solid ${COLORS.GRAY.G6};
  ${expandFontToken('Heading/XS')};
  }
`;

export const StyleContainer = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  width: 38.438rem;
  height: 24rem;
  padding: 1rem 1rem 0;
  ::-webkit-scrollbar {
    width: 0.25rem;
  }
  ::-webkit-scrollbar-track {
    /* box-shadow: inset 0 0 2px transparent; */
    border-radius: 8;
  }
  ::-webkit-scrollbar-thumb {
    background: ${COLORS.GRAY.G6};
    border-radius: 5px;
    height: 106px;
  }
`;

export const StyledHeaderItem = styled.div<{ $isActive?: boolean }>`
  display: flex;
  height: 2.75rem;
  margin: 0 0.75rem 0 0.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${COLORS.GRAY.G2};
  cursor: pointer;
  border-bottom: ${({ $isActive }) =>
    $isActive ? `0.125rem solid ${COLORS.BRAND.PURPS}` : 'none'};
`;

export const StyledPopOverContent = styled.div`
  width: 38rem;
  margin-bottom: 0.75rem;
  .content-header {
    display: flex;
    padding: 0 0.5rem;
    align-items: center;
    gap: 0.5rem;
    align-self: stretch;
    color: ${COLORS.GRAY.G2};
    margin-bottom: 0.75rem;
    ${expandFontToken('Subheading/Small')};
  }

  .content-layer {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 0.5rem 0.75rem;
    padding: 0 0 1rem 0;
  }
  .content-layer-border {
    border-bottom: 0.063rem solid ${COLORS.GRAY.G6};
  }
`;

export const StyledPopOver = styled.div`
  position: relative;
`;

export const StyledContentValue = styled.div<{ $isSelected?: boolean }>`
  height: 2.875rem;
  width: 11.875rem;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${COLORS.BACKGROUND.FLOATING_PURPS};
  }

  &:hover .text-content .main-text,
  &:hover .text-content .sub-text {
    color: ${COLORS.BRAND.PURPS};
  }

  .text-content {
    display: flex;
    flex-direction: column;
    width: 10.75rem;
    padding: 0.375rem 0 0.375rem 0.5rem;

    .main-text {
      font-size: 0.875rem;
      font-style: normal;
      font-weight: 500;
      line-height: 1rem;
      color: ${COLORS.GRAY.G2};
      margin-bottom: 0.125rem;
    }

    .sub-text {
      color: ${COLORS.GRAY.G3};
      ${expandFontToken('UI/Label Small')}
    }
  }

  ${({ $isSelected }) => {
    return (
      $isSelected &&
      `
      background-color: ${COLORS.BACKGROUND.FLOATING_PURPS};
      .text-content .sub-text,
      .text-content .main-text {
        color: ${COLORS.BRAND.PURPS};
      }
      `
    );
  }}
`;
