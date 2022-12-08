import styled from 'styled-components';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import { FONTS } from 'const/fonts';

export const StyledBanner = styled.div`
  height: 22.5rem;
  max-width: 75rem;
  width: 100%;
  display: grid;
  margin: 0 auto 2.5rem;
  border-radius: 24px;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    height: 12.5rem;
    margin: 0 0 1.5rem;
    border-radius: 0;
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
    border-radius: 0.75rem;
    object-fit: cover;
    object-position: 0% 25%;
  }

  .single-slide {
    margin: 0 auto;
  }

  .swiper-container {
    z-index: unset;
    position: static;
  }

  .swiper-container-horizontal > .swiper-pagination-bullets {
    left: auto;
    bottom: 3.335%;
    @media (max-width: 768px) {
      bottom: 6%;
    }
  }

  .swiper-container-horizontal
    > .swiper-pagination-bullets
    .swiper-pagination-bullet {
    margin: 0 0 0 0.5rem;
    width: 0.625rem;
    height: 0.625rem;

    @media (max-width: 768px) {
      margin: 0 0 0 0.2706rem;
      width: 0.5rem;
      height: 0.5rem;
    }
  }

  .swiper-container-horizontal
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

  .swiper-pagination {
    display: flex;
    top: 93.335%;
    position: absolute;
    grid-gap: 0;
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
      top: 90%;
      width: fit-content !important;
      right: 16.33px;
      justify-content: flex-start;
    }

    .swiper-pagination-bullet {
      list-style: none;
      background: rgba(255, 255, 255, 0.35);
      display: inline-block;
      width: 0.625rem;
      height: 0.625rem;
      border-radius: 50%;
      cursor: pointer;
      opacity: 1;
    }

    .swiper-pagination-bullet:first-child {
      margin: 0;
    }
  }

  .slide-image {
    object-fit: cover;
    transition: all 0.7s ease-in-out;
  }
`;

export const OverlayWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.6) 40.54%,
    rgba(0, 0, 0, 0) 100%
  );
  position: absolute;
  z-index: 1;

  @media (max-width: 768px) {
    background-image: linear-gradient(
      360deg,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0) 100%
    );
  }
`;

export const OverlayInfoWrapper = styled.div`
  position: absolute;
  bottom: 26.113%;
  left: 6.667%;
  right: 57.5%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: fit-content;

  .banner-heading {
    ${expandFontToken(FONTS.DISPLAY_SMALL)};
    color: ${COLORS.BRAND.WHITE};
    margin: 0;

    @media (max-width: 768px) {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
      color: ${COLORS.BRAND.WHITE};
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    bottom: 6%;
    left: 16px;
    right: 16px;
    top: unset;
  }
`;

export const ButtonWrapper = styled.div`
  pointer-events: auto;
  margin: 1.5rem 0 0;

  button {
    ${expandFontToken(FONTS.BUTTON_MEDIUM)}
    background: ${COLORS.BRAND.WHITE};
    color: ${COLORS.GRAY.G2};
    border-radius: 8px;
    padding: 0.6875rem 1rem 0.8125rem;
  }

  @media (max-width: 768px) {
    margin: 0;
    button {
      ${expandFontToken(FONTS.BUTTON_SMALL)}
      padding: .5rem .75rem;
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

export const RatingsWrapper = styled.div`
  display: flex;
  margin: 0;
  box-sizing: border-box;
  align-items: flex-start;

  svg {
    height: 16px;
    width: 16px;
    margin-top: 0.69rem;
  }

  @media (max-width: 768px) {
    margin-bottom: 1rem;

    svg {
      height: 12px;
      width: 12px;
      margin-top: 0.48rem;
    }
  }
`;

export const AverageRatingWrapper = styled.div`
  color: ${COLORS.BRAND.WHITE};
  ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};
  margin: 0.5rem 0 0 0.25rem;

  @media (max-width: 768px) {
    margin: 0.25rem 0 0 0.0625rem;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
  }
`;

export const RatingCountWrapper = styled.div`
  color: ${COLORS.BRAND.WHITE};
  ${expandFontToken(FONTS.UI_LABEL_LARGE)};
  margin: 0.5rem 0 0 0.25rem;

  @media (max-width: 768px) {
    margin: 0.25rem 0 0 0.1875rem;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
  }
`;
