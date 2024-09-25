import styled from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import { StyledReviewsContainer } from 'components/AirportTransfers/Review/styles';
import { ReviewSectionWrapper } from 'components/MicrositeV2/EntertainmentMBLandingPageV2/style';
import {
  RatingWrapper,
  Review,
  ReviewContent,
  Reviewer,
  ReviewerCountry,
  ReviewerImage,
  ReviewerName,
  ReviewerSubtext,
  ReviewText,
  ReviewTop,
} from 'components/slices/Reviews/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const StyledReviewSectionWrapper = styled(ReviewSectionWrapper)`
  margin-bottom: 4.5rem;
  background: linear-gradient(
    116deg,
    #efebf8 0%,
    #f7f5fe 51.42%,
    #fdf2ff 97.94%
  );
  padding: 3.25rem 0;

  ${Review} {
    background: white;
    border: 1px solid ${COLORS.GRAY.G6};
    min-height: auto;

    ${ReviewContent} {
      padding: 1.25rem 1.5rem;
      margin: 0;
    }

    ${Reviewer} {
      column-gap: 0.5rem;

      ${ReviewerName} {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    ${ReviewTop} {
      column-gap: 1rem;
      grid-template-columns: 1fr auto;
    }

    ${ReviewText} {
      margin-top: 0.75rem;
      margin-bottom: 0;
    }
  }

  ${StyledReviewsContainer} {
    margin: 0 auto;

    box-sizing: border-box;

    h2 {
      padding-left: 0;
      color: ${COLORS.GRAY.G1};
      ${getFontDetailsByLabel(FONTS.DISPLAY_SMALL)}
      // important because underlying styles are using !important (no idea why)
      font-size: 1.875rem !important;
      font-weight: 500 !important;
      line-height: 2.375rem !important; /* 126.667% */
    }

    ${ReviewerSubtext} {
      font-weight: 300;
    }

    .swiper-slide {
      height: auto;
      box-sizing: border-box;
    }

    svg:hover {
      fill: ${COLORS.GRAY.G8};
    }

    svg:last-child:active {
      transform: scale(0.98);
    }
    svg:first-child:active {
      transform: scale(0.98) rotate(180deg);
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem 0;
    margin-block: 2.62rem;
    ${StyledReviewsContainer} {
      padding: 0 1rem;

      h2 {
        ${getFontDetailsByLabel(FONTS.HEADING_LARGE)};
        font-size: 1.5rem !important;
      }

      .swiper {
        padding: 0 1rem;
        margin: 0 -1rem;
        margin-top: 1.5rem;
        overflow-x: hidden;
      }
    }

    ${Review} {
      height: 99.1%; // hack to get around swiper slide being clipped

      & > div {
        margin: 0;
        padding: 1rem 0.75rem;
      }

      ${ReviewContent} {
        padding: 1rem 0.75rem;
        margin: 0;
      }

      ${Reviewer} {
        column-gap: 0.5rem;

        ${ReviewerImage} {
          width: 2.25rem;
          height: 2.25rem;
        }

        ${ReviewerName} {
          ${getFontDetailsByLabel(FONTS.HEADING_XS)}
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        ${ReviewerCountry} {
          width: 0.875rem;
          height: 0.875rem;
          margin-top: 0.125rem;
        }

        ${ReviewerSubtext} {
          ${getFontDetailsByLabel(FONTS.UI_LABEL_SMALL)}
        }
      }

      ${RatingWrapper} {
        svg {
          width: 0.875rem;
          height: 0.875rem;
        }
        svg path {
          fill: ${COLORS.BRAND.CANDY};
        }
      }

      ${ReviewText} {
        font-size: 0.875rem;
        line-height: 1.25rem;
        margin-top: 0.75rem;
        margin-bottom: 0;
      }
    }
  }
`;
