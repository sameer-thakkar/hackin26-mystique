import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledContainer = styled.div`
  margin-top: 3.375rem;
  margin-bottom: 2rem;
  overflow: hidden;

  .header {
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    margin-top: 3.25rem;
    margin-bottom: 0;

    overflow: hidden;

    .header {
      margin: 0 1.5rem;
    }
  }
`;

export const StyledSectionTitle = styled.div`
  ${expandFontToken(FONTS.HEADING_LARGE)};

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.HEADING_REGULAR)};

    margin-bottom: 1.5rem;
  }
`;

export const StyledCarouselContainer = styled.div`
  max-width: 75rem;
  margin: 0 auto;

  .swiper {
    overflow: visible;
    z-index: 1;
  }

  @media (max-width: 768px) {
    margin: 0 1.5rem;
  }
`;

// Card

export const StyledCardContainer = styled.div<{
  $type: string;
}>`
  box-sizing: border-box;

  border-radius: 0.5rem;
  background: ${(props) =>
    props.$type === 'Private'
      ? `linear-gradient(108deg, #306 0%, #7106DC 98.6%)`
      : '#D9B3FF'};

  position: relative;
  padding: 2.625rem 2rem 2.2rem 2rem;

  width: 25.25rem;
  height: 14.25rem;

  display: flex;
  flex-direction: column;

  .illustration {
    position: absolute;
    bottom: 1.25rem;
    right: ${(props) => (props.$type === 'Shared' ? '0' : '1.5rem')};
  }

  @media (max-width: 768px) {
    padding: 2.0625rem 1.25rem 1.25rem 1.25rem;
    aspect-ratio: 1.75;

    width: 20.3125rem;
    height: 11.5625rem;

    .illustration {
      right: ${(props) => (props.$type === 'Shared' ? '0' : '1.25rem')};

      bottom: 1.225rem;

      img {
        width: 7.5rem;
      }
    }
  }
`;

export const TranferTypeTag = styled.div<{
  $type: string;
}>`
  box-sizing: border-box;
  border-radius: 0rem 0rem 0.375rem 0.375rem;
  padding: 0.875rem 0.75rem 0.75rem 0.75rem;

  position: absolute;
  top: 0;

  display: flex;
  align-items: center;
  gap: 0.25rem;

  width: max-content;

  svg {
    width: 1rem;
    height: 1rem;
  }

  ${(props) =>
    props.$type === 'Shared'
      ? `
  background-color: ${COLORS.GRAY.G8};
       
    `
      : `
         background-color: ${COLORS.CANDY.LIGHT_TONE_1};
         color: ${COLORS.BACKGROUND.FADED_CANDY};
        
    `}

  font-size: 0.9375rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.25rem; /* 133.333% */
  letter-spacing: 0.0375rem;
  font-family: 'halyard-display';

  @media (max-width: 768px) {
    padding: 0.875rem 0.75rem 0.75rem 0.75rem;
    font-size: 0.8125rem;
    height: 2.0625rem;
  }
`;

export const StyledTextSection = styled.div<{
  $type: string;
}>`
  max-width: 85%;
  margin: 1.5rem 0 0;

  div,
  p,
  .description {
    color: ${({ $type }) =>
      $type === 'Shared' ? '#3A0570' : COLORS.PURPS.LIGHT_TONE_3};
  }

  .title {
    ${expandFontToken(FONTS.HEADING_LARGE)};
  }

  .description {
    margin-top: 0.25rem;
    margin-bottom: 0;

    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
  }

  .pax-luggage-count {
    margin-top: 1.5rem;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};

    .pax-count {
      margin: 0;

      margin-bottom: 0.8rem;
    }

    .pax-count,
    .luggage-count {
      display: flex;
      align-items: center;
      gap: 0.56rem;
    }

    .pax-count svg {
      width: 0.71488rem;
      height: 0.6875rem;
    }

    .luggage-count svg {
      width: 0.6875rem;
      height: 0.96875rem;
    }

    svg path {
      fill: ${({ $type }) =>
        $type === 'Shared'
          ? COLORS.PURPS.DARK_TONE
          : COLORS.PURPS.LIGHT_TONE_3};
    }
  }

  @media (max-width: 768px) {
    max-width: 70%;
    margin-top: 1.25rem;

    .title {
      ${expandFontToken(FONTS.HEADING_SMALL)};
    }

    .description {
      margin-top: 0.25rem;
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    }

    .pax-luggage-count {
      margin-top: 0.75rem;
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};

      .pax-count {
        margin-bottom: 0.34rem;
      }
    }
  }
`;
