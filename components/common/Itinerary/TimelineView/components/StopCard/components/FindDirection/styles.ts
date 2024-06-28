import styled, { css } from 'styled-components';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

const iconOnlyStyles = css`
  background-color: ${COLORS.CANDY.FADED};
  padding: 0.375rem;
  border-radius: 4px;
  transform: translateX(0);
`;

export const Container = styled.a<{
  $iconOnly?: boolean;
  $hoverAnimation?: boolean;
  $variant?: TimelineViewComponentVariant;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: max-content;
  gap: 0.25rem;
  position: relative;

  ${({ $hoverAnimation }) =>
    $hoverAnimation &&
    css`
      &:hover {
        .direction-text {
          svg {
            transform: rotate(-45deg);
          }
        }
      }
    `}

  ${({ $iconOnly }) => $iconOnly && iconOnlyStyles}

  .direction-icon {
    z-index: 1;
  }

  .direction-text {
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;

    color: ${COLORS.BRAND.CANDY};
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}

    svg {
      margin-left: 0.125rem;
      height: 0.75rem;
      width: 0.75rem;

      transition: all 0.3s;

      path {
        stroke: ${COLORS.BRAND.CANDY};
      }
    }
  }

  ${({ $variant }) =>
    $variant === TimelineViewComponentVariant.REDUCED_WIDTH &&
    css`
      .direction-text {
        ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
      }
    `}
`;
