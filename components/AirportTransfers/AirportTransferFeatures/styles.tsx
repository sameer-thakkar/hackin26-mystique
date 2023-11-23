import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledGradientContainer = styled.div`
  background: linear-gradient(
    180deg,
    rgba(243, 233, 255, 0.06) 0%,
    #f3e9ff 100%
  );

  display: flex;
  flex-direction: column;

  padding: 4rem 0;

  overflow: hidden;

  .swiper-container {
    max-width: 75rem;
    margin: 0 auto;
  }

  .swiper {
    margin-top: 2rem;
    z-index: 1;
    overflow: visible;
  }

  .swiper-pagination {
    display: none;
  }

  @media (max-width: 768px) {
    margin: 0;
    padding: 4rem 1.5rem;

    position: relative;

    .swiper-container {
      max-width: 100%;
      margin: 0;
    }

    .swiper {
      overflow: unset;
      margin-top: 0;
      padding-top: 4rem;
      max-height: 14rem;

      .swiper-slide {
        transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
          transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .swiper-slide-active {
        opacity: 1;
      }

      .swiper-slide-next,
      .swiper-slide-prev,
      .swiper-slide-duplicate-prev,
      .swiper-slide-duplicate-next {
        opacity: 0.5;
      }

      .swiper-slide {
        transform: rotate(180deg);
      }

      .swiper-slide-active {
        opacity: 1;
      }

      .swiper-pagination {
        display: flex;
        bottom: -0.5rem;
        top: auto;
        right: unset;
        left: 28%;

        .swiper-pagination-bullet {
          width: 1.9375rem;
          height: 0.1875rem;
          border-radius: 0.125rem;
          background: ${COLORS.GRAY.G5};
          margin-right: 0.25rem;
        }

        .swiper-pagination-bullet-active {
          background: ${COLORS.BRAND.PURPS};
        }
      }
    }
  }
`;

export const StyledHeaderSection = styled.div`
  width: 100%;
  max-width: 75rem;
  margin: 0 auto;

  display: grid;
  grid-template-columns: auto auto;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;

  .carousel-controls {
    svg {
      cursor: pointer;
      width: 2.25rem;
      height: 2.25rem;

      &.disabled {
        opacity: 0.5;
      }
    }

    svg:first-child {
      margin-right: 0.5rem;
      transform: rotate(180deg);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-auto-flow: row;
    width: auto;

    .section-description {
      max-width: 69%;
    }

    .carousel-controls {
      display: none;
    }
  }
`;

export const StyledSectionTitle = styled.h2`
  ${expandFontToken(FONTS.HEADING_LARGE)};
  margin: 0;

  @media (max-width: 768px) {
    max-width: 69%;

    ${expandFontToken(FONTS.HEADING_REGULAR)};
  }
`;

export const StyledCardContainer = styled.div`
  box-sizing: border-box;
  border-radius: 0.5rem;
  background-color: white;
  padding: 2.5rem 2rem;

  width: 23.75rem;
  min-height: 11.875rem;

  margin-right: 1rem;

  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: max-content max-content;
  grid-column-gap: 0.75rem;
  grid-row-gap: 0.6rem;
  svg {
    grid-row: span 2;
    width: 1.5rem;
    height: 1.5rem;

    path {
      stroke: ${COLORS.BRAND.PURPS};
    }
  }
  user-select: none;

  .title {
    ${expandFontToken(FONTS.HEADING_REGULAR)};
    color: ${COLORS.TEXT.PURPS_3};
  }

  .description {
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
  }

  p {
    margin: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    margin: 0;

    padding: 2rem;

    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;

    border-radius: 0.5rem;
    background: var(
      --Card-Grad,
      linear-gradient(275deg, #5200a4 -30.88%, #8530da 95.83%)
    );

    .title {
      color: ${COLORS.GRAY.G7};
      ${expandFontToken(FONTS.HEADING_SMALL)};
    }

    .description {
      color: ${COLORS.GRAY.G7};
    }

    svg {
      path {
        stroke: ${COLORS.GRAY.G7};
      }
    }
  }
`;
