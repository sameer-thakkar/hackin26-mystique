import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const BannerSection = styled.div`
  background: ${COLORS.BACKGROUND.FLOATING_PURPS};
`;

export const BannerContainer = styled.div`
  width: calc(100% - (5.46vw * 2));
  max-width: ${SIZES.MAX_WIDTH};
  margin: 0 auto;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
    gap: 1.5rem;
  }
`;

export const Heading = styled.h1`
  margin: unset;
  padding: unset;
  ${expandFontToken(FONTS.DISPLAY_REGULAR)}
  color: ${COLORS.TEXT.PURPS_3};

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.DISPLAY_SMALL)}
  }
`;
