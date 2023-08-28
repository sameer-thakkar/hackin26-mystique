import styled from 'styled-components';
import { SavedTag } from 'UI/PriceBlock';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Banner = styled.div`
  width: 100%;
  height: 560px;
  text-align: center;

  img {
    width: 100%;
  }

  @media (max-width: 768px) {
    height: 234px;
  }
`;

export const BannerImageWrapper = styled.div`
  width: 100%;
  height: 100%;

  .banner-image-container {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.7s ease;
    -webkit-transition: all 0.7s ease;
    overflow: hidden;
  }

  .is-active {
    opacity: 1;
    z-index: 2;
  }

  .play-button {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    cursor: pointer;
  }
`;

export const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  .video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 1;
    transition: all 0.7s ease;
    -webkit-transition: all 0.7s ease;
  }

  .video-container.is-active {
    opacity: 1;
    z-index: 2;
  }

  div {
    height: 100% !important;
  }
`;

export const BannerImage = styled.div`
  width: 100%;
  height: 100%;

  img {
    object-fit: cover;
  }
`;

export const BannerContent = styled.div`
  margin: -2em auto 3rem;
  position: relative;
  max-width: 1200px;
  z-index: 2;
  background: ${COLORS.BRAND.WHITE};
  padding: 32px 32px 0;
  border-radius: 8px 8px 0px 0px;

  .heading-wrapper {
    border-bottom: 1px solid ${COLORS.GRAY.G6};
    padding-bottom: 32px;
    display: grid;
    grid-template-columns: 70% 30%;
  }

  .top-text-wrapper {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
  }

  h1 {
    ${expandFontToken(FONTS.HEADING_LARGE)}
    margin: 0.5rem 0 1rem;
  }

  .tags-wrapper {
    display: inline-block;
    color: ${COLORS.GRAY.G3};
    background: ${COLORS.GRAY.G7};
    padding: 6px 8px;
    margin: 0 8px 0 0;
    border-radius: 2px;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
  }

  .right-pricing {
    text-align: right;
    display: grid;
    grid-template-areas: 'price cta';
    align-items: center;
  }

  .priceBlockWrapper {
    border-right: 1px solid ${COLORS.GRAY.G6};
    grid-area: price;

    .price-block-from {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
      text-align: left;
      margin-bottom: 0.125rem;
    }
  }

  .tour-price {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.HEADING_REGULAR)}
    display: flex;
    flex-direction: column;
    .prefix {
      text-align: left;
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    }
  }

  .tour-scratch-price {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    text-align: left;
  }

  .buy-button-wrapper {
    margin: 0px 16px;
    display: block;
    width: 12.5rem;
    height: 2.75rem;
    button {
      border: none;
      cursor: pointer;
    }
  }

  .theater-reviews-wrapper {
    ${expandFontToken(FONTS.UI_LABEL_LARGE)}
    margin-top: 1.5rem;
    svg {
      margin-right: 0.5rem;
    }
    .ratings-wrapper {
      svg {
        margin-right: unset;
      }
      ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)}
      margin: 0rem 0.5rem 0rem 1.5rem;
      color: ${COLORS.BRAND.CANDY};
    }


  }

  .details-wrapper {
    display: grid;
    grid-template-columns: auto auto auto auto;
    padding-top: 0.5rem;
    ${expandFontToken(FONTS.UI_LABEL_LARGE)}
    color: ${COLORS.GRAY.G2};

    .individual-wrapper {
      margin-top: 1.5rem;
    }

    svg {
      position: relative;
      top: 0.1rem;
      margin-right: 0.5rem;
    }
  }

  @media (max-width: 768px) {
    margin: -0.5em auto 3rem;
    padding: 24px 16px 0;

    .heading-wrapper {
      grid-template-columns: auto;
      padding-bottom: 1.5rem;
    }

    .right-pricing {
      margin-top: 20px;
      text-align: left;
    }

    .buy-button {
      display: none;
    }

    .details-wrapper {
      grid-template-columns: auto;
      padding-top: 0.5rem;
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)}

      .individual-wrapper {
        margin-top: 1rem;
      }
    }

    h1 {
      ${expandFontToken(FONTS.HEADING_REGULAR)}
      margin: 0.5rem 0 0.5rem;
    }

    .top-text-wrapper {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    }

    .tour-price {
      font-size: 17px;
      line-height: 20px;
    }

    .tour-scratch-price {
      font-size: 12px;
    }

    .price-block-from {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
      margin-bottom: 0.25rem;
    }

    .priceBlockWrapper {
      display: flex;
      justify-content: space-between;
      border: 0;
      padding: 0rem 0rem 1.5rem;
      margin-bottom: 24px;
      border-bottom: 1px solid ${COLORS.GRAY.G6};
    }

    .tags-wrapper {
      margin: 0.375rem 0.313rem 0 0;
    }

    ${SavedTag} {
      font-weight: normal;
      font-size: 10px;
      line-height: 12px;
    }

    .theater-wrapper {
      margin-bottom: 1rem;
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}

      svg {
        margin-right: 0.3rem;
        position: relative;
        top: 0.2rem;
      }
    }

    .ratings-reviews-wrapper {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
    }

    .ratings-wrapper {
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
      color: ${COLORS.BRAND.CANDY};
    }
  }
`;

export const SpecialOfferBooster = styled.div`
  position: absolute;
  top: -16px;
  padding: 6px 8px 7px;
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
  background-color: ${COLORS.BRAND.WHITE};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`;

export const SpecialOfferBoosterMobile = styled.div`
  position: absolute;
  top: 68px;
  left: 16px;
  z-index: 3;
  padding: 4px 6px;
  ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)}
  background-color: ${COLORS.BRAND.WHITE};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
`;
