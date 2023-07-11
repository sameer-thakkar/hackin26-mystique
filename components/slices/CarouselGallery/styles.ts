import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Heading = styled.div`
  ${expandFontToken(FONTS.HEADING_LARGE)}
  margin-bottom: 1rem;
`;

export const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: grid;
  grid-template-columns: 1fr;

  .swiper,
  .swiper-initialized {
    height: 100%;
  }

  .swiper-slide {
    /* To avoid flickering issue on Safari - https://github.com/nolimits4web/swiper/issues/3527 */
    -webkit-transform: translateZ(0);
    -webkit-backface-visibility: hidden;
  }

  .swiper-pagination {
    bottom: 0.5rem;
    display: flex;
    justify-content: center;
    grid-gap: 0.25rem;
    width: 100%;

    .swiper-pagination-bullet {
      margin: 0;
      opacity: 0.6;
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 50%;
      cursor: pointer;
      z-index: 2;

      &.swiper-pagination-bullet-active {
        opacity: 1;
      }
    }
  }

  @media (min-width: 768px) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  }
`;

export const ImageGallery = styled.div`
  /* Logic to maintain 16:10 aspect ratio of the layout */
  width: 100%;
  position: relative;
  height: 0;
  padding-top: 62.5%;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .swiper,
  .swiper-initialized {
    border-radius: 0.5rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .swiper-pagination {
    bottom: 1rem;
    display: flex;
    justify-content: center;
    grid-gap: 0.25rem;
    width: 100%;

    .swiper-pagination-bullet {
      margin: 0;
      opacity: 0.6;
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 50%;
      cursor: pointer;
      z-index: 2;

      &.swiper-pagination-bullet-active {
        opacity: 1;
      }
    }
  }
  .controls {
    display: flex;
  }
  .controls .btn {
    z-index: 3;
    position: absolute;
    transform: translateY(-50%);
    display: flex;
    cursor: pointer;
    top: 50%;
  }
  .controls .btn svg {
    stroke-width: 1.5px;
    rect {
      display: none;
    }
  }
  .controls .btn-right {
    left: unset;
    right: 0px;
  }
  .controls .btn-left svg {
    transform: rotate(180deg);
  }

  @media (min-width: 768px) {
    .controls .btn {
      transform: scale(1.2);
      top: 45%;
      left: 1rem;
    }
    .controls .btn-right {
      left: unset;
      right: 1rem;
    }
  }
`;

export const Content = styled.div`
  position: relative;
  width: 100%;
  padding-top: 1rem;

  @media (min-width: 768px) {
    padding-top: 0;
  }
`;

export const ContentWrapper = styled.div`
  && {
    height: 100%;
    width: 100%;
    color: ${COLORS.GRAY.G2};

    .active-slide {
      ${expandFontToken(FONTS.UI_LABEL_XS)};
    }
    .heading h3 {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
      margin-bottom: 0rem;
      margin-top: 0rem;
    }
    .content p {
      ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}
      margin-bottom: 0.25rem;
      margin-top: 0rem;
    }
    & .cta {
      cursor: pointer;
      color: ${COLORS.TEXT.CANDY_1};
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    }

    @media (min-width: 768px) {
      .container {
        position: absolute;
        top: 30%;
      }
      margin-left: 2rem;
    }
  }
`;
