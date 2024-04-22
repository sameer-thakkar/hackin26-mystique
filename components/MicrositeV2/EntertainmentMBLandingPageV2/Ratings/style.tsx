import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const RatingsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  .average-rating {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
    color: ${COLORS.TEXT.CANDY_1};
    margin-left: 0.125rem;
  }

  .count {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    color: ${COLORS.TEXT.CANDY_1};
    margin-left: 0.125rem;
  }
`;
