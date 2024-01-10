import styled from 'styled-components';
import { LoaderWrapper } from 'components/common/Loader';
import { TwoPartTimeSlot } from 'components/MicrositeV2/LttShowPageV2/ShowPageDateSelector/style';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const BaseCalendarContainer = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  z-index: 2;
  background: white;
  width: max-content;
  max-height: initial;
  overflow-y: auto;
  overflow-x: hidden;

  border-radius: 1.2rem;

  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1),
    0px 0px 1px 0px rgba(0, 0, 0, 0.1);

  ::-webkit-scrollbar-track {
    background-color: ${COLORS.GRAY.G7};
  }

  ::-webkit-scrollbar {
    width: 0.6rem;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${COLORS.GRAY.G5};
    border-radius: 0.4rem;
  }

  @media (max-width: 768px) {
    height: 90vh;
    width: 100vw;
    border-radius: 1.2rem 1.2rem 0 0;
    /* transition: bottom 0.3s ease;

    ${({ isOpen }) =>
      isOpen
        ? `

bottom: 0;
    `
        : `
      bottom: -1000px;
    `}
 */
  }
`;

export const CalendarContentWrapper = styled.div`
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
    overflow: scroll;
    height: -webkit-fill-available;
    height: -moz-available;
    height: fill-available;
  }
`;
export const FootNote = styled.div<{ $isTimeSlotSectionVisible: boolean }>`
  display: flex;
  ${expandFontToken(FONTS.SUBHEADING_XS)};
  color: ${COLORS.GRAY.G3};
  padding: 0.75rem 1.56rem 1rem 0;
  ${({ $isTimeSlotSectionVisible }) =>
    $isTimeSlotSectionVisible &&
    `
      width: 26rem;  
      border-right: solid 1px ${COLORS.GRAY.G6};
      `};
  border-top: dotted 1px ${COLORS.GRAY.G6};
  margin: 0 2.19rem;

  @media (max-width: 768px) {
    display: block;
    ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
    color: ${COLORS.GRAY.G4};
    background-color: ${COLORS.GRAY.G7};
    padding: 1rem 0;
    margin: 0;
    text-align: center;
    width: 100%;
  }
`;
export const HeaderContainer = styled.div<{ $isSecondMonth: boolean }>`
  background-color: ${COLORS.BRAND.WHITE};

  padding: ${({ $isSecondMonth }) =>
    $isSecondMonth
      ? '1rem 1.25rem 0.75rem 1.825rem'
      : '1rem 1.28rem 0.75rem 1.25rem'};
  text-align: center;

  border-radius: 1.2rem 1.2rem 0 0;
  border-bottom: solid 1px ${COLORS.GRAY.G6};

  @media (max-width: 768px) {
    padding: 2rem 1.5rem 1.5rem;
    border: none;
  }
`;

export const MonthSwitcher = styled.div<{ $isSecondMonth: boolean }>`
  display: flex;

  justify-content: ${({ $isSecondMonth }) =>
    $isSecondMonth ? 'space-between' : 'flex-start'};
  align-items: center;

  svg {
    cursor: pointer;
    height: 1rem;
    width: 1rem;
  }
  button :last-child {
    margin-right: 1rem;
    svg {
      transform: rotate(180deg);
    }
  }
`;

export const MonthSwitcherButton = styled.button<{ $hide: boolean }>`
  border: none;
  padding: 0;
  background-color: ${COLORS.BRAND.WHITE};
  height: 1rem;
  width: 1rem;
  margin-right: 1rem;
  margin-left: 0;

  ${({ $hide }) =>
    $hide &&
    `
      visibility: hidden;
    `}
`;

export const MonthTitle = styled.div<{ $isSecondMonth: boolean }>`
  ${expandFontToken(FONTS.HEADING_REGULAR)};
  color: ${COLORS.GRAY.G2};
  margin: 0;
  ${({ $isSecondMonth }) => $isSecondMonth && 'margin-left: 1rem'};
  position: relative;
  -webkit-user-select: none;
  user-select: none;
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.HEADING_SMALL)};
    width: 100%;
    text-align: left;
    ::after {
      content: '';
      position: absolute;
      bottom: 0.5rem;
      margin-left: 0.87rem;
      width: 55%;
      border-bottom: 0.0625rem solid rgb(226, 226, 226);
    }
  }
`;

export const WeekdaysWrapper = styled.div<{ $isSecondMonth: boolean }>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-column-gap: 0rem;
  margin-top: 0.75rem;
  ${({ $isSecondMonth }) =>
    $isSecondMonth ? 'margin-right: 0rem' : 'margin-left: 0.94rem'};

  @media (max-width: 768px) {
    margin: 0;
    padding: 1.69rem 1.2rem 1rem;
    background-color: #f5f5f5;
  }
`;

export const WeekDay = styled.div<{ $isSecondMonth: boolean }>`
  ${expandFontToken(FONTS.TABLE_REGULAR_HEAVY)};
  color: ${COLORS.GRAY.G4};
  padding: 0;
  width: 3.75rem;
  text-align: center;
  @media (max-width: 768px) {
    width: 3rem;
    ${expandFontToken(FONTS.HEADING_SMALL)};
  }
`;

export const DatesWrapper = styled.div<{ $isSecondMonth: boolean }>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-column-gap: 0;
  grid-row-gap: 0;
  padding: 1.6rem 1.28rem 1.5rem 2.22rem;
  ${({ $isSecondMonth }) =>
    $isSecondMonth &&
    `
    padding-left: 0rem; 
    margin-left: 1.825rem`};
  width: 26.25rem;

  @media (max-width: 768px) {
    padding: 0 1.2rem;
    width: auto;
    margin-left: 0;
  }
`;
export const PriceForDay = styled.span<{ $isDiscounted?: boolean }>`
  ${expandFontToken(FONTS.MISC_TAG_REGULAR)};
  color: ${COLORS.GRAY.G4};
  max-width: 3rem;
  ${({ $isDiscounted }) =>
    $isDiscounted &&
    `
      border-radius: 2px;
        color: ${COLORS.TEXT.OKAY_GREEN_3};
        background-color: ${COLORS.BACKGROUND.SOOTHING_GREEN};
        padding: 2px;
    `}

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.MISC_BADGE_SMALL)};
  }
`;

export const Day = styled.div<{
  $isBeforeToday: boolean;
  $isSelected: boolean;
  $isAvailable: boolean;
  $isDiscounted: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 3.75rem;
  height: 3.75rem;

  ${expandFontToken(FONTS.TABLE_MEDIUM_HEAVY)};
  color: ${COLORS.GRAY.G3};
  text-align: center;

  cursor: ${({ $isBeforeToday, $isAvailable }) =>
    $isBeforeToday || !$isAvailable ? 'default' : 'pointer'};
  &:hover {
    ${({ $isBeforeToday, $isAvailable }) =>
      !$isBeforeToday &&
      $isAvailable &&
      `
        border-radius: 0.6rem;
        color: ${COLORS.BRAND.PURPS};
        background-color: ${COLORS.BACKGROUND.FLOATING_PURPS};
    `}

    ${PriceForDay} {
      ${({ $isBeforeToday, $isAvailable, $isDiscounted }) =>
        !$isBeforeToday &&
        $isAvailable &&
        `
        color: ${COLORS.BRAND.PURPS};
        background-color: ${
          $isDiscounted ? COLORS.BRAND.WHITE : COLORS.BACKGROUND.FLOATING_PURPS
        };
    `}
    }
  }

  ${({ $isBeforeToday, $isAvailable }) =>
    ($isBeforeToday || !$isAvailable) &&
    `
        :hover {
            background-color: initial;
        }
        color: ${COLORS.GRAY.G5};
    `}

  ${({ $isSelected }) =>
    $isSelected &&
    `
		border-radius: 0.6rem;
		color: ${COLORS.BRAND.PURPS};	
		background-color: ${COLORS.BACKGROUND.FLOATING_PURPS};
	 `}

${PriceForDay} {
    ${({ $isSelected, $isDiscounted }) =>
      $isSelected &&
      `
		color: ${COLORS.BRAND.PURPS};	
		background-color: ${
      $isDiscounted ? COLORS.BRAND.WHITE : COLORS.BACKGROUND.FLOATING_PURPS
    };
	 `}
  }

  @media (max-width: 768px) {
    width: 3rem;
    ${expandFontToken(FONTS.SUBHEADING_LARGE)};
  }
`;

export const PickDate = styled.div`
  ${expandFontToken(FONTS.HEADING_SMALL)};
  color: ${COLORS.GRAY.G2};
  padding: 1rem 1rem 0 1.5rem;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  .back {
    height: 1rem;

    svg {
      height: 1rem;
      width: 1rem;
      margin-bottom: 0.0625rem;
    }
    margin-right: 0.75rem;
  }
`;

export const MwebHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 16;
`;
export const TimeSlotCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 1.25rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${COLORS.GRAY.G6};
  cursor: pointer;

  :hover {
    background: ${COLORS.GRAY.G8};
  }
`;
export const CalendarTimeSlotSection = styled.div`
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  width: 29.75rem;
  box-sizing: border-box;
  border-left: solid 1px ${COLORS.GRAY.G6};
  .selected-date {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
    color: ${COLORS.GRAY.G3};
  }

  .select-time {
    ${expandFontToken(FONTS.HEADING_REGULAR)};
    color: ${COLORS.BLACK};
    margin-top: 0.25rem;
  }

  ${LoaderWrapper} {
    height: 100%;
    width: 100%;

    .loader {
      height: 2rem;
      width: 2rem;
    }
  }
  .timeslot-cards {
    overflow-y: scroll;
    max-height: calc(3.75rem * 7);
    margin-top: 1rem;
    -ms-overflow-style: none;
    scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none;
    }

    ${TimeSlotCard}:first-child {
      margin-top: 0;
    }
  }

  .continue-button {
    width: 23.5rem;
    margin-top: 1.5rem;
  }

  ${TwoPartTimeSlot} {
    margin: 1rem 0 0.5rem;
  }
`;

export const TimingSection = styled.div``;
export const TimeSlot = styled.div`
  ${expandFontToken(FONTS.SUBHEADING_LARGE)};
  color: ${COLORS.GRAY.G2};
`;
export const UrgencyBooster = styled.div`
  ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  color: ${COLORS.GRAY.G2};
  margin-top: 0.25rem;
`;
export const PricingSection = styled.div`
  display: flex;
  align-items: center;
  .pricing {
    display: flex;
    flex-direction: column;

    .cost {
      display: flex;
      .scratch-price {
        ${expandFontToken(FONTS.UI_LABEL_SMALL)};
        color: ${COLORS.GRAY.G4};
        margin-right: 0.06rem;
        text-decoration: line-through;
      }

      .price {
        ${expandFontToken(FONTS.SUBHEADING_LARGE)};
        color: ${COLORS.GRAY.G3};
      }
    }
  }

  svg {
    margin-left: 1rem;
  }
`;

export const Cashback = styled.div`
  ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  color: ${COLORS.TEXT.OKAY_GREEN_3};

  padding: 0.12rem 0.2rem;
  border-radius: 0.125rem;
  background-color: ${COLORS.BACKGROUND.SOOTHING_GREEN};
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CalendarPopup = styled.div<{ $isPopupActive: boolean }>`
  display: ${({ $isPopupActive }) => ($isPopupActive ? 'flex' : 'none')};
  flex-direction: column;

  position: fixed;
  left: 0;
  top: 0;
  z-index: 20;

  width: 100vw;
  height: 100vh;
  height: 100dvh;
  box-sizing: border-box;

  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(17, 17, 17, 0.8);
    z-index: 2;
  }

  ${BaseCalendarContainer} {
    position: absolute;
    top: 20%;
    left: 0;
    right: 0;
    margin: auto;

    @media (max-width: 768px) {
      max-height: calc(100vh - 1.25rem);
      max-height: calc(100dvh - 1.25rem);
      height: fit-content;
      position: absolute;
      bottom: 0;
      top: auto;
    }
  }
  @media (max-width: 768px) {
    display: flex;

    top: ${({ $isPopupActive }) => ($isPopupActive ? '0' : '1000px')};
    opacity: ${({ $isPopupActive }) => ($isPopupActive ? '1' : '0')};
    transition: opacity 100ms ease-in 400ms;

    .overlay {
      display: ${({ $isPopupActive }) => ($isPopupActive ? 'flex' : 'none')};
      top: 0 !important;
      position: absolute;
    }
  }
`;

export const SingleTimeSlotAvailableCard = styled.div`
  margin-top: 1rem;
  border-radius: 0.25rem;
  padding: 1rem;
  background-color: ${COLORS.BACKGROUND.FADED_PALE};
  width: 23.5rem;
  box-sizing: border-box;
  .info {
    margin: 0;
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
    color: ${COLORS.TEXT.PEACHY_ORANGE_3};
  }

  .time {
    margin-top: 0.25rem;
    ${expandFontToken(FONTS.HEADING_SMALL)};
    color: ${COLORS.TEXT.PEACHY_ORANGE_3};
  }
`;
