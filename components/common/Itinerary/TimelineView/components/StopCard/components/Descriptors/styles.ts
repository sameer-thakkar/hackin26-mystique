import styled, { css } from 'styled-components';
import { DescriptorSize } from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors/types';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const DescriptorContainer = styled.div<{
  $size?: DescriptorSize;
}>`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  svg {
    height: ${({ $size }) =>
      $size === DescriptorSize.SMALL ? '0.75rem' : '1rem'};
    width: ${({ $size }) =>
      $size === DescriptorSize.SMALL ? '0.75rem' : '1rem'};

    path {
      stroke: ${COLORS.GRAY.G2};
    }
  }

  .descriptor-text {
    ${({ $size }) =>
      $size === DescriptorSize.SMALL
        ? expandFontToken(FONTS.UI_LABEL_SMALL)
        : expandFontToken(FONTS.UI_LABEL_REGULAR)};
    color: ${COLORS.GRAY.G2};
    margin: 0 !important;
  }
`;

export const Container = styled.div<{
  $variant?: TimelineViewComponentVariant;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.75rem;

  ${DescriptorContainer} {
    position: relative;

    &:not(:last-child) {
      &::after {
        content: '';
        height: 0.25rem;
        width: 0.25rem;
        background: ${COLORS.GRAY.G6};
        position: absolute;
        right: -0.875rem;
        transform: translate(50%, 50%);
        border-radius: 50px;
      }
    }
  }

  ${({ $variant }) =>
    $variant === TimelineViewComponentVariant.REDUCED_WIDTH &&
    css`
      flex-wrap: wrap;
      gap: 0.5rem 1.25rem;

      ${DescriptorContainer} {
        &:not(:last-child) {
          &::after {
            right: -0.65rem;
          }
        }
      }
    `}
`;
