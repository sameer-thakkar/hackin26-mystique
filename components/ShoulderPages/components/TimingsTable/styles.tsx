import styled from 'styled-components';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';

export const TableContainer = styled.div`
  border: 1px solid ${COLORS.GRAY.G6};
  border-radius: 0.5rem;
  overflow: hidden; /* Ensure rounded corners are applied */
`;

export const TableWrapper = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: none;

  thead {
    text-transform: uppercase;
    text-align: left;
  }
`;

export const TableRow = styled.tr<{ isActive?: boolean }>`
  ${({ isActive }) =>
    isActive &&
    `
    td {
      color: ${COLORS.TEXT.PURPS_3};
      ${expandFontToken('UI/Label Regular (Heavy)')}
    }
  `}
  &:not(:last-child) {
    border-bottom: 1px solid ${COLORS.GRAY.G6};
  }

  td {
    text-transform: lowercase;
    :first-letter {
      text-transform: uppercase;
    }
  }
`;

export const TableHeaderCell = styled.th`
  ${expandFontToken('Misc/Booster')}
  background-color: ${COLORS.GRAY.G8};
  padding: 0.25rem 1rem;
  height: 2rem;
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
