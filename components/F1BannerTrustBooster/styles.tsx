import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const F1BannerTrustBoosterContainer = styled.div`
  margin: 3.5rem auto -1.125rem;
  max-width: 75rem;

  @media (max-width: 768px) {
    margin: 2rem auto -1.125rem;
  }
`;

export const BannerTrustBoosterBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.375rem;

  @media (max-width: 768px) {
    margin: 1.5rem 0 0.375rem 1.5rem;
  }
`;

export const BannerTrustBoosterTextBox = styled.div`
  display: flex;
  margin-bottom: 0;
  align-items: center;
`;

export const BannerTrustBoosterHeadingBox = styled.div`
  display: flex;
  margin: 0.363rem 0 0.5rem 0.275rem;
  ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
  color: ${COLORS.GRAY.G2};
`;
