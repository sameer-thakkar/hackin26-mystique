import styled from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const CityGuideStylesOverrides = styled.div`
  .travel-guide-heading {
    color: ${COLORS.GRAY.G1};
  }

  @media (min-width: 769px) {
    .heading-wrapper .travel-guide-heading {
      ${getFontDetailsByLabel(FONTS.DISPLAY_SMALL)}
    }

    .travel-guide-text {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 768px) {
    .heading-wrapper .travel-guide-heading {
      margin-bottom: 1.5rem;
    }
  }
`;

export const FAQSectionWrapper = styled.div`
  max-width: 75rem;
  margin-inline: auto;
  margin-top: 5rem;
  margin-bottom: 4rem;

  h2 {
    ${getFontDetailsByLabel(FONTS.DISPLAY_SMALL)}
    color: ${COLORS.GRAY.G1};
  }

  p {
    ${getFontDetailsByLabel(FONTS.PARAGRAPH_MEDIUM)}
  }

  @media (max-width: 768px) {
    margin-inline: 1rem;
    margin-top: 0.745rem;
    margin-bottom: 2.62rem;

    h2 {
      ${getFontDetailsByLabel(FONTS.HEADING_LARGE)}
      font-weight: 500;
    }
  }
`;
