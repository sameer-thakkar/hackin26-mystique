import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { RatingsWrapper } from '../Ratings';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.25rem;
  position: relative;
  height: fit-content;
  width: 100%;
  @media (min-width: 768px) {
    border-radius: 0.5rem;
    border: 1px solid ${COLORS.GRAY.G7};
    background: ${COLORS.BRAND.WHITE};
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1),
      0px 0px 1px 0px rgba(0, 0, 0, 0.1);
    height: auto;
  }
`;

export const Container = styled.div<{ isVerticalImageUrlPresent: boolean }>`
  position: relative;
  width: calc(100% - (5.46vw * 2));
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 1.62rem;
  transition: top 0.5s ease;

  h2 {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    color: ${COLORS.BRAND.WHITE};
    margin-bottom: 1.5rem;
    margin-top: 0;
  }

  .pinned-card-image,
  .image-placeholder {
    height: auto;
    width: auto;
    min-height: 260px;
    min-width: 180px;
    display: absolute;
    margin-right: 2rem;
    img,
    svg {
      border-radius: 0.5rem;
      height: 100%;
      text-indent: 100%;
      white-space: nowrap;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      margin-right: 0.75rem;
    }
  }

  @media (min-width: 768px) {
    .pinned-card-image,
    .image-placeholder {
      position: absolute;
      z-index: 123;
    }
  }
  .image-placeholder {
    ${({ isVerticalImageUrlPresent }) =>
      isVerticalImageUrlPresent &&
      `
    position: absolute;
    `}
    top: -3px;
    z-index: 1;
  }

  .mweb-wrapper {
    position: relative;
    background: rgba(255, 255, 255, 0.15);
    z-index: 1;
    border-radius: 4px;
    .show-title {
      margin-top: 0.75rem;
    }
    .pinned-card-image {
      min-height: 162px;
      min-width: 108px;
      img {
        height: 100%;
        text-indent: 100%;
        white-space: nowrap;
        overflow: hidden;
        border-radius: 0.5rem 0 0 0.5rem;
      }
    }

    .count {
      color: rgba(255, 255, 255, 0.8);
    }

    .tour-scratch-price {
      &,
      & span {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  @media (max-width: 768px) {
    margin-top: 1.5rem;
    height: auto;
    padding-bottom: 1.6875rem;

    h2 {
      ${expandFontToken(FONTS.HEADING_LARGE)};
      margin-bottom: 1.25rem;
    }
  }

  @media (min-width: 768px) {
    display: flex;
    background: linear-gradient(
      to bottom,
      #150029 50%,
      ${COLORS.BRAND.WHITE} 50%
    );
    height: 16.25rem;
    align-items: center;
  }

  :hover {
    transform: translateY(-2px);
    transition: 0.2s ease;
    cursor: pointer;
    ${Wrapper} {
      box-shadow: 0px 4px 22px 0px rgba(0, 0, 0, 0.2),
        0px 1px 4px 0px rgba(0, 0, 0, 0.1);
    }
  }
`;

export const ProductDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  padding: 1.5rem 2.25rem 1.5rem 12.75rem;
  width: 100%;
  .left {
    height: 100%;
    width: auto;

    ${RatingsWrapper} {
      .average-rating {
        ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
        margin-right: 2px;
      }
    }

    .count {
      color: rgba(255, 255, 255, 0.8);
    }

    .primary-descriptors {
      display: flex;
      align-items: center;
      grid-column-gap: 0.25rem;
      .descriptor {
        color: ${COLORS.GRAY.G2};
        ${expandFontToken(FONTS.SUBHEADING_XS)};
      }
      svg {
        margin-top: 2px;
      }
    }
    h3 {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
      color: ${COLORS.GRAY.G2};
      margin: 0.375rem 0;
    }

    .tags {
      margin-top: 0.75rem;
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
      color: ${COLORS.OCEAN_BLUE.TERTIARY};
    }

    @media (max-width: 768px) {
      width: 208px;
    }
  }

  .right {
    padding-left: 1.5rem;
    height: 100%;
    max-width: 19.19rem;
    border-left: solid 1px ${COLORS.GRAY.G6};
    .tour-scratch-price {
      &,
      & span {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
        color: ${COLORS.GRAY.G2};
      }
    }

    .tour-price {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
      color: ${COLORS.BRAND.WHITE};
    }
  }

  button {
    margin-top: 1.5rem;
    ${expandFontToken(FONTS.BUTTON_MEDIUM)};
    border-radius: 0.5rem;
    max-width: 262px;
    width: 262px;
    cursor: pointer;
    z-index: 2;
    position: relative;
    @media (max-width: 1100px) {
      width: -webkit-fill-available;
    }
  }

  .price-wrapper {
    display: flex;
    align-items: flex-end;
    .booster {
      padding: 0.125rem 0.5rem;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SecondaryDescriptors = styled.div<{ count: number }>`
  margin-top: 1rem;
  display: grid;

  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  column-gap: 1rem;

  ${({ count }) =>
    count
      ? `
        > :nth-child(-n + ${count / 2}) {
      grid-column: 1;
      }
      > :nth-child(n + ${count / 2 + 1}) {
      grid-column: 2;
      }
    `
      : ``};

  width: 28.25rem;
  .descriptor {
    display: flex;
    align-items: center;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    color: ${COLORS.GRAY.G2};
    margin-bottom: 0.75rem;

    svg {
      margin-right: 0.75rem;
      path {
        stroke: ${COLORS.GRAY.G2};
      }
    }
  }
`;

export const Gradient = styled.div`
  position: absolute;
  width: 110%;
  height: 600px;
  left: -5%;
  bottom: -60px;
  transform: perspective(2000px) rotateX(-30deg) scaleX(1);
  background: linear-gradient(
    180deg,
    rgba(49, 18, 59, 0) 50%,
    rgba(246, 112, 192, 0.2) 87.8%
  );
  filter: blur(6px);
  z-index: 0;
  @media (max-width: 768px) {
    width: 105%;
    left: -3.5%;
  }
`;

export const YourPickHeader = styled.div`
  position: absolute;
  left: 196px;
  top: -8px;
  z-index: 1123;
  width: max-content;
  min-width: 132px;
  height: 28px;
  /* background-image: url('data:image/svg+xml,<svg width="132" height="28" viewBox="0 0 132 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 0L10.7631 6.75H1.23686L6 0Z" fill="%23352F5D"/><path d="M126 0L121.237 6.75H130.763L126 0Z" fill="%23352F5D"/><g clip-path="url(%23clip0_15476_26687)"><path fill-rule="evenodd" clip-rule="evenodd" d="M126 0H6L6.60302 5.25H6.60352L8.47588 20.9475C8.95576 24.9708 12.3678 28 16.4196 28H114.809C118.716 28 122.052 25.1778 122.699 21.3247L125.397 5.25H125.397L126 0Z" fill="url(%23paint0_linear_15476_26687)"/><g filter="url(%23filter0_f_15476_26687)"><rect x="5.19141" y="-16.2402" width="20" height="47.4988" transform="rotate(27.2219 5.19141 -16.2402)" fill="white" fill-opacity="0.15"/></g></g><defs><filter id="filter0_f_15476_26687" x="-28.5361" y="-28.2402" width="63.5127" height="75.3867" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="6" result="effect1_foregroundBlur_15476_26687"/></filter><linearGradient id="paint0_linear_15476_26687" x1="6" y1="3.06251" x2="122.836" y2="12.0555" gradientUnits="userSpaceOnUse"><stop stop-color="%23330066"/><stop offset="1" stop-color="%238000FF"/></linearGradient><clipPath id="clip0_15476_26687"><rect width="120" height="28" fill="white" transform="translate(6)"/></clipPath></defs></svg>'); */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='132' height='28' viewBox='0 0 132 28' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M6 0L10.7631 6.75H1.23686L6 0Z' fill='%23352F5D'/%3e%3cpath d='M126 0L121.237 6.75H130.763L126 0Z' fill='%23352F5D'/%3e%3cg clip-path='url(%23clip0_15476_26687)'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M126 0H6L6.60302 5.25H6.60352L8.47588 20.9475C8.95576 24.9708 12.3678 28 16.4196 28H114.809C118.716 28 122.052 25.1778 122.699 21.3247L125.397 5.25H125.397L126 0Z' fill='url(%23paint0_linear_15476_26687)'/%3e%3cg filter='url(%23filter0_f_15476_26687)'%3e%3crect x='5.19141' y='-16.2402' width='20' height='47.4988' transform='rotate(27.2219 5.19141 -16.2402)' fill='white' fill-opacity='0.15'/%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cfilter id='filter0_f_15476_26687' x='-28.5361' y='-28.2402' width='63.5127' height='75.3867' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3e%3cfeFlood flood-opacity='0' result='BackgroundImageFix'/%3e%3cfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3e%3cfeGaussianBlur stdDeviation='6' result='effect1_foregroundBlur_15476_26687'/%3e%3c/filter%3e%3clinearGradient id='paint0_linear_15476_26687' x1='6' y1='3.06251' x2='122.836' y2='12.0555' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='%23330066'/%3e%3cstop offset='1' stop-color='%238000FF'/%3e%3c/linearGradient%3e%3cclipPath id='clip0_15476_26687'%3e%3crect width='120' height='28' fill='white' transform='translate(6)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e ");
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  .star {
    margin-right: 2px;
    display: flex;
    align-items: center;
  }
  h2 {
    ${expandFontToken(FONTS.HEADING_XS)};
    color: ${COLORS.BRAND.WHITE};
    margin: 0;
  }

  @keyframes shimmer {
    0% {
      left: 0%;

      opacity: 1;
    }
    100% {
      left: 60%;
      opacity: 1;
    }
  }

  ::after {
    opacity: 0;
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 35%;
    height: 100%;
    transform: skew(-30deg);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 1.6s linear;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
