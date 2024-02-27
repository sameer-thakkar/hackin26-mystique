import styled, { css } from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const TextContainer = styled.div`
  ${getFontDetailsByLabel(FONTS.PARAGRAPH_MEDIUM)}
  color: ${COLORS.GRAY.G2};
  width: max-content;

  .link-container {
    margin-top: 1rem;
  }

  width: auto;

  @media (max-width: 768px) {
    ${getFontDetailsByLabel(FONTS.PARAGRAPH_MEDIUM)}
    padding-right: 0.75rem;
  }
`;

export const PopupButtonsContainer = styled.div`
  display: grid;
  row-gap: 0.75rem;
  padding: 0.75rem 1.5625rem 1rem;
`;

export const BaseButton = styled.button`
  padding: 0.6875rem 4rem 0.8125rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: block;
  min-width: 12.5rem;
  ${getFontDetailsByLabel(FONTS.BUTTON_MEDIUM)}

  @media (max-width: 768px) {
    padding: 0.5rem 0.625rem 0.6rem 0.75rem;
    svg {
      width: 0.7rem;
      height: 0.7rem;
    }
  }
`;

export const ActionButton = styled(BaseButton)`
  background-color: ${COLORS.PURPS.LEVEL_10};
  color: ${COLORS.BRAND.PURPS};
`;

export const AllowButton = styled(BaseButton)`
  color: ${COLORS.PURPS.LEVEL_10};
  background-color: ${COLORS.BRAND.PURPS};
`;

const hidden = css`
  touch-action: none;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
`;

export const CancelButton = styled.div`
  cursor: pointer;
  text-align: center;
  ${getFontDetailsByLabel(FONTS.HEADING_XS)}

  color: ${COLORS.PURPS.LEVEL_3};
`;

export const ConsentFixedWrapper = styled.div<{
  $isHidden?: boolean;
}>`
  position: fixed;
  bottom: 1.25rem;
  left: 0;
  width: 100%;
  z-index: 20;
  ${({ $isHidden }) => $isHidden && hidden}

  @media (max-width: 768px) {
    border-radius: 0.5rem 0.5rem 0 0;
    max-width: calc(100% - 1rem);
    left: 0.5rem;
    bottom: 1rem;
    transform: unset;
  }
`;

export const ConsentContainer = styled.div`
  padding: 1.125rem 1rem;
  background: ${COLORS.BRAND.WHITE};
  border-radius: 0.5rem;

  max-width: 39.0625rem;
  margin: auto;
  width: calc(100% - 2rem);

  display: grid;
  grid-template-columns: 1fr auto;
  align-items: left;
  column-gap: 2rem;

  transition: visibility 0.3s, opacity 0.3s;

  visibility: visible;
  opacity: 1;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.12),
    0px -1px 2px 0px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ActionContainer = styled.div`
  display: grid;
  column-gap: 0.5rem;
  justify-content: end;
  align-items: start;
  align-content: start;
  row-gap: 0.5rem;

  @media (max-width: 768px) {
    display: grid;
    justify-content: unset;
    row-gap: 0.5rem;
    margin-top: 0.5rem;
    button {
      width: 100%;
    }
  }
`;

export const Mask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 11;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
`;

export const LinksContainer = styled.div`
  display: grid;
  ${getFontDetailsByLabel(FONTS.PARAGRAPH_REGULAR)}
  text-decoration: underline;
  margin: 0.5rem 0;
  a svg path {
    fill: ${COLORS.GRAY.G2};
  }
`;

export const DetailedPopupContainer = styled.div`
  display: grid;
  max-width: 520px;
  max-height: 480px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 24px;
  .consent-heading {
    ${getFontDetailsByLabel(FONTS.HEADING_REGULAR)}
    margin-bottom: .75rem;
  }
  .sub-heading {
    ${getFontDetailsByLabel(FONTS.HEADING_SMALL)}
    margin-bottom: .75rem;
  }
  ul {
    padding-left: 1.2rem;
    margin-top: 0;
    margin-bottom: 0;
  }
  li,
  p {
    ${getFontDetailsByLabel(FONTS.PARAGRAPH_REGULAR)}
  }
  li:not(:first-child) {
    margin-top: 1rem;
  }
  ul ul li:first-child {
    margin-top: 1rem;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar {
    width: 1px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${COLORS.GRAY.G4};
  }
  && a {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    max-height: calc(100dvh - 12.5rem);
    padding: 1rem;
  }
`;

export const HeadingContainer = styled.div`
  display: grid;
  .image-wrap {
    grid-row: 1 / 3;
    grid-column: 2 / 3;
    display: flex;
    justify-content: end;
  }

  @media (max-width: 768px) {
    .image-wrap {
      grid-row: 1;
      grid-column: 1;
      justify-content: unset;
      margin-bottom: 0.75rem;
    }
  }
`;

export const consentDrawerStyles = css`
  && .shadow {
    height: 100%;
  }
  @media (max-width: 768px) {
    height: calc(100vh - (100vh - 100%) - 4rem);
    bottom: 1.6rem;
    .consent-drawer {
      margin: 0 1rem;
      border-radius: 0.75rem;
      height: auto;
    }
  }
`;
