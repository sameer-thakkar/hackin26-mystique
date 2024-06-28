import styled, { css } from 'styled-components';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';

export const StyledTimelineViewContainer = styled.div<{
  $variant?: TimelineViewComponentVariant;
}>`
  width: 100%;

  ${({ $variant }) =>
    $variant === TimelineViewComponentVariant.REDUCED_WIDTH &&
    css`
      max-width: 16.25rem;
    `}
`;
