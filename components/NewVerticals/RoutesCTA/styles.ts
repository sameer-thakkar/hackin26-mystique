import styled, { css } from 'styled-components';
import {
  CoreDrawerText,
  HeadingContainer,
  HeadingText,
  PanelAnchor,
} from 'components/common/Drawer';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.button`
  position: absolute;
  display: grid;
  bottom: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
  padding: 0;
  border-radius: 10px;
  border: 1px solid ${COLORS.BRAND.WHITE}66;
  background-clip: padding-box;
  box-shadow: 0px 4px 4px 0px ${COLORS.BLACK}26;
  transition: bottom ease-in-out 150ms, transform ease-in-out 150ms;
  &:active {
    transform: scale(0.98);
  }
  & > svg {
    border-radius: 10px;
  }

  @media (min-width: 768px) {
    &:hover {
      bottom: 9px;
    }
  }
`;

export const TextIconContainer = styled.span<{ $isMealVariant?: boolean }>`
  position: absolute;
  display: grid;
  grid-gap: 0.125rem;
  align-self: center;
  justify-self: center;
  justify-items: center;
  ${({ $isMealVariant }) => $isMealVariant && 'margin-left: 0.625rem;'}

  .routes-text {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    color: ${({ $isMealVariant }) =>
      $isMealVariant ? COLORS.TEXT.JOY_MUSTARD_3 : COLORS.TEXT.PURPS_3};
    width: ${({ $isMealVariant }) => ($isMealVariant ? '2.813rem' : '3.5rem')};
    word-wrap: break-word;
  }
`;

export const routesDrawerStyles = css`
  height: 90%;
  .route-details-drawer {
    padding: 0;
    grid-row-gap: 0.75rem;
    overflow: hidden;
  }
  .side-drawer {
    ${HeadingContainer} {
      transform: translateX(-100%);
    }
    ${CoreDrawerText} {
      overflow: visible;
    }
  }
  ${CoreDrawerText} {
    overflow: hidden;
    width: 100vw;
  }
  ${PanelAnchor} {
    display: none;
  }
  ${HeadingContainer} {
    grid-template-columns: 1fr auto;
    gap: 0.75rem;
    padding: 1rem 1rem 0;
    position: sticky;
    top: 0;
    z-index: 0;
    background: ${COLORS.BRAND.WHITE};
    border-radius: 20px 20px 0 0;
    transition: transform 0.1s ease-out;
  }
  ${HeadingText} {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all;
    overflow: hidden;
    ${expandFontToken(FONTS.HEADING_REGULAR)}
  }
  .shadow {
    height: 100%;
  }
  .close-icon {
    align-self: start;
    padding: 0.625rem;
    margin-top: 0.25rem;
    border-radius: 4px;
    background: ${COLORS.GRAY.G8};
  }
`;
