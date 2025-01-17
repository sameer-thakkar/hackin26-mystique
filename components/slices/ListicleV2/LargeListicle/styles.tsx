import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const Title = styled.div`
  color: ${COLORS.GRAY.G2};
  ${expandFontToken(FONTS.HEADING_LARGE)};
  margin-bottom: 2.063rem;
`;

export const ListicleSectionWrapper = styled.div`
  margin: 0 auto;
  max-width: ${SIZES.MAX_WIDTH};
`;

export const LargeListicleWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  &:not(:last-child) {
    margin-bottom: 1.25rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: unset;
  }
`;
