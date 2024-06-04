import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';
import { DescriptorsContainer } from '../ProductCard/Descriptors/style';
import { PricingAndCTASection } from '../ProductCard/style';

export const CardContainer = styled.div<{
  $hasTabsAbove: boolean;
}>`
  padding: 0.75rem 1rem 1rem;
  margin-top: 1.25rem;
  height: max-content;
  background: linear-gradient(180deg, #340067 0%, #5322bc 52%, #8033ce 100%);
  border-radius: 12px;
  box-sizing: border-box;
  z-index: 0;

  h3 {
    ${expandFontToken(FONTS.HEADING_REGULAR)};
    color: white;
    margin: 0 0 0.25rem;
  }

  p {
    color: white;
    margin: 0;
    z-index: 1;
  }

  position: relative;
  overflow: hidden;

  .car-illustration {
    position: absolute;
    top: 50%;

    right: -1rem;

    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;

    left: calc(50% - 11rem);
    top: 8.25rem;
    width: 22rem;
    height: 22rem;
    gap: 0px;
    z-index: 0;

    background: radial-gradient(
      50% 50% at 50% 50%,
      rgba(244, 123, 255, 0.6) 0%,
      rgba(106, 47, 163, 0) 100%
    );
  }

  @media (min-width: 769px) {
    position: sticky;
    top: ${({ $hasTabsAbove }) => ($hasTabsAbove ? '8rem' : '4.8rem')};
    max-width: 17.625rem;
    min-width: 280px;
    margin-top: 0;

    &::after {
      top: 11rem;
    }
  }
`;

export const StyledDescriptorsContainer = styled(DescriptorsContainer)`
  margin-top: 1.25rem;

  gap: 0.75rem;

  z-index: 1;

  .descriptor {
    gap: 0.375rem;

    svg {
      transform: none;
    }
  }

  .descriptor:after {
    margin-left: 0.375rem;
    margin-top: 0.2rem;
    background: #f8f8f8b2;
  }

  .descriptor:last-of-type::after {
    display: none;
  }

  .descriptor-text {
    color: white !important;
  }

  .more-details-btn {
    color: white !important;
    width: 100%;

    z-index: 1;

    svg path {
      stroke: white;
    }
  }

  @media (min-width: 769px) {
    flex-direction: column;
    align-items: unset;

    .circular-separator {
      display: none;
    }

    gap: 0.625rem;
    margin-top: 1rem;

    .descriptor::after {
      display: none !important;
    }

    .more-details-btn {
      margin-top: 0;
    }
  }
`;

export const StyledPricingAndCTASection = styled(PricingAndCTASection)`
  margin-top: 2.625rem;

  z-index: 1;
  position: relative;

  .styled-price-block {
    row-gap: 0.125rem;
  }

  .tour-scratch-price {
    color: rgba(255, 255, 255, 1);
    font-weight: 300;
  }

  .tour-price span {
    color: white;
  }

  button {
    margin-top: 0.75rem;
    width: 100%;
    color: ${COLORS.GRAY.G2};
    background-color: white;
    font-family: ${HALYARD.FONT_STACK};
    letter-spacing: initial;
    font-weight: 500;

    z-index: 1;

    &:hover {
      background-color: ${COLORS.BRAND.WHITE};
    }
  }

  @media (min-width: 769px) {
    .tour-price {
      font-size: 1.125rem;
    }
  }
`;
