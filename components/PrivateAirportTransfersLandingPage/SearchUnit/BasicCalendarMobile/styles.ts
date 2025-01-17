import styled, { css } from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const CalendarContainer = styled.div`
  flex: 1;
  height: calc(100% - 7rem);
  overflow: hidden;

  * {
    box-sizing: border-box;
  }
`;

export const WeekdaysWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;

  padding: 1rem 0.75rem 0.625rem;

  background-color: ${COLORS.GRAY.G8};

  .weekday {
    ${getFontDetailsByLabel(FONTS.HEADING_SMALL)}
    color: ${COLORS.GRAY.G4};
  }
`;

export const DatesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-column-gap: 0.75rem;
  grid-row-gap: 1.25rem;
  padding: 1rem 0.875rem;
`;

export const MonthsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  height: calc(100% - 1.125rem);

  padding: 0 1.25rem;

  h4 {
    margin-top: 1.25rem;
    margin-bottom: 0;
    ${getFontDetailsByLabel(FONTS.HEADING_SMALL)};
    position: relative;

    &:after {
      content: '';
      position: absolute;
      display: block;
      width: 65%;
      height: 1px;
      bottom: 4px;
      right: 0;
      background-color: ${COLORS.GRAY.G6};
    }
  }

  ${DatesWrapper} {
    padding: 0;
    margin: 1.5rem 0;
  }
`;

export const MonthWrapper = styled.div`
  margin-bottom: 1.5rem;

  border-bottom: 1px solid ${COLORS.GRAY.G6};
`;

export const Day = styled.div<{
  $isBeforeToday: boolean;
  $isToday: boolean;
  $isSelected: boolean;
}>`
  ${getFontDetailsByLabel(FONTS.TABLE_MEDIUM_HEAVY)}
  color: ${COLORS.GRAY.G3};
  padding: 0.375rem 0.25rem;
  text-align: center;
  cursor: ${({ $isBeforeToday }) => ($isBeforeToday ? 'default' : 'pointer')};
  &:hover {
    border-radius: 6px;
    background-color: ${COLORS.GRAY.G7};
  }

  ${({ $isBeforeToday }) =>
    $isBeforeToday &&
    css`
      &:hover {
        background-color: initial;
      }
      color: ${COLORS.GRAY.G5};
    `}

  ${({ $isToday }) =>
    $isToday &&
    css`
      position: relative;
      :: before {
        content: '';
        position: absolute;
        border-radius: 100%;
        background-color: ${COLORS.BRAND.PURPS};
        width: 0.25rem;
        height: 0.25rem;
        top: 80%;
        left: 45%;
      }
    `}

${({ $isSelected }) =>
    $isSelected &&
    css`
      border-radius: 0.375rem;
      color: ${COLORS.BRAND.PURPS};
      background-color: ${COLORS.BACKGROUND.FLOATING_PURPS};
    `}
`;

export const StyledDay = styled(Day)`
  &:hover {
    background-color: ${COLORS.BACKGROUND.FLOATING_PURPS};
  }
`;
