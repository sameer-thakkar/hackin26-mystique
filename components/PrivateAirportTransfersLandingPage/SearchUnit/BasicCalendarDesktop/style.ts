import styled, { css } from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { DropdownContainer } from '../style';

export const CalendarDropdownContainer = styled(DropdownContainer)`
  left: 0;
  padding: 0;

  width: max-content;
  border-radius: 0.5rem;

  border: none;

  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1),
    0px 0px 1px 0px rgba(0, 0, 0, 0.1);

  max-height: initial;
`;

export const HeaderContainer = styled.div`
  background-color: ${COLORS.GRAY.G8};
  padding: 1.25rem 0.75rem 0.75rem 0.75rem;
  border-radius: 12px 12px 0 0;

  text-align: center;
`;

export const MonthSwitcher = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: none;
    border: none;
    padding: 0;

    &:last-child svg {
      transform: rotate(180deg);
    }
  }

  svg {
    cursor: pointer;
    height: 1rem;
    width: 1rem;
    margin-top: 0.2rem;
  }
`;

export const MonthTitle = styled.div`
  ${getFontDetailsByLabel(FONTS.HEADING_SMALL)}
  color: ${COLORS.GRAY.G2};

  margin: 0 auto;
`;

export const WeekdaysWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-column-gap: 0.75rem;
  margin-top: 1rem;
`;

export const WeekDay = styled.div`
  ${getFontDetailsByLabel(FONTS.TABLE_REGULAR_HEAVY)}
  color: ${COLORS.GRAY.G4};
  padding: 0.375rem 0.25rem;
`;

export const DatesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  /* column-gap: 0.75rem; */
  row-gap: 0.75rem;
  padding: 1rem 0.75rem;
`;

export const Day = styled.div<{
  $isBeforeToday: boolean;
  $isToday: boolean;
  $isSelected: boolean;
  $isEmpty: boolean;
}>`
  ${getFontDetailsByLabel(FONTS.TABLE_MEDIUM_HEAVY)}
  color: ${COLORS.GRAY.G3};
  padding: 0.375rem 0;
  width: 3rem;
  text-align: center;
  cursor: ${({ $isBeforeToday }) => ($isBeforeToday ? 'default' : 'pointer')};
  &:hover {
    border-radius: 6px;
    background-color: ${COLORS.GRAY.G7};
  }

  ${({ $isBeforeToday, $isEmpty }) =>
    ($isBeforeToday || $isEmpty) &&
    css`
      &:hover {
        background-color: initial;
      }
      color: ${COLORS.GRAY.G5};
    `}

  ${({ $isToday }) =>
    $isToday &&
    `
    position: relative;
    :: before {
        content: '';
        position: absolute;
        border-radius: 100%;
        background-color: ${COLORS.BRAND.PURPS};
        width: 4px;
        height: 4px;
        top: 80%;
        left: 45%;
    }
	`}

${({ $isSelected }) =>
    $isSelected &&
    `
		border-radius: 4px;
		color: ${COLORS.BRAND.PURPS};	
		background-color: ${COLORS.PURPS.LIGHT_TONE_3};
	 `}
`;
