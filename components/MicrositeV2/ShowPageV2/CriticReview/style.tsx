import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CriticReviewWrapper = styled.div`
  padding: 1.5rem;
  background-color: ${COLORS.BACKGROUND.FLOATING_PURPS};
  border-radius: 0.5rem;
  margin-top: 0.75rem;

  ${expandFontToken(FONTS.PARAGRAPH_LARGE)};
  color: ${COLORS.GRAY.G2};
  p {
    margin: 0;
  }
  position: relative;

  svg {
    position: absolute;
    right: 1.5rem;
    top: -0.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};

    svg {
      right: 0.87rem;
    }
  }

  @media (max-width: 370px) {
    padding-top: 1.5rem;
  }
`;

export const ReviewContent = styled.div`
  padding-bottom: 1rem;
  border-image: linear-gradient(
    90deg,
    #e6d1ff 6.3%,
    rgba(230, 209, 255, 0) 89.56%
  );
  border-image-slice: 1;
  border-image-outset: 0;
  border-image-width: 0px 0px 1px;
`;

export const ReviewerDetails = styled.div`
  display: flex;
  align-items: center;
  padding-top: 1rem;
  .reviewer-image {
    width: 2rem;
    height: 2rem;
    border-radius: 2rem;
    margin-right: 0.5rem;
  }
  .name {
    p {
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
      color: ${COLORS.GRAY.G2};
    }
  }

  @media (max-width: 768px) {
    .name {
      p {
        ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
      }
    }
  }
`;
