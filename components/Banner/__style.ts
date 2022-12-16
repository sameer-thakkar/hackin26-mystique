import styled from 'styled-components';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

interface IStyledBanner {
  bannerCount: number;
  isMounted: boolean;
  loopedSlides: number;
}

/**
 * Styled components
 */
export const StyledBanner = styled.div<IStyledBanner>`
  display: grid;
  height: 400px;
  width: 100%;
  margin: 1rem auto;
  position: relative;
  margin-bottom: 0.75rem;

  .single-slide {
    margin: 0 auto;
  }

  .image-wrapper {
    background: rgba(34, 34, 34, 0.6);
    z-index: 0;
  }

  .swiper-slide {
    max-height: 400px;
    max-width: ${SIZES.MAX_WIDTH};
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .mb-slide {
    aspect-ratio: 3;
    background: rgba(34, 34, 34, 0.6);
    cursor: pointer;
    position: relative;
  }

  .mb-slide img {
    height: 100%;
    width: 100%;
    min-width: 75rem;
    border-radius: 0.75rem;
    object-fit: cover;
    object-position: 0% 25%;
  }

  .swiper-initialized {
    width: 100%;
  }

  .swiper-wrapper {
    max-width: 100vw;

    @media (min-width: 768px) {
      ${({ isMounted, loopedSlides }) => {
        const slideWidth = parseInt(SIZES.MAX_WIDTH);

        return isMounted
          ? ``
          : `transform: translate(calc(calc(calc(100vw - ${slideWidth}px)/2) - ${
              loopedSlides * slideWidth
            }px), 0)`;
      }}
    }
  }

  .swiper-horizontal
    > .swiper-pagination-bullets
    .swiper-pagination-bullet-active {
    background: ${COLORS.BRAND.WHITE};
    width: 0.75rem;
    height: 0.75rem;

    @media (max-width: 768px) {
      width: 0.5rem;
      height: 0.5rem;
    }
  }

  .swiper-slide {
    transform: scale(0.9);
    transition: all 0.7s ease-in-out;
  }
  .swiper-slide-active {
    transform: scale(1);
  }
  .mb-captions {
    z-index: 1;
    height: 100%;
    width: 100%;
    display: grid;
    place-content: center;
    text-align: center;
  }
  .absolute-position {
    position: absolute;
  }
  .mb-captions .caption h1,
  .mb-captions .caption p {
    ${expandFontToken('Display/Regular')}
    color: #fff;
    max-width: 30vw;
  }
  .mb-captions .mb-caption {
    opacity: 0;
    grid-row: 1;
    grid-column: 1 / 2;
    display: grid;
    align-self: center;
    grid-gap: 14px;
    justify-items: center;
    transition: opacity 0.3s ease-in-out;
    .tag {
      justify-self: center;
    }
  }
  p {
    color: ${COLORS.BRAND.WHITE};
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    margin-top: 0;
    margin-bottom: 12px;
  }
  .mb-captions .df-caption {
    grid-row-gap: 12px;
    h1,
    .h1 {
      margin-top: 0;
      margin-bottom: 16px;
    }
  }
  .mb-captions .df-caption {
    grid-row-gap: 12px;
    h1,
    .h1 {
      margin-top: 0;
      margin-bottom: 16px;
    }
  }
  .mb-captions .mb-caption.active {
    opacity: 1;
  }
  .mb-captions .mb-cta {
    background-color: rgba(0, 0, 0, 0.35);
    border: solid white 1px;
    text-transform: uppercase;
    cursor: pointer;
    padding: 15px 40px;
    justify-self: center;
    color: #fff;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 1.2px;
  }
  .mb-captions .mb-cta:hover {
    background: rgba(0, 0, 0, 0.5);
  }
  .mb-caption a {
    text-decoration: none;
  }
  .overlay-container {
    z-index: 2;
    transform: translateZ(1000);
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0%;
    top: 0;
  }
  @media (max-width: 768px) {
    margin: 1rem 0;
    max-height: 200px;
    .swiper-slide {
      transform: scale(0.95) !important;
      -webkit-transform: scale(0.95);
    }
    .swiper-slide-active {
      transform: scale(1) !important;
      -webkit-transform: scale(1);
    }
    .swiper-slide {
      height: 100%;
      width: 91.7vw;
    }
    .mb-slide {
      aspect-ratio: 16/9;
    }
    .mb-slide img {
      min-width: unset;
    }
    .mb-captions .mb-caption {
      justify-items: left;
      max-width: 85%;
      z-index: 1;
      margin-top: 2.5rem;
      margin-left: 1.125rem;
    }
    .mb-captions {
      text-align: left;
      align-items: end;
      background: unset;
      place-content: center;
      width: max-content;
      .caption h1,
      .caption p {
        ${expandFontToken('Heading/Large')}
        margin: 0;
        max-width: 85vw;
      }
    }
    .mb-captions .df-caption {
      .tag {
        justify-self: left;
      }
      h1,
      .h1 {
        margin-bottom: 12px;
      }
      p {
        margin: 0;
      }
    }
    .mb-captions .non-opaque {
      opacity: 1;
    }
    .overlay-container {
      height: auto;
      bottom: 0;
      z-index: 2;
    }
  }
`;

export const ButtonWrapper = styled.div`
  pointer-events: auto;
  button {
    ${expandFontToken('Button/Big')}
  }
  @media (max-width: 768px) {
    button {
      ${expandFontToken('Button/Small')}
      padding: 7px 12px 9px;
      border-radius: 4px;
    }
  }
`;

export const BannerSubtext = styled.em`
  p {
    display: block;
    text-align: center;
    font-style: italic;
    font-size: 0.875rem;
    color: ${COLORS.GRAY.G4};
    margin: 0 1rem 2.75rem;
    @media (max-width: 768px) {
      font-size: 0.6875rem;
      text-align: left;
      margin: 0 1rem 0.75rem;
    }
  }
`;

export const StyledPlaceHolder = styled.div`
  height: 400px;
  margin: 1rem auto 12px;
  background-color: rgba(0, 0, 0, 0.15);
  max-width: 1200px;
  border-radius: 0.5rem;
  @media (max-width: 768px) {
    border-radius: initial;
    max-height: 200px;
    margin: 1rem 0;
  }
`;
