import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div<{ $initialState: boolean }>`
  width: 100%;
  display: grid;
  background: rgba(17, 17, 17, 0.9);
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 5rem);
  .pageview-wrapper {
    display: grid;
    width: 100%;
    padding-bottom: 6rem;
    margin: auto;
    justify-items: center;

    .zoom-wrapper {
      width: 100%;
      ${({ $initialState }) =>
        $initialState
          ? css`
              display: grid;
            `
          : ''}
    }
    .react-pdf__Document {
      display: flex;
      gap: 1.25rem;
      flex-direction: column;
      align-items: center;
    }

    .pdf-img > img {
      height: auto !important;
      width: auto !important;
      position: relative !important;
      max-width: 52.5rem;
    }
  }
  @media (max-width: 768px) {
    height: 100%;
    .pageview-wrapper {
      max-width: 100%;
      .zoom-wrapper {
        overflow: visible;
      }
      .pdf-img > img {
        max-width: 100%;
      }
    }
  }
`;

export const PopupContainer = styled.div<{
  $isPopupActive: boolean;
  $noFilterTabs: boolean;
}>`
  display: ${({ $isPopupActive }) => ($isPopupActive ? 'flex' : 'none')};
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 101;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .header.scrolled {
    background: rgba(17, 17, 17, 0.9);
  }
  .header {
    background: transparent;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    padding: 1.5rem 7.5rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 0;
    z-index: 15;
    .title {
      color: ${COLORS.BRAND.WHITE};
      ${expandFontToken(FONTS.HEADING_LARGE)};
      margin: ${({ $noFilterTabs }) => ($noFilterTabs ? '0' : '0 0 1rem')};
    }
    .close-button {
      display: inline-flex;
      align-items: flex-start;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(0.625rem);
      cursor: pointer;
      border: none;
      height: 2rem;
      width: 2rem;
      padding: 0.5rem;

      path {
        stroke: ${COLORS.BRAND.WHITE};
      }
    }
  }

  .main-content {
    display: flex;
    width: 100vw;
    margin: 0 auto;
  }
  ${Container} {
    padding-top: ${({ $noFilterTabs }) =>
      $noFilterTabs ? '5.75rem' : '8.625rem'};
  }

  @media (max-width: 768px) {
    .header {
      justify-content: space-between;
      width: 100vw;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      .title {
        margin: 1.75rem 1rem;
        ${expandFontToken(FONTS.HEADING_SMALL)};
      }
      .close-button {
        margin: 1.75rem 1rem 0;
        position: absolute;
        top: 0;
        right: 0;
      }
    }

    .main-content {
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
      justify-content: center;
    }
  }
`;

export const ControlBtn = styled.button<{ $isDisabled?: boolean }>`
  background-color: transparent;
  border: none;
  ${expandFontToken(FONTS.UI_LABEL_LARGE)}
  font-size: 20px;
  margin: 0 0.75rem;
  cursor: pointer;
  position: relative;
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  * {
    color: ${COLORS.BRAND.WHITE};
  }

  &:hover {
    background: ${COLORS.BRAND.WHITE}10;
  }
  &:active {
    background: ${COLORS.BRAND.WHITE}20;
  }

  ${({ $isDisabled }) =>
    $isDisabled &&
    css`
      .control-text {
        opacity: 0.5;
      }
      &:hover {
        background: transparent;
      }
    `}

  .tooltiptext {
    visibility: hidden;
    width: max-content;
    background-color: ${COLORS.BRAND.BLACK};
    color: ${COLORS.BRAND.WHITE};
    text-align: center;
    border-radius: 4px;
    padding: 0.25rem;
    position: absolute;
    z-index: 1;
    left: calc(-50% + 0.75rem);
    top: -1.25rem;
    ${expandFontToken(FONTS.UI_LABEL_XS)}
  }
  &:hover {
    .tooltiptext {
      visibility: visible;
    }
  }
`;
export const Controls = styled.div`
  justify-self: center;
  position: absolute;
  bottom: 1.5rem;
  display: flex;
  align-items: center;
  background: rgba(17, 17, 17, 0.9);
  border-radius: 50px;
  padding: 0.625rem 1.5rem;

  .page-number {
    color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.UI_LABEL_LARGE)}
    padding-right: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 0;
    width: 100%;
    justify-content: center;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
    border-radius: unset;
    bottom: -0.063rem;
    .page-number {
      padding: 0;
    }
  }
`;

export const PillsContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
  .swiper-slide {
    width: fit-content;
  }

  @media (max-width: 768px) {
    max-width: unset;
    margin: unset;
    padding-bottom: 1rem;
  }
`;

export const Pill = styled.button<{ $isHighlighted?: boolean }>`
  padding: 0.5rem 0.75rem;
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
  border: 1px solid ${COLORS.BRAND.WHITE};
  border-radius: 33px;
  background: ${({ $isHighlighted }) =>
    $isHighlighted ? COLORS.BRAND.WHITE : COLORS.BLACK};
  color: ${({ $isHighlighted }) =>
    $isHighlighted ? COLORS.BLACK : COLORS.BRAND.WHITE};
  :active {
    transform: scale(0.98);
  }
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)}
  }
`;
