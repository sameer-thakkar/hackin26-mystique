import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledReviewHeader = styled.div`
  margin-bottom: 1rem;

  .review-header {
    display: grid;
    grid-template-areas: 'pfp name' 'pfp date' 'rating rating';
    grid-template-columns: auto 1fr;
    grid-column-gap: 12px;
    width: 100%;

    .pfp {
      grid-area: pfp;
      width: 3rem;
      height: 3rem;
      border-radius: 3rem;
      background-color: ${COLORS.GRAY.G2};

      .image-wrap {
        background: none;
      }

      img {
        border-radius: 3rem;
      }
    }

    .name {
      grid-area: name;
      ${expandFontToken(FONTS.HEADING_SMALL)};
      color: ${COLORS.GRAY.G2};
    }

    .date {
      grid-area: date;
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      color: ${COLORS.GRAY.G3};

      span.verified {
        margin-left: 0.75rem;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: -0.475rem;
          top: 0.5rem;
          height: 4px;
          width: 4px;
          border-radius: 50px;
          background: ${COLORS.GRAY.G3};
        }
      }
    }
  }

  .rating {
    grid-area: rating;
    display: flex;
    align-items: center;
    margin-top: 12px;

    svg {
      width: 1rem;
      height: 1rem;
      margin-right: 0.12rem;
    }
    .rating-count {
      margin-left: 0.25rem;
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
    }
  }

  @media (max-width: 768px) {
    .review-header {
      .user-details {
        .details {
          margin-bottom: 0.35rem;
          .name {
          }
        }
      }
    }
  }
`;
