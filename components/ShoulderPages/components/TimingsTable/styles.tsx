import styled from 'styled-components';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';

export const TableContainer = styled.div<{ isCollapsed?: boolean }>`
  border: 1px solid ${COLORS.GRAY.G6};
  border-radius: 0.5rem;
  overflow: hidden;

  transition: all 0.2s ease-in-out;
  max-height: 30rem;
  overflow: hidden;
  ${({ isCollapsed }) =>
    isCollapsed &&
    `
    max-height: 2.5rem;

    th {
      white-space: nowrap;
      overflow: visible;
      max-width: 5rem;
    }
  `}
`;

export const TableRow = styled.tr<{
  isActive?: boolean;
  isCollapsed?: boolean;
}>`
  &:not(:last-child) {
    border-bottom: 1px solid ${COLORS.GRAY.G6};
  }

  td {
    text-transform: lowercase;
    :first-letter {
      text-transform: uppercase;
    }

    :first-child {
      text-transform: capitalize;
    }

    ${({ isActive }) =>
      isActive &&
      `
      color: ${COLORS.TEXT.PURPS_3};
      ${expandFontToken('UI/Label Regular (Heavy)')}
    `}
  }
`;

export const TableWrapper = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: none;

  thead {
    background-color: ${COLORS.GRAY.G8};
    text-transform: uppercase;
    text-align: left;
    position: relative;

    ${TableRow} {
      border-bottom: 1px solid ${COLORS.GRAY.G6};
    }
  }
`;

export const TableHeaderCell = styled.th`
  ${expandFontToken('Misc/Booster')}
  font-size: 0.75rem;
  padding: 0.25rem 1rem;
  height: 2rem;

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

export const TableCell = styled.td`
  width: 33.33%;
  padding: 0.25rem 1rem;
  height: 2.75rem;
  ${expandFontToken('UI/Label Regular')}
`;

export const LastEntry = styled.p`
  ${expandFontToken('UI/Label XS')}
  color: ${COLORS.GRAY.G4};
  margin: 0.2rem 0 0 0;
`;

export const IconWrapper = styled.div<{
  isOpen: boolean;
}>`
  position: absolute;
  right: 0.2rem;
  top: 0rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${({ isOpen }) =>
    isOpen &&
    `
    transform: rotate(180deg);
    padding-left: 0.25rem;
  `}
  transition: transform 0.2s ease-in-out !important;
  margin-left: auto;
  width: 2.5rem;
  height: 2.5rem;
`;
