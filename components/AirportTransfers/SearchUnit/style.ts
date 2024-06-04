import styled, { css } from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { TSelectedSearchTab, TTransferDirection } from './interface';

export const SearchUnitContainer = styled.div<{
  $hasTabsOnTop: boolean;
}>`
  position: relative;
  order: 2;

  z-index: 2;

  @media (min-width: 769px) {
    margin-top: ${({ $hasTabsOnTop }) =>
      $hasTabsOnTop ? '4.25rem' : '5.125rem'};
  }
`;

export const TabsRelativeWrapper = styled.div`
  position: relative;

  background-color: ${COLORS.GRAY.G8};
  border-radius: 12px 12px 0px 0px;

  @media (min-width: 769px) {
    width: max-content;
  }
`;

export const TabsContainer = styled.div`
  display: flex;

  box-sizing: border-box;
  width: 100%;

  @media (min-width: 769px) {
    width: max-content;
  }
`;

export const TabHighlighter = styled.div<{
  $selectedTab: TSelectedSearchTab;
}>`
  background-color: white;
  z-index: 2;
  position: absolute;
  width: calc(50% + 6px);
  height: 100%;
  top: 0;
  border-radius: 12px 12px 0px 0px;
  border: 1px solid ${COLORS.GRAY.G6};
  border-bottom: none;

  left: ${({ $selectedTab }) =>
    $selectedTab === 'PRIVATE_TAB' ? 'calc(50% - 8px)' : '0'};
  transition: left 0.3s cubic-bezier(0.7, 1, 0.3, 1);

  box-shadow: -2px 0px 8px -5px rgba(0, 0, 0, 0.05); // 📔  Update

  &::before,
  &::after {
    content: '';
    position: absolute;
    bottom: 0px;
    width: 4px;
    height: 4px;
    border: 1px solid ${COLORS.GRAY.G6};
    z-index: -1;
  }

  &::before {
    left: -5px;
    border-bottom-right-radius: 5px;
    border-width: 0 1px 1px 0;
    box-shadow: 4.75px 4.75px 0 4.75px white;

    display: ${({ $selectedTab }) =>
      $selectedTab === 'PRIVATE_TAB' ? 'block' : 'none'};
  }

  &::after {
    right: -5px;
    border-bottom-left-radius: 10px;
    border-width: 0 0 1px 1px;
    box-shadow: -4.75px 4.75px 0 4.75px white;
    display: ${({ $selectedTab }) =>
      $selectedTab === 'SHARED_TAB' ? 'block' : 'none'};
  }

  @media (min-width: 769px) {
    width: calc(50% + 2px);
    left: ${({ $selectedTab }) =>
      $selectedTab === 'PRIVATE_TAB' ? 'calc(50% - 4px)' : '0'};

    &::before {
      width: 12px;
      height: 12px;
      left: -13px;
      border-bottom-right-radius: 12px;
      border-width: 0 1px 1px 0;
      box-shadow: 4.75px 4.75px 0 4.75px white;
    }

    &::after {
      width: 12px;
      height: 12px;

      right: -13px;
      border-bottom-left-radius: 12px;
      border-width: 0 0 1px 1px;
      box-shadow: -4.75px 4.75px 0 4.75px white;

      display: block;
    }
  }
`;

export const Tab = styled.div<{ $selected: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem 0.875rem 2rem;
  z-index: ${({ $selected }) => ($selected ? 3 : 2)};
  box-sizing: border-box;

  -webkit-tap-highlight-color: transparent;

  ${getFontDetailsByLabel(FONTS.UI_LABEL_REGULAR_HEAVY)};
  font-size: 0.875rem;
  color: ${({ $selected }) =>
    $selected ? COLORS.TEXT.PURPS_3 : COLORS.GRAY.G2};

  cursor: pointer;
  pointer-events: ${({ $selected }) => ($selected ? 'none' : 'auto')};

  svg {
    width: 1rem;
    height: 1rem;

    path {
      stroke: ${({ $selected }) =>
        $selected ? COLORS.TEXT.PURPS_3 : COLORS.GRAY.G2};
    }
  }

  border: 1px solid transparent;

  border-top: 1px solid ${COLORS.GRAY.G6};

  ${({ $selected }) =>
    !$selected
      ? css`
          @media (hover: hover) {
            &:hover {
              background-color: ${COLORS.GRAY.G7};
            }
          }

          border-top: 1px solid ${COLORS.GRAY.G6};

          &:first-child {
            border-left: 1px solid ${COLORS.GRAY.G6};
            border-radius: 12px 0 0 0;
          }

          &:last-child {
            border-right: 1px solid ${COLORS.GRAY.G6};
            border-radius: 0 12px 0 0;
          }
        `
      : css`
          &:last-child {
            border-radius: 0 12px 0 0;
          }

          &:first-child {
            border-radius: 12px 0 0 0;
          }
        `}

  @media (min-width: 769px) {
    flex: initial;
    width: auto;
    padding: 1rem 2.625rem 0.75rem 2.625rem;

    ${getFontDetailsByLabel(FONTS.SUBHEADING_LARGE)};
  }
`;

export const InputsWrapper = styled.div<{
  $selectedTab: TSelectedSearchTab;
  $hasTabsOnTop: boolean;
}>`
  position: relative;
  padding: 1rem;
  background-color: white;
  border: 1px solid ${COLORS.GRAY.G6};

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;

  row-gap: 1rem;

  ${({ $hasTabsOnTop, $selectedTab }) =>
    $hasTabsOnTop
      ? css`
          border-radius: ${$selectedTab === 'SHARED_TAB'
            ? '0 12px 12px 12px'
            : '12px 0px 12px 12px'};

          box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
        `
      : css`
          border-radius: 12px;

          &::before,
          &::after {
            display: none;
          }
        `};

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -1px;

    width: 1.6rem;
    height: 1.6rem;
    background-color: ${COLORS.GRAY.G8};
    z-index: -1;
  }

  &::before {
    left: -1px;
    border-left: 1px solid ${COLORS.GRAY.G6};
  }

  &::after {
    right: -1px;
    border-right: 1px solid ${COLORS.GRAY.G6};
  }

  .return-toggle-switch {
    order: 3;
  }

  .shared-search-button {
    padding: 0.75rem 1.5rem;
    order: 4;
  }

  .pvt-date-time-error {
    bottom: -1.25rem;
  }

  @media (max-width: 768px) {
    .shared-search-button:hover {
      background-color: ${COLORS.BRAND.PURPS};
    }
  }

  @media (min-width: 769px) {
    grid-template-columns: ${({ $selectedTab }) =>
      $selectedTab === 'SHARED_TAB'
        ? '3.2fr 1fr 8.4rem'
        : '1.8fr minmax(18.2rem, 1fr) 9.5rem 8.4rem'};
    grid-template-rows: ${({ $selectedTab }) =>
      $selectedTab === 'SHARED_TAB' ? 'auto' : '1fr'};
    column-gap: 0.75rem;
    row-gap: 0.75rem;
    grid-auto-rows: 1fr;
    border-radius: ${({ $selectedTab }) =>
      $selectedTab === 'SHARED_TAB' ? '0 12px 12px 12px' : '12px'};

    ${({ $hasTabsOnTop }) =>
      !$hasTabsOnTop &&
      css`
        border-radius: 12px;
      `};

    padding: 1.25rem;
    .return-toggle-switch {
      order: 4;
    }

    &:after {
      display: none;
    }

    .shared-search-button {
      order: 3;
      height: 3.875rem;
    }

    .private-search-button {
      height: 3.875rem;
    }
  }
`;

export const LocationInputsContainer = styled.div<{
  $direction: TTransferDirection;
  $hasError: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  position: relative;

  button {
    top: ${({ $hasError }) =>
      $hasError ? 'calc(50% - 1.5rem)' : 'calc(50% - 1.125rem)'};
  }

  @media (min-width: 769px) {
    flex-direction: row;
    gap: 0.5rem;

    button {
      top: ${({ $hasError }) =>
        $hasError ? 'calc(50% - 1.375rem)' : 'calc(50% - 1rem)'};
    }

    & > div {
      ${({ $direction }) =>
        $direction === 'TO_AIRPORT'
          ? css`
              &:first-child .select-field {
                padding-left: 1.25rem;
              }
            `
          : css`
              &:last-child .select-field {
                padding-left: 1.25rem;
              }

              .relative {
                span {
                  left: 1.25rem;
                }
                input {
                  padding-left: 3.125rem;
                }

                div {
                  left: 3.125rem;
                }
              }
            `};
    }

    & > div {
      flex: 1;
    }
  }
`;

export const SwapButton = styled.button`
  box-sizing: border-box;
  width: max-content;
  background: white;
  z-index: 1;
  outline: none;
  border: none;
  padding: 0;
  border-radius: 50%;
  display: flex;

  position: absolute;
  right: 0.75rem;
  top: calc(50% - 1rem);

  &:active {
    box-shadow: 0px 0px 8px 0px #8000ff29;
  }

  transition: transform 0.3s cubic-bezier(0.3, 1, 0.7, 1);

  &.reverse {
    transform: rotate(180deg);
  }

  @media (hover: hover) {
    &:hover {
      box-shadow: 0px 0px 8px 0px #8000ff29;
    }
  }

  @media (min-width: 769px) {
    left: calc(50% - 1rem);
    cursor: pointer;

    svg {
      rotate: 90deg;
      width: 2rem;
      height: 2rem;
    }
  }
`;

export const FlexContainer = styled.div<{
  $isFocused: boolean;
  $hasError: boolean;
}>`
  display: flex;
  gap: 0.75rem;

  position: relative;

  & > div {
    flex: 1;
  }

  box-sizing: border-box;

  ${({ $hasError }) =>
    $hasError &&
    css`
      margin-bottom: 0.75rem;
    `};

  @media (min-width: 769px) {
    gap: 0;
    outline: 1px solid
      ${({ $isFocused }) => ($isFocused ? COLORS.BRAND.PURPS : COLORS.GRAY.G6)};
    border-radius: 8px;

    max-height: 3.875rem;

    ${({ $hasError }) =>
      $hasError &&
      css`
        margin-bottom: 0.75rem;
        outline: 1px solid ${COLORS.TEXT.WARNING_RED_1};
      `};

    ${({ $isFocused }) =>
      $isFocused &&
      css`
        box-shadow: 0px 0px 8px 0px rgba(128, 0, 255, 0.16);
      `};

    .select-field {
      border: none;
      box-shadow: none;
      position: relative;
    }

    .pvt-time-field {
      .select-field::after {
        position: absolute;
        content: '';
        width: 1px;
        height: 2rem;
        background-color: ${COLORS.GRAY.G6};
      }
    }
  }
`;

export const Divider = styled.div`
  margin-top: 1.25rem;
  border-bottom: 1px solid rgba(197, 141, 255, 1);
  order: 2;

  @media (min-width: 769px) {
    display: none;
  }
`;

export const RelativeWrapper = styled.div<{
  $hasError?: boolean;
}>`
  position: relative;
  box-sizing: border-box;
  margin-bottom: 0;

  ${({ $hasError }) => $hasError && 'padding-bottom: 0.75rem'};

  /* & > div {
    height: 100%;
  } */
`;

export const DropdownContainer = styled.div<{
  $hasError?: boolean;
}>`
  position: absolute;
  top: ${({ $hasError }) =>
    !$hasError ? 'calc(100% + 0.5rem)' : 'calc(100% - 0.25rem)'};
  background: white;
  border-radius: 8px;
  border: 1px solid ${COLORS.GRAY.G6};
  width: 100%;

  box-sizing: border-box;

  padding: 1rem 0;
  z-index: 2;

  max-height: 15rem;
  overflow-y: auto;
  overflow-x: hidden;

  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1),
    0px 0px 1px 0px rgba(0, 0, 0, 0.1);

  ::-webkit-scrollbar-track {
    background-color: ${COLORS.GRAY.G7};
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgb(196, 196, 196);
    border-radius: 2px;
    box-shadow: ${COLORS.GRAY.G7} 2.5px 0px 0px inset,
      ${COLORS.GRAY.G7} -1.5px 0px 0px inset;
  }

  .core-loading-dots {
    padding: 1rem;
    margin: auto;
    justify-content: center;
  }

  .no-results-text {
    padding: 1rem;
    text-align: center;
    color: ${COLORS.GRAY.G4};
  }
`;
