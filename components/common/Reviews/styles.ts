import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  position: relative;
  margin: 3rem 0;
  z-index: 0;
  overflow-y: hidden;

  .swiper {
    .swiper-wrapper {
      width: 100%;
      .swiper-slide {
        background-color: ${COLORS.BRAND.WHITE};
        border-radius: 8px;
        position: relative;
      }
    }
  }
  &:not(.swiper-initialized) .swiper-wrapper {
    .swiper-slide {
      width: 33%;
      margin-right: 1.5rem;
    }
  }
  .paginator {
    display: flex;
    justify-content: center;
    margin-top: 0.75rem;
    li {
      background-color: #9f9f9f6e;
      margin: 0 0.125rem;
    }
    li[data-active='true'] {
      background-color: ${COLORS.GRAY.G4};
    }
  }

  @media (max-width: 768px) {
    margin: 2rem 0;
    &:not(.swiper-initialized) .swiper-wrapper {
      .swiper-slide {
        width: unset;
        margin-right: 0;
      }
    }
  }
`;

export const TitleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  align-items: center;
  h2 {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)}
  }
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    h2 {
      ${expandFontToken(FONTS.HEADING_LARGE)}
    }
  }
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  .see-all-cta {
    ${expandFontToken(FONTS.BUTTON_SMALL)};
    padding: 0.5rem 0.75rem;
    color: ${COLORS.GRAY.G3};
    border: 1px solid ${COLORS.GRAY.G4};
    border-radius: 4px;
  }
`;
export const NavigationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  svg {
    cursor: pointer;
  }
  svg:hover {
    fill: ${COLORS.GRAY.G8};
  }
`;
