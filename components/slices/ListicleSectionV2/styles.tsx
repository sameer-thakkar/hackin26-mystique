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
