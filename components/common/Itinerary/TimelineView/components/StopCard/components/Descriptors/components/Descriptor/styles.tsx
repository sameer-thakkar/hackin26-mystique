import styled, { css } from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { DescriptorSize } from '../../types';

export const DescriptorContainer = styled.div<{
  $size?: DescriptorSize;
  $color?: string;
  $bold?: boolean;
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
      stroke: ${({ $color }) => $color};
    }
  }

  .descriptor-text {
    ${({ $size }) =>
      $size === DescriptorSize.SMALL
        ? expandFontToken(FONTS.UI_LABEL_SMALL)
        : expandFontToken(FONTS.UI_LABEL_REGULAR)};
    color: ${({ $color }) => $color};
    margin: 0 !important;
  }

  ${({ $bold, $size }) =>
    $bold &&
    $size === DescriptorSize.SMALL &&
    css`
      .descriptor-text {
        ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
        text-decoration: underline;
        font-weight: 500 !important;
      }
    `}

  ${({ $bold, $size }) =>
    $bold &&
    $size === DescriptorSize.LARGE &&
    css`
      .descriptor-text {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
        text-decoration: underline;
        font-weight: 500 !important;
      }
    `}
`;
