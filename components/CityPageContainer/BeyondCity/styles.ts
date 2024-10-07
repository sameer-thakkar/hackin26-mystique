import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const BeyondCityContainer = styled.div`
  background: linear-gradient(91.29deg, #241136 3.49%, #26123a 93.86%);
  padding-bottom: 1.3rem;

  .citycards-container {
    margin: auto;
    padding: 1rem 0;
    max-width: ${SIZES.MAX_WIDTH};
  }

  .heading-container {
    margin-bottom: -2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .beyond-city-title {
      ${expandFontToken(FONTS.DISPLAY_REGULAR)};
      color: ${COLORS.BRAND.WHITE};
    }
  }
  .collection-name {
    ${expandFontToken(FONTS.DISPLAY_SMALL)};
    color: ${COLORS.BRAND.WHITE};
    position: absolute;
    bottom: 0;
    padding: 0.75rem;
  }
  .collection-image-container {
    max-width: fit-content;
    position: relative;
    border-radius: 10px;

    background: linear-gradient(
      184.23deg,
      rgba(0, 0, 0, 0) 66.76%,
      #000000 92.25%
    );

    img {
      z-index: -1;
      position: relative;
      border-radius: 10px;
      height: 100%;
      width: 100%;
    }
  }
  .prev-slide {
    top: 11rem;
  }
  .next-slide {
    top: 11rem;
    right: -0.9rem;
  }

  @media (max-width: 768px) {
    .citycards-container {
      margin: 0;

      .heading-container {
        padding-left: 24px;
        margin-bottom: 0;
        .beyond-city-title {
          ${expandFontToken(FONTS.HEADING_LARGE)};
          margin-bottom: 0;
        }
      }
    }

    .collection-image-container {
      max-width: 100%;
      height: 280px;
      border-radius: 8px;
      margin: 0 7px;
    }

    .collection-name {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }
  }
`;

export const MobileContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 24px;
  justify-content: space-between;
  z-index: 1;
  position: relative;
`;

export const AllDayTripsLinkContainer = styled.div`
  .alldaytrips-link {
    padding: 0.2rem 0.6rem 0.5rem 0.6rem;
    color: ${COLORS.BRAND.WHITE};
    border: 1px solid #f8f8f8;
    border-radius: 25px;
  }

  @media (max-width: 768px) {
    margin: 1.5rem 0 1rem 0;
    display: flex;
    justify-content: center;
  }
`;
