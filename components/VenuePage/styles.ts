import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const VenuePageContainer = styled.div`
  width: calc(100% - (5.46vw * 2));
  max-width: 1200px;
  margin: 0 auto;
  p {
    margin: 0;
  }

  .breadcrumb-container {
    margin-top: 1.5rem;
    @media (max-width: 768px) {
      display: none;
    }
  }

  .theatre-info {
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    margin-top: 1.5rem;

    @media (min-width: 768px) {
      ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
      max-width: 55.875rem;
      margin-top: 2.5rem;
    }
  }

  .amenities {
    margin-top: 1.5rem;
    margin-bottom: 2.5rem;
    display: grid;
    grid-auto-flow: row;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
    .amenity {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      svg {
        margin-right: 1.5rem;
      }
    }
    @media (min-width: 768px) {
      margin-bottom: 4rem;
      grid-auto-flow: row;
      ${expandFontToken(FONTS.PARAGRAPH_LARGE)}
      grid-template-columns: repeat(auto-fit, minmax(17.875rem, 1fr));

      .amenity {
        margin-bottom: 0.75rem;
      }
    }
  }

  .show-more-cta {
    button {
      display: flex;
      align-items: center;
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
      border: none;
      background: none;
      padding: 0;
      color: ${COLORS.BRAND.CANDY};
      svg {
        path {
          stroke: ${COLORS.BRAND.CANDY};
        }
        margin-left: 0.25rem;
      }
    }
    @media (min-width: 768px) {
      display: none;
    }
  }

  .frequently-asked-questions {
    margin-top: 2.5rem;
    h2 {
      ${expandFontToken(FONTS.HEADING_SMALL)};
    }
    @media (min-width: 768px) {
      h2 {
        ${expandFontToken(FONTS.HEADING_LARGE)}
      }
    }
  }
`;

export const Banner = styled.div<{ url: string }>`
  position: relative;
  min-height: 11.625rem;
  padding-bottom: 0.125rem;
  ${({ url }) => `
        background: linear-gradient(221.23deg, rgba(0, 0, 0, 0) 15.43%, #000000 65.75%), url(${url});
        background-size: cover;

        @media (min-width: 768px){
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 79.17%), url(${url});
          background-size: cover;
          height: 24.56rem;
        }
  `}

  .banner-text {
    width: calc(100% - (5.46vw * 2));
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 5.5rem;
    @media (min-width: 768px) {
      padding-top: 15.1875rem;
    }
    h1 {
      margin: 0;
    }
  }

  .theatre-name {
    ${expandFontToken(FONTS.DISPLAY_SMALL)};
    color: ${COLORS.BRAND.WHITE};

    @media (min-width: 768px) {
      ${expandFontToken(FONTS.DISPLAY_LARGE)};
    }
  }

  .theatre-location-cta {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
    text-decoration: underline;
    margin-top: 0.75rem;
    svg {
      margin-right: 0.625rem;
    }

    @media (min-width: 768px) {
      ${expandFontToken(FONTS.PARAGRAPH_LARGE)}
      margin-top:1.5rem;
    }
  }
`;
