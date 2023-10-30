import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const CityGuideContainer = styled.div`
  margin: 3rem auto 0;
  max-width: ${SIZES.MAX_WIDTH};
  .heading-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .travel-guide-heading{
      ${expandFontToken(FONTS.DISPLAY_REGULAR)}
    }
    
    .travel-guide-link {
      display: flex;
      ${expandFontToken(FONTS.HEADING_REGULAR)}
      color: ${COLORS.BLACK};
      border: 1px solid ${COLORS.GRAY.G4};
      border-radius: 25px;
      align-items: center;
      padding: 0.2rem 1rem;
      
      .travel-guide-text {
        margin-left: 0.5rem;
      }
    }

    @media (max-width: 768px) {
      .travel-guide-heading{
        ${expandFontToken(FONTS.HEADING_LARGE)};
        margin-bottom: 2rem;
      }  
    }
    
  }

  .travel-guide-description {
    max-width: 40rem;
    margin: 1rem 0 1.5rem 0;
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
    color: ${COLORS.GRAY.G2}
      

  }

  @media (max-width: 768px) {
    margin: 0;
    padding: 1.875rem 1rem;
  }
`;

export const CityGuideItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 23.5%);
  grid-row-gap: 1.5rem;
  grid-column-gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 48%);
    grid-column-gap: 1rem;
  }

  .city-guide-item {
    border: 1px solid ${COLORS.GRAY.G6};
    padding: 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    .item-svg {
      margin-bottom: 0.5rem;
    }

    .item-name {
      ${expandFontToken(FONTS.HEADING_LARGE)};
    }

    .item-line {
      width: 7.25rem;
      height: 0.125rem;
      margin: 0.6rem 0 0.7rem 0;

      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.52) 2.59%,
        rgba(255, 255, 255, 0) 78.97%
      );
      opacity: 0.3;
    }

    .item-description {
      ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    }

    @media (max-width: 768px) {
      padding: 0.8rem;
      border-radius: 8px;
      min-height: 16.5rem;
      height: fit-content;
      .item-name {
        height: 3rem;
        ${expandFontToken(FONTS.HEADING_SMALL)};
      }
      .item-description {
        ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
      }
    }
  }
  @media (min-width: 768px) {
    .city-guide-item:hover {
      border: 1px solid;
      border-image-source: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        #c7c7c7 100%
      );
      box-shadow: 0px 8px 16px rgba(43, 42, 52, 0.08);
    }
  }
`;
