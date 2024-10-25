import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const SinglePointStopCardContainer = styled.div<{
  $isCurrentStop: boolean;
}>`
  min-width: 100%;
  box-sizing: border-box;
  overflow-y: scroll;
  ${({ $isCurrentStop }) => !$isCurrentStop && `height: 0;`}
  .sub-stops-accordion-item {
    box-shadow: 0px 2px 12px 0px #0000000d;
  }
`;

export const StopInfoContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem 1rem 1.5rem 1rem;
  .descriptor-text {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
    margin: 0.25rem 0 0.375rem 0;
  }
`;

export const StopHeadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
  .direction-text {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)}
    width: 5.5rem;
    background-color: ${COLORS.CANDY.FADED};
    padding: 0.375rem 0.5rem;
    border-radius: 4px;
    justify-content: center;
    svg {
      margin-left: 0.25rem;
    }
  }
`;

export const StopTitle = styled.div`
  ${expandFontToken(FONTS.HEADING_REGULAR)};
`;

export const StopDescription = styled.div`
  margin-top: 0.75rem;
  ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}
  color: ${COLORS.GRAY.G3};
  p {
    margin: unset;
  }
`;

export const MediaContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  margin: 0.75rem 0;
`;
