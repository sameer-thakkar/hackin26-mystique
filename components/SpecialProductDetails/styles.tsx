import styled from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const SpecialProductDetailsWrapper = styled.div<{
  $isOpeningAnimationComplete: boolean;
}>`
  position: absolute;
  top: 1rem;
  width: calc(100% - 1.5rem);
  left: 0.75rem;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  padding: 0 1.5rem;
  box-sizing: border-box;
  .special-product-header-wrapper {
    display: flex;
    svg {
      width: 1.5rem;
      height: 1.875rem;
    }
    .special-product-header {
      ${expandFontToken(FONTS.HEADING_LARGE)};
      color: #570101;
    }
  }
  .special-product-details-labels {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    .special-product-details-separator {
      height: 0.125rem;
      width: 0.125rem;
      border-radius: 50%;
      background-color: #570101;
    }
    .swiper-wrapper {
      transition-timing-function: linear !important;
    }
    .swiper-slide {
      width: fit-content;
    }
  }
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
    top: 1.25rem;
    padding: 0;
    &::after,
    &::before {
      content: '';
      position: absolute;
      width: 32px;
      height: 44px;
      bottom: 2px;
      z-index: 2;
      ${({ $isOpeningAnimationComplete }) =>
        !$isOpeningAnimationComplete &&
        `
          opacity: 0;
        `}
    }
    &::before {
      left: -1;
      background: linear-gradient(
        90deg,
        #e7ba77 0%,
        rgba(233, 187, 121, 0) 100%
      );
    }
    &::after {
      right: 0;
      background: linear-gradient(
        -90deg,
        #e7ba77 16.15%,
        rgba(233, 187, 121, 0) 100%
      );
    }
    .special-product-header-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      svg {
        width: 1.375rem;
        height: 1.75rem;
      }
      .special-product-header {
        ${expandFontToken(FONTS.HEADING_SMALL)};
      }
    }
    .special-product-details-labels {
      padding: 0.84375rem 0 0.78125rem;
      transform: translateX(-50%);
      ${({ $isOpeningAnimationComplete }) =>
        !$isOpeningAnimationComplete &&
        `
          opacity: 0;
        `}
      .swiper-wrapper {
        align-items: center;
      }
    }
    .special-product-header-separator {
      width: 100%;
      max-width: 15.625rem;
      align-self: center;
      height: 0.0625rem;
      margin: 0.5rem 0 0.1875rem;
      background: linear-gradient(
        270deg,
        rgba(204, 150, 0, 0) 0%,
        #a4563b 32.81%,
        #a4563b 61.46%,
        rgba(204, 150, 0, 0) 100%
      );
    }
  }
`;
