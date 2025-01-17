import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const FiltersContainer = styled.div``;

export const FilterItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.625rem 1rem;
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
  color: ${COLORS.GRAY.G2};
  cursor: pointer;
  ${({ $isActive }) =>
    $isActive &&
    `   pointer-events: none;
        background: ${COLORS.GRAY.G7};
    `}

  span {
    white-space: nowrap;
  }

  &:hover {
    background: ${COLORS.GRAY.G7};
  }
`;
