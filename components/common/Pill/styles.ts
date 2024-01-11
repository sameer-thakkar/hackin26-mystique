import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const PillContainer = styled.div<{
  $isHighlighted: boolean;
  $isSubCategoryPage: boolean;
  $height?: string;
}>`
  ${({ $height }) => $height && `height: ${$height};`}
  display: flex;
  ${({ $isSubCategoryPage }) => $isSubCategoryPage && `flex-direction: column;`}
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  border-radius: ${({ $isSubCategoryPage }) =>
    $isSubCategoryPage ? '8px' : '120px'};
  border: ${({ $isHighlighted }) =>
    $isHighlighted
      ? `1px solid ${COLORS.BRAND.PURPS}`
      : `1px solid ${COLORS.GRAY.G6}`};
  background: ${({ $isHighlighted }) =>
    $isHighlighted ? COLORS.PURPS.LIGHT_TONE_4 : COLORS.BRAND.WHITE};
  cursor: pointer;

  span {
    color: ${({ $isHighlighted }) =>
      $isHighlighted ? COLORS.BRAND.PURPS : COLORS.GRAY.G2};
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    border-radius: ${({ $isSubCategoryPage }) =>
      $isSubCategoryPage ? '8px' : '33px'};
  }
`;

const CommonIconStyles = css`
  width: 1.25rem;
  height: 1.25rem;

  @media (max-width: 768px) {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

export const AllIcon = styled.span`
  ${CommonIconStyles}
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PillIcon = styled.span<{
  $iconUrl: string | null;
  $isHighlighted: boolean;
}>`
  ${CommonIconStyles}
  mask: ${({ $iconUrl }) => `url("${$iconUrl}") no-repeat center / contain`};
  background: ${({ $isHighlighted }) =>
    $isHighlighted ? COLORS.BRAND.PURPS : COLORS.GRAY.G2};
`;

export const PillLabel = styled.span`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)}
  }
`;
