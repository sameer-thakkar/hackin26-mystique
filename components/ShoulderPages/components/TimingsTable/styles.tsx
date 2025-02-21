import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const TableContainer = styled.div<{
  isCollapsed?: boolean;
  isSubattraction?: boolean;
}>`
  ${({ isSubattraction }) =>
    isSubattraction &&
    `
    border: none !important;


    ${TableRow} td {
      vertical-align: top;
      padding: 0 !important;
      color: ${COLORS.GRAY.G3};
      height: unset;
      padding-bottom: 1rem !important;
    }

    td:not(:first-child) {
      text-align: center;
    }

    @media (min-width: 768px) {
      * {
        border: none !important;
      }
    }

    @media (max-width: 768px) {
      ${TableRow} {
        &:not(:last-child) td {
          padding-bottom: 0.5rem !important;
        }

        &:not(:first-child) td {
          padding-top: 0.5rem !important;
        }
      }

      td:not(:first-child) {
        text-align: left;
      }
    }
  `}
  border: 1px solid ${COLORS.GRAY.G6};
  border-radius: 0.5rem;
  overflow: hidden;

  transition: all 0.3s ease-in-out;
  max-height: 30rem;
  overflow: hidden;
  ${({ isCollapsed }) =>
    isCollapsed
      ? `
      max-height: 2.5rem;

      th {
        white-space: nowrap;
        overflow: visible;
        max-width: 5rem;
      
        &:first-child {
          p {
            &:first-child {
              opacity: 1;
            }
            &:not(:first-child) {
              opacity: 0;
            }
          }
        }
      }
    `
      : `
      th:first-child p {
        &:first-child {
          opacity: 0;
        }
        &:not(:first-child) {
          opacity: 1;
        }
      }
    `}
`;

export const TableHeaderCell = styled.th<{ $isCollapsible?: boolean }>`
  ${expandFontToken(FONTS.MISC_BOOSTER)}
  font-size: 0.75rem;
  padding: 0.25rem 1rem;
  height: 2rem;
  transition: all 0.3s ease-in-out;
  position: relative;

  ${({ $isCollapsible }) => $isCollapsible && `cursor: pointer;`}
  p {
    position: absolute;
    transition: all 0.3s ease-in-out;
    top: 0.075rem;
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;

    p {
      top: 0.25rem;
    }
  }
`;

export const TableRow = styled.tr<{
  isActive?: boolean;
  isCollapsed?: boolean;
}>`
  &:not(:last-child) {
    border-bottom: 1px solid ${COLORS.GRAY.G6};
  }

  ${({ isCollapsed }) =>
    isCollapsed &&
    `${TableHeaderCell}:not(:first-child) {
      opacity: 0;
    }`}

  td {
    text-transform: lowercase;
    &:first-letter {
      text-transform: uppercase;
    }

    &:first-child {
      text-transform: capitalize;
    }

    ${({ isActive }) =>
      isActive &&
      `
      color: ${COLORS.TEXT.PURPS_3} !important;
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
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
    height: 41px;

    ${TableRow} {
      border-bottom: 1px solid ${COLORS.GRAY.G6};
    }
  }
`;

export const TableCell = styled.td`
  width: 33.33%;
  padding: 0.25rem 1rem;
  height: 2.75rem;
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
`;

export const LastEntry = styled.p`
  ${expandFontToken(FONTS.UI_LABEL_XS)}
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
  transition: transform 0.3s ease-in-out !important;
  margin-left: auto;
  width: 2.5rem;
  height: 2.5rem;
`;
