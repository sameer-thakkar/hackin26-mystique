import styled from 'styled-components';
import COLORS from 'const/colors';

export const PassByCardContainer = styled.div<{ $isCurrentStop: boolean }>`
  min-width: 100%;
  box-sizing: border-box;
  overflow-y: scroll;
  ${({ $isCurrentStop }) => !$isCurrentStop && `height: 0;`}
  padding: 1rem;
  .sub-stops-accordion-container {
    background-color: unset;
  }
  .sub-stops-accordion-item {
    border: 1px solid ${COLORS.GRAY.G6};
  }
`;
