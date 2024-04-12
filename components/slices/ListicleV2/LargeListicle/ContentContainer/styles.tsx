import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const LargeListicleContentWrapper = styled.div<{ isModalOpen: boolean }>`
  display: flex;
  flex-direction: column;
  min-width: 0;

  #title {
    margin: 0 0 0.625rem;
    ${expandFontToken(FONTS.HEADING_LARGE)};
    color: ${COLORS.GRAY.G2};
  }

  .cta-button {
    padding: 0.688rem 1rem 0.813rem;
    color: ${COLORS.BRAND.WHITE};
    background: ${COLORS.BRAND.PURPS};
  }

  .cta-button > a {
    color: ${COLORS.BRAND.WHITE};
  }

  @media (max-width: 768px) {
    min-width: unset;
    margin: 1rem;
    ${({ isModalOpen }) =>
      !isModalOpen
        ? `
        max-height: 350px;
        overflow: hidden;
        position: relative;
        `
        : `
        max-height: unset;
        overflow: unset;
        margin: 1rem 1rem 0;
        `};

    #title {
      ${expandFontToken(FONTS.HEADING_SMALL)};
      color: ${COLORS.GRAY.G1};
      margin-bottom: 0.5rem;
    }
  }
`;

export const TabContainer = styled.div`
  margin: 0 0 1rem;
  display: grid;
`;

export const TabHeadingsWrapper = styled.div`
  position: relative;
  border-bottom: 1px solid ${COLORS.GRAY.G6};

  .swiper .swiper-wrapper .swiper-slide {
    width: unset;
  }

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    ${expandFontToken(FONTS.HEADING_SMALL)};
    color: ${COLORS.GRAY.G1};
    border-bottom: none;
  }
`;

export const TabBox = styled.div<{ isActive: boolean }>`
  cursor: pointer;
  padding-bottom: 0.5rem;
  width: 100%;
  ${expandFontToken(FONTS.HEADING_SMALL)};
  ${({ isActive }) => {
    return (
      isActive &&
      `
    color: ${COLORS.TEXT.PURPS_3};
    border-bottom: 2px solid;
  `
    );
  }}
`;

export const RichTextWrapper = styled.div`
  word-wrap: break-word;
  margin-bottom: 1rem;

  p {
    font-family: halyard-text !important;
    font-size: 15px !important;
    font-style: normal !important;
    font-weight: 300 !important;
    line-height: 24px !important;
    margin: 0 !important;
  }
`;

export const TabsWrapper = styled.div`
  .tab-content-wrapper:last-child > div:last-child {
    margin-bottom: 0.75rem;
  }
`;

export const TabRichContentWrapper = styled.div`
  margin-bottom: 3rem;
  p,
  li {
    font-family: halyard-text !important;
    font-size: 14px !important;
    font-style: normal !important;
    font-weight: 300 !important;
    line-height: 20px !important;
  }
`;

export const SwiperControls = styled.div`
  display: flex;
  align-items: center;
  .prev-slide,
  .next-slide {
    position: absolute;
    pointer-events: none;
    cursor: pointer;
    z-index: 2;
    height: 32px;
    svg {
      fill: ${COLORS.BRAND.WHITE};
      background: linear-gradient(
        180deg,
        ${COLORS.BRAND.WHITE} 25%,
        rgba(255, 255, 255, 0) 100%
      );
      background: -webkit-linear-gradient(
        180deg,
        ${COLORS.BRAND.WHITE} 25%,
        rgba(255, 255, 255, 0) 100%
      );
      circle {
        pointer-events: auto;
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
  .prev-slide {
    left: 0;
    bottom: 10px;
    svg {
      transform: scaleX(-1);
    }
  }
  .next-slide {
    right: 0;
    bottom: 10px;
  }
`;

export const Tab = styled.div<{ isActive: boolean }>`
  cursor: pointer;
  padding-bottom: 0.5rem;
  display: block;
  width: auto;
  border-bottom: 1px solid transparent;
  transform: translateY(1px);
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
  color: ${COLORS.GRAY.G2};

  ${({ isActive }) => {
    return (
      isActive &&
      `
      color: ${COLORS.TEXT.CANDY_1};
      border-color: ${COLORS.TEXT.CANDY_1};
      padding-bottom: .453rem;
      `
    );
  }}
`;

export const RichContentWrapper = styled.div`
  max-width: 894px;
  p,
  li {
    font-family: halyard-text !important;
    font-size: 15px !important;
    font-style: normal !important;
    font-weight: 300 !important;
    line-height: 24px !important;
  }
`;
