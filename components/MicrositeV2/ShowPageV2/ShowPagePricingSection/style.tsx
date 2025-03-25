import styled, { CSSProperties } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ShowPageDateSelectorWrapper = styled.div<{
  $isRedirecting?: boolean;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 24rem;
  border-radius: 1rem;

  margin-left: 10rem;
  background-color: ${COLORS.BRAND.WHITE};
  z-index: 1;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    box-shadow: none;
    z-index: 15;
    background-color: ${COLORS.BRAND.WHITE};
    border-radius: 1rem 1rem 0 0;
  }
`;

export const PricingSection = styled.div`
  overflow: visible;
  background-color: ${COLORS.BRAND.WHITE};
  padding: 1.5rem;
  border: 1px solid #e9e9e9;
  border-radius: 1rem;
  align-items: center;

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }

  p {
    margin: 0;
    ${expandFontToken(FONTS.HEADING_XS)};
    color: ${COLORS.GRAY.G2};
  }

  @media (max-width: 768px) {
    border-radius: 0;
    padding-bottom: 1.5rem;
    position: relative;
    max-height: 50vh;
  }
`;

export const SavePercentElement = styled.span`
  ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
  color: ${COLORS.BRAND.WHITE};
  background-color: ${COLORS.OKAY_GREEN[3]};
  padding: 0.125rem 0.25rem;
  height: max-content;
  border-radius: 0.125rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Pricing = styled.div`
  display: flex;
  flex-direction: column;

  .pricing {
    display: flex;
    flex-direction: column;

    .scratch-price {
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
      .price-starting-from,
      .original-price {
        color: ${COLORS.GRAY.G3};
      }
      .original-price {
        text-decoration: line-through;
      }
    }

    .price {
      ${expandFontToken(FONTS.HEADING_LARGE)};
      font-family: 'halyard-text', sans-serif;
      color: ${COLORS.GRAY.G2};
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      ${SavePercentElement} {
        margin-top: 0.25rem;
        @media (max-width: 768px) {
          margin-top: 0;
        }
      }
    }
  }
`;

export const BuyButtonWrapper = styled.div`
  background-color: ${COLORS.BRAND.WHITE};
  margin-top: 1.5rem;
  position: relative;
  z-index: 1;

  &.withRive {
    padding-top: 48px;
  }

  @media (max-width: 768px) {
    padding: 0.88rem 1.5rem;
    border-radius: 0;
    box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.08);
  }
`;

export const RiveCtaWrapper = styled.div`
  cursor: pointer;
  position: absolute;
  width: 32rem;
  height: 7.5rem;
  transform: translate(-5.5rem, -4.7rem);

  // to handle layout shift breakpoint of pricing section
  @media screen and (max-width: 1367px) {
    width: 29rem;
    height: 7.5rem;
    transform: translate(-5rem, -4.8rem);
  }
`;

export const riveComponentStyles: CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: '100%',
};
