import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const MultiPointsStopCardContainer = styled.div<{
  $isCurrentStop: boolean;
}>`
  min-width: 100%;
  ${({ $isCurrentStop }) => !$isCurrentStop && `height: 0;`}
  .multi-stops-accordion-container {
    background-color: ${COLORS.GRAY.G6};
  }
  .stop-card-container {
    padding-top: 0.75rem;
  }
  .multi-stops-accordion-item {
    padding: 1rem;
    border-radius: unset;
    margin: 0.5rem 0;
    &:first-of-type {
      margin-top: 0;
    }
    &:last-of-type {
      margin-bottom: 0;
    }
    .stop-info-container {
      padding: 0;
    }
  }
`;

export const StopHeader = styled.div``;

export const StopSubTitle = styled.div`
  ${expandFontToken(FONTS.MISC_OVERLINE_LARGE)}
  color: ${COLORS.GRAY.G3};
`;

export const StopTitle = styled.div`
  ${expandFontToken(FONTS.HEADING_SMALL)}
`;
