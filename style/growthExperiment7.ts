import { COLORS } from 'const/ui-constants';
import { css } from 'styled-components';

/**
 * Styles to be applied to `Product.tsx > StyledProductCard` to add an image to it
 */
export const productCardImageSupportStyles = (isAmp: boolean) => css`
  .card-img {
    grid-area: card-img;
    width: 258px;
    height: 344px;
    border-radius: 0.5rem;

    img {
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 768px) {
      grid-row-end: initial;
      grid-column: span 2;

      width: calc(100% + ${isAmp ? '2rem' : '1rem'});
      max-height: 158px;
      margin: -22px -16px -0.5rem;

      border-radius: 0.5rem 0.5rem 0 0;

      img {
        border-radius: 0.5rem 0.5rem 0 0;
        background-color: rgba(0, 0, 0, 0.3);
        margin: 0;
      }
    }
  }

  grid-template-rows: min-content min-content 1fr;
  grid-template-columns: auto 1fr auto;
  grid-auto-rows: min-content;
  column-gap: 1.5rem;
`;

export const moreDetailsButtonStyles = (isAmp: boolean) => css`
  margin-top: ${isAmp && '0.4rem'};
  padding: 0.75rem;
  background-color: ${COLORS.GREY.G7};
  margin-top: ${isAmp ? '0.4rem' : '0'};
  grid-area: cta-block;
  grid-column: 1 / 2;
  width: 32vw;
  border-radius: 4px;
  font-weight: 600;
  color: ${COLORS.GREY.G2};
  position: absolute;
  font-size: 0.875rem;
  letter-spacing: 0.6px;
  display: flex;
  justify-content: center;

  line-height: 125%;

  .chevron {
    display: none;
  }
`;

export const ctaBlockMobileStyles = css`
  grid-column: 2;
  margin-top: -1.5rem;
  margin-left: auto;
  width: 42vw;

  .tour-book-now-cta {
    line-height: 125%;
    padding: 0.75rem;
    border-radius: 4px;
    min-width: auto;
    letter-spacing: 0.6px;
    font-size: 0.875rem;
  }
`;

export const boosterStyles = css`
  color: ${COLORS.HEADOUT_CANDY};
  text-transform: uppercase;
  font-weight: 600;

  @media (max-width: 768px) {
    position: absolute;
    margin-top: -2.125rem;
    padding: 5px;
    border-radius: 4px;
  }
`;
