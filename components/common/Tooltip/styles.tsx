import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const TooltipContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const TooltipSwipeSheet = styled.div<{ topMargin?: boolean }>`
  padding-top: ${({ topMargin }) => topMargin && '1.5rem'};
  position: fixed;
  z-index: 2147583639;
  bottom: 0;
  left: 0;
  width: 100vw;
  background-color: #fff;
  border-radius: 20px 20px 0px 0px;
  box-shadow: 0px 2px 8px 0px #0000001a, 0px 0px 1px 0px #0000001a;
  .swipe-sheet-header {
    padding: 1.5rem 1.5rem 0.75rem;
    display: flex;
    justify-content: space-between;
    ${expandFontToken(FONTS.HEADING_SMALL)}
  }
  hr {
    margin: 0;
    border-color: ${COLORS.GRAY.G6};
    border-top: 0;
    border-width: 1px;
  }
  .swipe-sheet-content {
    padding: 1.5rem;
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}
  }
`;

export const TooltipOverlay = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
  animation-name: fade;
  animation-duration: 0.01s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
  @keyframes fade {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const Content = styled.div`
  padding: 0.75rem 0.875rem;
  border-radius: 0.5rem;
  position: absolute;
  bottom: 100%;
  transform: translateX(-57%);
  transition: opacity 0.1s ease, visibility 0.3s ease 0.2s;
  height: max-content;
  width: max-content;
  max-width: 15.8125rem;
  visibility: hidden;
  opacity: 0;
  background-color: #fff;
  box-shadow: 0px 2px 8px 0px #0000001a, 0px 0px 1px 0px #0000001a;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  user-select: none;
  &:hover {
    opacity: 1;
    visibility: visible;
    user-select: auto;
  }
  .tooltip-heading {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)}
  }
  .tooltip-content {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
  }
`;

export const Trigger = styled.div`
  display: flex;
  cursor: pointer;
  &:hover + .tooltip {
    opacity: 1;
    visibility: visible;
    user-select: auto;
  }
`;

export const CloseIcon = styled.div`
  position: absolute;
  top: 1.75rem;
  right: 1.5rem;
`;

export const ButtonWrapper = styled.div`
  padding: 1rem 1.5rem;
  background: ${COLORS.BRAND.WHITE};
  box-shadow: 0px -2px 12px 0px rgba(84, 84, 84, 0.1);
  width: 100%;
  box-sizing: border-box;
`;
