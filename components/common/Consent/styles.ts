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
    ${getFontDetailsByLabel(FONTS.PARAGRAPH_REGULAR)}
    padding-right: 0.75rem;
  }
`;

export const PopupButtonsContainer = styled.div`
  display: grid;
  row-gap: 0.75rem;
  padding: 0.75rem 1.5625rem 1rem;
`;

export const BaseButton = styled.button`
  padding: 0.5rem 0;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  display: block;
  min-width: 9.84375rem;
  ${getFontDetailsByLabel(FONTS.BUTTON_SMALL)}

  @media (max-width: 768px) {
    padding: 0.5rem 0;
    svg {
      width: 0.7rem;
      height: 0.7rem;
    }
  }
`;

export const ActionButton = styled(BaseButton)`
  background-color: ${COLORS.BRAND.PURPS};
  color: ${COLORS.BRAND.WHITE};
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

export const CancelButton = styled(BaseButton)`
  cursor: pointer;
  text-align: center;
  ${getFontDetailsByLabel(FONTS.BUTTON_SMALL)}
  background-color: ${COLORS.BRAND.WHITE};
  border: 1px solid;
  padding: calc(0.5rem - 1px) 0;

  color: ${COLORS.PURPS.LEVEL_3};

  @media (max-width: 768px) {
    padding: calc(0.5rem - 1px) 0;
  }
`;

export const ConsentFixedWrapper = styled.div<{
  $isHidden?: boolean;
}>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 20;
  background: ${COLORS.BRAND.WHITE};
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.12),
    0px -1px 2px 0px rgba(0, 0, 0, 0.08);
  ${({ $isHidden }) => $isHidden && hidden}
  border-top: 1px solid ${COLORS.GRAY.G6};

  @media (max-width: 768px) {
    transform: unset;
  }
`;

export const ConsentContainer = styled.div`
  padding: 1rem 0;
  border-radius: 0.5rem;

  max-width: 75rem;
  margin: auto;
  width: 100%;

  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  column-gap: 2rem;

  transition: visibility 0.3s, opacity 0.3s;

  visibility: visible;
  opacity: 1;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    width: calc(100% - 3rem);
    grid-template-columns: 1fr;
  }
`;

export const ActionContainer = styled.div`
  display: grid;
  column-gap: 0.75rem;
  justify-content: end;
  align-items: center;
  align-content: center;
  grid-auto-flow: column;

  @media (max-width: 768px) {
    display: grid;
    justify-content: unset;
    row-gap: 0.5rem;
    margin-top: 1rem;
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
