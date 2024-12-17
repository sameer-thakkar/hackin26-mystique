import styled from 'styled-components';
import {
  AllReviewsButton,
  Review,
  ReviewContent,
  ReviewMediaSection,
  ReviewsSection,
  ShowMoreReviewsButton,
  ViewTranslatedContentButton,
} from 'components/MicrositeV2/ShowPageV2/ReviewSection/style';
import { StyledReviewHeader } from 'components/Reviews/Header/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledExternalLinkIcon = styled.span`
  line-height: 0;

  svg path {
    stroke: ${COLORS.BRAND.PURPS};
    stroke-width: 1.5px;
  }
`;

export const StyledReviewSectionTitle = styled.h6`
  ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)}
  color: ${COLORS.GRAY.G2};
  &#review-section-title {
    margin-bottom: 0.125rem;
  }

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.HEADING_SMALL)}
  }
`;

export const StyledReviewSectionContainer = styled.div`
  ${ReviewsSection} {
    padding-bottom: 0;
  }

  @media (min-width: 768px) {
    ${Review} {
      width: 46.5rem;

      ${StyledReviewHeader} {
        .review-header {
          .pfp {
            height: 2.5rem;
            width: 2.5rem;
          }

          .user-details {
            .details {
              .name {
                ${expandFontToken(FONTS.HEADING_XS)};
              }
            }
          }
        }

        .rating {
          margin-top: 10px;
          svg {
            width: 1rem;
            height: 1rem;
            margin-right: 0.12rem;
          }
          .rating-count {
            margin-left: 0.25rem;
            ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
          }
        }
      }

      ${ReviewContent} {
        ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
      }

      ${ViewTranslatedContentButton} {
        ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
      }

      ${ReviewMediaSection} {
        img,
        .image-wrap {
          width: 8.5rem;
          height: 11.5rem;
        }
      }
    }
  }

  @media (max-width: 768px) {
    ${Review} {
      margin-bottom: 1rem;
    }

    ${ReviewMediaSection} {
      width: calc(100% + 2rem);

      .swiper {
        padding-right: 2rem;
      }
      img,
      .image-wrap,
      .swiper-slide {
        width: 6.125rem;
        height: 8.16625rem;
      }
    }
  }

  ${ShowMoreReviewsButton}, ${AllReviewsButton} {
    background: ${COLORS.PURPS.LEVEL_10};
    padding: 0.6875rem 1rem 0.8125rem;
    border-radius: 8px;
    color: ${COLORS.BRAND.PURPS};
    ${expandFontToken(FONTS.BUTTON_MEDIUM)}
    border: none;
    transition: all 0.3s;

    &:hover {
      box-shadow: none;
      background-color: ${COLORS.PURPS.LEVEL_20};
    }

    &:active {
      transform: scale(0.97);
    }

    @media (max-width: 768px) {
      margin-bottom: 1rem;
    }
  }
`;
