import { Styles } from 'react-modal';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div`
  margin-top: 0px;
  position: relative;
  z-index: 4;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: ${COLORS.GRAY.G2};
  background: linear-gradient(
      180deg,
      rgba(233, 238, 255, 0) 0%,
      rgba(235, 218, 255, 0.5) 100%
    ),
    #fff;

  .banner-img {
    width: 36.5rem;
    height: 18.75rem;
    flex-shrink: 0;

    img {
      height: 100%;
      width: 100%;
      border-radius: 20px;
      object-fit: cover;
    }

    @media (max-width: 768px) {
      width: 100% !important;
      height: 12.5rem;
    }
  }
`;

export const Divider = styled.div`
  width: 60%;
  max-width: 22.8rem;
  height: 1px;
  opacity: 0.3;
  background: linear-gradient(90deg, #b9a1a1 3.83%, #fff7f7 82.38%);
`;

export const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 1rem 10%;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem 1.5rem;
  }

  p {
    margin: 0;
  }
  p:first-child {
    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.MISC_BOOSTER)}
    text-transform: uppercase;
    margin-bottom: 0.2rem;
  }
  p:last-child {
    color: #222222;
    ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)}

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  width: 88.56vw;
  margin: 0 auto;
  min-height: 200px;
  max-width: 1200px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  color: ${COLORS.GRAY.G2};

  @media (max-width: 768px) {
    width: calc(100vw - 2.5rem);
    padding: 1rem 0 1.5rem;
    min-height: 180px;
  }
`;

export const TextContainer = styled.div<{ $fullWidth?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  ${({ $fullWidth }) =>
    !$fullWidth &&
    `
    min-width: 40%;
    max-width: 50%;
  `}

  @media (max-width: 768px) {
    max-width: 100%;
  }

  h1 {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    margin: 0;

    @media (max-width: 768px) {
      font-size: 24px;
      line-height: 36px;
    }
  }

  p {
    ${expandFontToken(FONTS.PARAGRAPH_LARGE)}
    margin: 0;

    @media (max-width: 768px) {
      font-size: 15px;
    }
  }

  button {
    ${expandFontToken(FONTS.PARAGRAPH_LARGE)}
    display: inline-block;
    color: ${COLORS.BRAND.PURPS};
    background: none;
    border: none;
    cursor: pointer;
    vertical-align: top;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ModalContent = styled.div`
  position: relative;

  button {
    background: none;
    border: none;
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }

  h1 {
    margin: 0 0 1rem;
    ${expandFontToken(FONTS.HEADING_SMALL)}
  }

  p {
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
  }
`;

export const modalStyles: Styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 99,
  },
  content: {
    padding: '1.5rem',
    height: 'max-content',
    margin: 'auto',
    width: 'calc(100% - 5.46vw * 2)',
    backgroundColor: 'white',
    maxWidth: 'min(36rem, 80%)',
    borderRadius: '12px',
    zIndex: 999,
    inset: 0,
    border: 0,
  },
};
