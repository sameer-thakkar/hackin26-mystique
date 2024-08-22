import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CardWrapper = styled.div`
  width: 7.625rem;
  @media (max-width: 768px) {
    width: 6.5rem;
  }
`;

export const ImageWrapper = styled.div`
  width: 7.625rem;
  height: 5.125rem;
  border-radius: 8px;
  background: ${COLORS.GRAY.G8};
  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: ${COLORS.GRAY.G8};
  }
  @media (max-width: 768px) {
    width: 6.5rem;
    height: 3.938rem;
  }
`;

export const CardContent = styled.div`
  padding-top: 0.375rem;
  display: grid;
  gap: 0.125rem;
  .card-title {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
  }
  .card-subtitle {
    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.UI_LABEL_XS)}
  }
  @media (max-width: 768px) {
    .card-title {
      margin-bottom: 0.063rem;
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
    }
  }
`;
