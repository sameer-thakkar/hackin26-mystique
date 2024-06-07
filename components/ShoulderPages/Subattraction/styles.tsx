import { Styles } from 'react-modal';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const PageContainer = styled.main`
  width: 88.56vw;
  margin: 0 auto;
  max-width: 1200px;

  @media (max-width: 768px) {
    width: calc(100vw - 2rem);
  }
`;

export const ModalContent = styled.div`
  position: relative;

  button {
    background: none;
    border: none;
    position: absolute;
    top: 1rem;
    right: 0;
    cursor: pointer;
  }

  h1 {
    ${expandFontToken(FONTS.HEADING_SMALL)}
    margin: 0;
  }

  h2 {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
    color: ${COLORS.GRAY.G3};
    margin: 0 0 0.5rem;
  }

  p {
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
  }

  .divider {
    height: 1px;
    width: calc(100% + 3rem);
    margin: 1rem -1.5rem;
    background-color: ${COLORS.GRAY.G6};
  }
`;

export const modalStyles: (isMobile: boolean) => Styles = (isMobile) => ({
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 99,
    width: '100%',
  },
  content: {
    ...(isMobile && {
      bottom: 0,
    }),
    padding: '1rem 1.5rem 1.5rem',
    height: 'max-content',
    margin: isMobile ? 'auto auto 0' : 'auto',
    boxSizing: 'border-box',
    width: isMobile ? '100%' : 'calc(100% - 5.46vw * 2)',
    backgroundColor: 'white',
    maxWidth: isMobile ? 'unset' : 'min(36rem, 80%)',
    borderRadius: isMobile ? '12px 12px 0 0' : '12px',
    zIndex: 999,
    inset: 0,
    border: 0,
  },
});

export const SwiperWrapper = styled.div`
  width: 100%;
  background-color: #f8f6ff;
  box-sizing: border-box;
  margin-bottom: 3.5rem;

  @media (min-width: 768px) {
    padding: 2rem 1.5rem;
  }

  > .swiper {
    width: calc(100% - (5.46vw * 2));
    height: 100%;
    max-width: 1200px;

    @media (max-width: 768px) {
      width: 100%;
      padding-right: 3rem;
      box-sizing: border-box;
      padding-bottom: 2rem;
    }

    > .swiper-wrapper {
      height: max-content;
      width: 100%;
      transition-timing-function: linear;
      align-items: stretch;

      > .swiper-slide {
        height: auto;
        -webkit-transform: translateZ(0);
        -webkit-backface-visibility: hidden;

        @media (max-width: 768px) {
          :first-child {
            margin-left: 1.5rem;
          }

          :last-child {
            padding-right: 4rem;
          }
        }
      }
    }
  }
`;

export const ProductContainer = styled.div`
  margin: 0 -1.5rem;

  @media (max-width: 1300px) {
    max-width: 25rem;
  }
`;

export const Navigation = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  justify-content: space-between;
  gap: 0.5rem;
  width: calc(100% - (5.46vw * 2));
  max-width: 1200px;
  padding-bottom: 1.5rem;

  @media (max-width: 768px) {
    align-items: end;
    width: 100%;
    padding: 2rem 1.5rem 1.5rem;
    box-sizing: border-box;
  }

  u {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    cursor: pointer;
  }

  a {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
    color: ${COLORS.BRAND.PURPS};
    text-decoration: underline;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const Arrows = styled.div`
  display: flex;
  gap: 0.5rem;
  svg {
    cursor: pointer;
    height: 2rem;
    width: 2rem;
    background-color: white;
    border-radius: 10rem;
  }

  svg:hover {
    fill: ${COLORS.GRAY.G8};
  }

  .disabled {
    cursor: not-allowed;
    :hover {
      fill: white;
    }
  }
`;

export const ParentTicketsTitle = styled.h2`
  ${expandFontToken(FONTS.HEADING_LARGE)};
  color: ${COLORS.GRAY.G1};
  margin: 0;
  @media (max-width: 768px) {
    max-width: 14.375rem;
    font-size: 1.3rem;
    ${expandFontToken(FONTS.HEADING_SMALL)};
    color: ${COLORS.GRAY.G1};
  }
`;
