import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  background: ${COLORS.EERIE_BLACK};
  padding: 2rem 0;
  margin-top: 2rem;

  .swiper-wrapper {
    position: relative;
    margin-top: 1.25rem;
    .swiper-slide {
      -webkit-transform: translate3d(0, 0, 0) !important;
      z-index: 1;
    }
    .video-container {
      video {
        height: 13.3125rem;
      }
    }
  }
  .paginator {
    display: flex;
    justify-content: center;
    li {
      margin: 0 0.125rem;
      background-color: ${COLORS.GRAY.G5};
    }
    li[data-active='true'] {
      background-color: ${COLORS.BRAND.WHITE};
    }
  }
`;
export const VideoContainer = styled.div`
  position: relative;
`;

export const LinearGradient = styled.div<{
  position: 'top' | 'bottom';
}>`
  width: 100%;
  position: absolute;
  z-index: 1;
  // https://github.com/nolimits4web/swiper/issues/3527#issuecomment-1341247086
  transform: translateZ(1px);
  background: linear-gradient(
    ${({ position }) => (position === 'top' ? '180deg' : '0deg')},
    #150029 0%,
    rgba(21, 3, 40, 0) 100%
  );
  height: 2rem;
  ${({ position }) => (position === 'top' ? 'top: 0;' : 'bottom:0;')}
`;

export const Container = styled.div`
  width: calc(100% - 5.46vw * 2);
  margin: 0 auto;
  .get-tickets-cta:hover {
    box-shadow: 0px 8px 15px 0px rgba(255, 255, 255, 0.24);
  }
`;

export const TitleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h2 {
    margin: 0;
    color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.HEADING_LARGE)};
  }
  button {
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.2);
    border: 0;
    color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.BUTTON_SMALL)};
  }
`;

export const SlideDescription = styled.div`
  margin-top: 1.125rem;
  padding-bottom: 2rem;
  .description-header {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-bottom: 0.75rem;
    .subcategory {
      color: ${COLORS.GRAY.G8};
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
    }
    .subcategory:after {
      content: ' | ';
    }
    .ratings-and-reviews {
      display: flex;
      align-items: center;
      .rating {
        display: flex;
        align-items: center;
        color: ${COLORS.BRAND.CANDY};
        ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
        svg {
          transform: scale(0.6);
        }
      }
      .review-count {
        color: ${COLORS.GRAY.G8};
        ${expandFontToken(FONTS.SUBHEADING_XS)};
      }
    }
  }
  h3 {
    margin: 0 0 0.5rem 0;
    color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.HEADING_REGULAR)};
  }
  .summary {
    margin: 0;
    color: ${COLORS.GRAY.G7};
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .get-tickets-cta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    margin-top: 1rem;
    color: ${COLORS.GRAY.G2};
    background-color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.BUTTON_SMALL)};
    svg path {
      stroke-width: 1px;
    }
  }
`;
