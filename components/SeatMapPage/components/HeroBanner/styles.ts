import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const HeroBannerWrapper = styled.div`
  position: relative;
  background: #150029;
  background: linear-gradient(0deg, #25073f, #140324),
    linear-gradient(180deg, rgba(0, 0, 0, 0) 49.92%, rgb(132 89 174 / 30%) 100%);
  -webkit-transform: translate3d(0, 0, 0);
  margin-bottom: 0.5rem;
  padding-top: 1.5rem;
  min-height: 10rem;

  @media (max-width: 768px) {
    & {
      margin-bottom: 0;
    }
  }
`;

export const HeroBannerContentWrapper = styled.div`
  padding-bottom: 2rem;
  padding-top: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0;
    padding-bottom: 1rem;
  }
`;

export const HeroBannerContent = styled.div`
  width: calc(100% - (5.46vw * 2));
  max-width: 1200px;
  margin: 0 auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  box-sizing: border-box;

  @media (max-width: 768px) {
    overflow: hidden;
    padding: 0;
  }
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
`;

export const ContentTopWrapper = styled.div`
  max-width: 56rem;
  margin-top: 0.75rem !important;
`;

export const BannerDescription = styled.p<{
  showReadMore: boolean;
  isMobile: boolean;
}>`
  color: ${COLORS.GRAY.G7};
  margin: 0;
  margin-top: 6px;
  ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};

  span {
    color: ${COLORS.GRAY.G8};
    text-decoration: underline;
    margin-left: 4px;
    padding: 0;
    transition-behavior: allow-discrete;
    transition: all 0.5s ease;
    font-weight: 400;
  }

  button {
    all: unset;
  }

  span:active {
    color: ${COLORS.GRAY.G7};
  }

  .show-less,
  .read-more {
    display: none;
  }

  @media (max-width: 768px) {
    margin-top: 0.25rem;

    .show-less {
      ${({ showReadMore }) =>
        showReadMore ? 'display: none;' : 'display: inline-block;'}
    }
    .read-more {
      ${({ showReadMore }) =>
        showReadMore ? 'display: inline-block;' : 'display: none;'}
    }
  }
`;

export const BannerHeading = styled.h2`
  color: ${COLORS.BRAND.WHITE};
  margin: 0;
  ${expandFontToken(FONTS.DISPLAY_SMALL)};

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.HEADING_LARGE)};
  }
  }
`;

export const HR = styled.hr`
  border: 0;
  margin: 0.75rem 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.38) 0%,
    rgba(255, 255, 255, 0) 94.08%
  );
`;

export const ContentBottomWrapper = styled.div`
  width: calc(100% - (5.46vw * 2));
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-start;
  flex-wrap: no-wrap;
  scrollbar-width: none;
  box-sizing: border-box;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;

  @media (min-width: 769px) {
    padding: 0;
    width: calc(100% - (5.46vw * 2));
  }

  @media (max-width: 500px) {
    width: 100% !important;
    overflow-x: scroll;
    padding-left: 1rem !important;
  }
`;

export const IconLabel = styled.h3`
  color: ${COLORS.BRAND.WHITE};
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  width: max-content;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;

  svg {
    color: white;
  }
`;

export const IconParent = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  margin-right: 1rem !important;
  width: max-content !important;
  padding: 0 !important;
  gap: 0.375rem;

  .icon {
    margin-right: 0.75rem;
  }

  @media (max-width: 768px) {
    & {
      margin: 0px;
      z-index: -1;
      display: flex;
      align-items: center;
      padding-bottom: 0.25rem;
      gap: 0.125rem;

      .icon {
        margin-right: 0.5rem;
        &,
        svg {
          height: 2.25rem;
          width: 2.25rem;
        }
      }
    }
  }

  @media (min-width: 768px) {
    & {
      box-sizing: border-box;
      min-height: 2.625rem;
    }
  }
`;
