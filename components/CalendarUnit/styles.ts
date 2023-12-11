import styled from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CalendarUnitWrapper = styled.div`
  scroll-behavior: smooth;
  margin-top: 4.5rem;
  @media (max-width: 768px) {
    margin-top: 4rem;
  }
`;

export const Heading = styled.h2`
  ${expandFontToken(FONTS.DISPLAY_REGULAR)}
  margin:0;

  @media (max-width: 768px) {
    padding-left: 1.5rem;
    ${expandFontToken(FONTS.HEADING_LARGE)};
  }
`;

export const CalendarGrid = styled.div`
  scroll-behavior: smooth;
  display: flex;
  gap: 1rem;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 2rem;
  a {
    padding: 0;
  }

  @media (max-width: 768px) {
    margin-top: 1.25rem;
    flex-wrap: nowrap;
    overflow-x: scroll;
    scrollbar-width: none;
    gap: 0.75rem;
    ::-webkit-scrollbar {
      display: none;
    }
    a {
      & :last-child {
        padding-right: 1.5rem;
      }
      & :first-child {
        padding-left: 1.5rem;
      }
    }
  }
`;

export const Calendar = styled.div`
  svg {
    cursor: pointer;
    text {
      ${expandFontToken(FONTS.HEADING_LARGE)}
    }
  }
  .hovered-month {
    box-shadow: 0px 8px 15px 0px #8000ff4d;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    svg {
      text {
        ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
      }
    }
    .month-wrapper {
      height: 4.5rem;
    }
    .hovered-month {
      box-shadow: none;
      border-radius: 8px;
    }
  }
`;
