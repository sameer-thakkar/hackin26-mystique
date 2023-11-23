import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CalendarWrapper = styled.div<{
  close?: boolean;
}>`
  @keyframes openAnimation {
    from {
      scale: 0.9;
    }
    to {
      scale: 1;
    }
  }

  background: ${COLORS.BRAND.WHITE};
  border-radius: 0.8rem;
  box-shadow: 0 0 0.1rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.1);
  border: 1px solid ${COLORS.GRAY.G3};
  display: flex;
  overflow: hidden;
  animation: openAnimation 200ms cubic-bezier(0, 0, 0.3, 1) forwards;
  }};

  @media (max-width: 768px) {
    box-shadow: none;
    border: none;
    height: max-content;
    margin: auto;
  }
`;

export const CalendarContainer = styled.div`
  display: flex;
  @media (max-width: 768px) {
    display: grid;
    padding: 0;
  }
`;

export const TopBar = styled.div<{
  isSecondMonth?: boolean;
  isSingleMonthCalendar?: boolean;
}>`
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid ${COLORS.GRAY.G6};
    padding-top: 1.6rem;
  
      .day-list {
        display: flex;
        margin: 0.75rem 1.746rem 0.75rem 2.188rem;
        ${expandFontToken(FONTS.HEADING_XS)}
  
        .day-wrapper span {
          width: 3.75rem;
          display: inline-flex;
          justify-content: center;
          color: ${COLORS.GRAY.G4};
        }
      }
    }

    @media (max-width: 768px) {
      padding: 1rem 1.25rem 0.5rem;
      border: none;
      background: ${COLORS.GRAY.G8};
      position: sticky;
      top:0;
      z-index: 1;

      .day-list{
        margin: 0;
        justify-content: center;
        ${expandFontToken(FONTS.HEADING_SMALL)}

        .day-wrapper span {
          width: 3rem;
        }
      }
    
      ${({ isSecondMonth }) => isSecondMonth && 'display: none;'}
    }
  `;

export const MonthWrapper = styled.div<{
  isSecondMonth?: boolean;
  slideAnimate?: boolean;
}>`
  display: flex;
  flex-direction: column;

  .calendar-body-wrapper {
    display: flex;
    height: 100%;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      z-index: auto;
      background-color: white;
    }
    to {
      transform: translateX(0);
      background-color: white;
    }
  }

  @media (max-width: 768px) {
    margin: 2rem 1.25rem 0;

    .month-name {
      position: relative;
      margin: 0 0 1.5rem 0.313rem;
      ${expandFontToken(FONTS.HEADING_SMALL)};
      width: 100%;
      overflow: hidden;
    }
    .month-name::after {
      content: '';
      position: absolute;
      bottom: 0.5rem;
      margin-left: 1rem;
      width: 100%;
      border-bottom: 1px solid ${COLORS.GRAY.G6};
    }
  }
`;

export const CalendarBody = styled.div<{
  isSecondMonth?: boolean;
  isSingleMonthCalendar?: boolean;
}>`
  width: 26.25rem;
  box-sizing: content-box;
  padding: 1.625rem 1.775rem 1.5rem 2.225rem;

  @media (max-width: 768px) {
    width: 21rem;
    padding: 0;
  }
`;

export const DateComponentsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;

  > div {
    margin-top: 0.4rem;
  }
`;
export const DateEl = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  width: 3.75rem;
  height: 3.75rem;
  box-shadow: none;

  @media (max-width: 768px) {
    width: 3rem;
    height: 3.625rem;
  }
`;

export const MonthTitle = styled.div<{ isSecondMonth?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;

  .monthName {
    ${expandFontToken(FONTS.HEADING_REGULAR)}
    color: ${COLORS.GRAY.G2};
    text-transform: capitalize;
    margin: 0 4rem 0 3.25rem;

    &.first {
      margin: 0 2.5rem 0 3.25rem;
    }
  }

  .chevron-icon {
    position: absolute;
    cursor: pointer;
    top: 0.5rem;

    &.scroll-left {
      left: 1rem;
      transform: rotate(180deg);
    }

    &.scroll-right {
      right: 1rem;
    }
  }
`;

export const StyledFootNote = styled.div`
  border-top: 1px dashed ${COLORS.GRAY.G6};
  padding: 0.75rem 0 0 1rem;
  margin: 0 2.75rem 1rem;
  color: ${COLORS.GRAY.G3};
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    position: sticky;
    bottom: 0;
    background: ${COLORS.GRAY.G7};
    margin: 0;
    display: flex;
    justify-content: center;
    padding: 0.75rem 1.25rem;
    width: 100vw;
    box-sizing: border-box;
  }
`;
