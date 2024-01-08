import styled from 'styled-components';
import { DropdownOverlay } from 'UI/Dropdown';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const HeaderMonthName = styled.div`
  .text-content {
    transform: rotate(-90deg);
  }

  width: 1rem;
  height: 3.375rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  background: #ebebeb;
  color: ${COLORS.GRAY.G4};
  ${expandFontToken(FONTS.UI_LABEL_XS)};
`;

export const DateSelectorHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 5.19rem;
  box-sizing: border-box;
  position: relative;

  padding: 0.63rem 1rem 0 0;
  background: #f5f5f5;
  border-radius: 1rem 1rem 0 0;
  border: 1px solid ${COLORS.GRAY.G6};
  border-bottom: none;
  > div:not(:first-child) {
    margin-left: auto;
  }

  ${HeaderMonthName}:first-child {
    border-radius: 0 0.25rem 0.25rem 0;
  }
`;

export const HeaderDate = styled.div<{
  $isSelected?: boolean;
  $isDiscounted?: boolean;
  $isAvailable?: boolean;
}>`
  height: 4.56rem;
  width: 3.25rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  z-index: 16;
  position: relative;
  .weekday {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    margin-bottom: 0.12rem;
  }

  .date {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 15px;

    margin-top: 0.12rem;
  }

  .price {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.UI_LABEL_XS)};
    margin-top: 0.5rem;

    ${({ $isDiscounted }) =>
      $isDiscounted &&
      `
        background: ${COLORS.BACKGROUND.SOOTHING_GREEN};
        border-radius: 2px;
        padding: 1px;
        width: auto;
        min-width: 2.125rem;

  `}
  }

  ${({ $isSelected, $isAvailable }) =>
    !$isSelected &&
    $isAvailable &&
    `
    cursor: pointer;
    :hover {
      height: 3.865rem;
      width: 3.25rem;
      border-radius: 0.25rem;
      background: linear-gradient(180deg, #f0f0f0 0%, #ebebeb 100%);
    }
  `}

  ${({ $isSelected, $isDiscounted }) =>
    $isSelected &&
    `
    :after {
      content: '';
      height: 3px;
      width: 3.25rem;
      border-radius: 0.625rem;
      background: ${COLORS.BRAND.PURPS};
      display: block;
      left: 0;
      bottom: 0;
      position: absolute;
    }
    .weekday, .date, .price {
        color: ${COLORS.BRAND.PURPS};
    }
    .price {
        background: ${$isDiscounted ? COLORS.PURPS.LIGHT_TONE_4 : ''};
    }
  `}

.weekday, .price, .date {
    ${({ $isAvailable }) =>
      !$isAvailable &&
      `
    color: ${COLORS.GRAY.G4A};
  `}
  }
`;
export const CalendarButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  height: 4.56rem;
  width: 3.25rem;

  cursor: pointer;
  svg {
    width: 1rem;
    height: 1rem;
    margin-top: 0.5rem;
  }

  .more-dates {
    width: 40px;
    font-size: 10px;
    font-style: normal;
    font-weight: 300;
    line-height: 12px;
    text-align: center;
    margin-top: 0.35rem;
  }

  :hover {
    height: 3.75rem;
    border-radius: 4px;
    background: linear-gradient(180deg, #f0f0f0 0%, #ebebeb 100%);
  }
`;

export const TimeSlotCard = styled.div<{
  $isSelected: boolean;
  $isDropDown?: boolean;
}>`
  border-radius: 0.375rem;
  border: 1px solid ${COLORS.GRAY.G6};
  padding: 0.62rem 0.75rem;
  box-sizing: border-box;
  height: 3.5rem;
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  cursor: pointer;

  ${({ $isSelected }) =>
    $isSelected
      ? `
    background-color: ${COLORS.PURPS.LIGHT_TONE_4} !important;
    border: none;
  border-radius: 0.375rem !important;
    div, span {

      color: ${COLORS.TEXT.PURPS_3} !important;
    }
    ${SavePercentElement} {
      background: ${COLORS.BRAND.WHITE};  
    }

`
      : `
    :hover {
        border: 1px solid ${COLORS.PURPS.LIGHT_TONE_4};
        background-color: ${COLORS.BACKGROUND.FLOATING_PURPS};
      }
  `}

  ${({ $isDropDown }) =>
    $isDropDown &&
    `
        margin: 0;
        border: none;
        ${TimeSlotPricing} {
          .pricing .price .strike-through {
              color: ${COLORS.GRAY.G3};
              ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
          }
        }
      `}
`;

export const ShowPageDateSelectorWrapper = styled.div<{
  $isRedirecting?: boolean;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 24rem;
  border-radius: 1rem;

  margin-left: 10rem;
  background-color: ${COLORS.BRAND.WHITE};
  z-index: 1;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);

  ${HeaderDate}, ${CalendarButton}, ${TimeSlotCard} {
     ${({ $isRedirecting }) =>
       $isRedirecting &&
       `
      cursor: not-allowed !important;
    `};
  }


  @media (max-width: 768px) {
    box-shadow: none;
    z-index: 15;
    background-color: white;
    border-radius: 1rem 1rem 0 0;

    @keyframes increaseToCalendar {
      from {
        min-height: 16.8125rem;
      }
      to {
        min-height: var(--calendar-height);
      }
    }

    @keyframes decreaseToDateselector {
      0% {
        min-height: var(--calendar-height);
      }
      100% {
        min-height: 16.8125rem;
      }
    }
    &.increase {
      animation: increaseToCalendar 400ms cubic-bezier(0.7, 0, 0.3, 1) forwards;
      & > * {
        opacity: 0;
      }
    }
    &.decrease {
      animation: decreaseToDateselector 500ms cubic-bezier(0.7, 0, 0.3, 1)
        forwards;

      & > * {
        opacity: 1;
        transition: opacity 100ms cubic-bezier(0.7, 0, 0.3, 1) 400ms;
      }
    }
  }
`;

export const TimeSlotsSection = styled.div`
  overflow: scroll;
  background-color: ${COLORS.BRAND.WHITE};
  padding: 1.25rem 1.5rem 0;
  border: 1px solid #e9e9e9;
  border-radius: 0 0 1rem 1rem;
  align-items: center;

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }

  p {
    margin: 0;
    ${expandFontToken(FONTS.HEADING_XS)};
    color: ${COLORS.GRAY.G2};
  }
  .dropdown-wrapper {
    margin-top: 0.75rem;
  }

  ${DropdownOverlay} {
    padding: 1rem 0.75rem;
    width: initial;
    flex-direction: column;
    grid-row-gap: 0;
    max-height: 20rem;
    z-index: 11111;
    position: absolute;
    overflow: scroll;
    border-radius: 0.5rem;
    -ms-overflow-style: none;
    scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none;
    }

    ${TimeSlotCard} {
      border-radius: 0;
      :hover {
        border-radius: 0.5rem;
        background-color: ${COLORS.GRAY.G8};
        border: none;
      }
      :not(:last-child) {
        border-bottom: solid 1px ${COLORS.GRAY.G7};
        width: 19.4rem;
      }
    }
  }
  .dropdown-error {
    ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
    color: ${COLORS.TEXT.WARNING_RED_1};
    margin-top: 0.38rem;
  }

  @media (max-width: 768px) {
    border-radius: 0;
    padding-bottom: 1.5rem;
    position: relative;
    max-height: 50vh;
  }
`;

export const TimeSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const TimeSlot = styled.div`
  ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
  color: ${COLORS.GRAY.G2};
`;
export const UrgencyBooster = styled.div`
  margin-top: 0.25rem;
  ${expandFontToken(FONTS.MISC_TAG_REGULAR)};
  color: ${COLORS.GRAY.G3};
`;

export const TimeSlotPricing = styled.div<{ atRootLevel?: boolean }>`
  display: flex;
  flex-direction: column;

  .pricing {
    .scratch-price {
      ${expandFontToken(FONTS.UI_LABEL_XS)};
      color: ${COLORS.GRAY.G4};
      margin-right: 0.06rem;
      .original-price {
        text-decoration: line-through;
      }
    }

    .price {
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
      color: ${COLORS.GRAY.G2};
    }
  }
`;
export const SavePercentElement = styled.div`
  ${expandFontToken(FONTS.MISC_BADGE_SMALL)};
  color: ${COLORS.TEXT.OKAY_GREEN_3};

  padding: 0.12rem 0.2rem;
  border-radius: 0.125rem;
  background-color: ${COLORS.BACKGROUND.SOOTHING_GREEN};
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TimeSlotsDropdown = styled.div<{ $isError?: boolean }>`
  display: flex;
  padding: 1.25rem 1rem;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.5rem;
  border: 1px solid
    ${({ $isError }) => ($isError ? COLORS.TEXT.WARNING_RED_1 : COLORS.GRAY.G6)};
  color: ${COLORS.GRAY.G2};
  ${expandFontToken(FONTS.SUBHEADING_LARGE)};

  svg {
    transform: rotate(180deg);

    path {
      stroke: ${COLORS.GRAY.G2};
    }
  }
  .dropdown-chevron {
    &.open {
      svg {
        transform: rotate(0);
      }
    }
  }
`;

export const RootLevelPricing = styled.div<{ $isTwoPartPricing?: boolean }>`
  margin-top: 1.5rem;

  ${({ $isTwoPartPricing }) =>
    $isTwoPartPricing &&
    `
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid ${COLORS.GRAY.G6};
  `};

  ${TimeSlotPricing} {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    .pricing {
      display: flex;
      flex-direction: column;

      .scratch-price {
        .price-starting-from,
        .original-price {
          color: ${COLORS.GRAY.G3} !important;
          ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
        }
        .price-starting-from {
          text-decoration: none;
        }
      }

      .price {
        color: ${COLORS.GRAY.G2};
        ${expandFontToken(FONTS.BUTTON_BIG)};
        margin: 0.25rem 0.25rem 0 0;
        display: flex;
        align-items: center;
        ${SavePercentElement} {
          margin-left: 0.3rem;
          ${expandFontToken(FONTS.MISC_TAG_MEDIUM)};
          line-height: 0.88819rem;
          height: 1.18419rem;
        }
      }
    }
  }
`;

export const BuyButtonWrapper = styled.div<{ $disabled: boolean }>`
  padding: 1.5rem 0 1.25rem;
  background-color: ${COLORS.BRAND.WHITE};
  position: relative;
  z-index: 1;
  @media (max-width: 768px) {
    padding: 0.88rem 1.5rem;
    border-radius: 0;
    box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.08);

    button {
      ${({ $disabled }) =>
        !$disabled &&
        `
        box-shadow: 0px 8px 15px 0px rgba(128, 0, 255, 0.3);
      `}
    }
  }
`;
export const OverlayWrapper = styled.div`
  @media (max-width: 768px) {
    top: 0;
    height: 100vh;
    width: 100vw;
    position: fixed;
    background: rgba(17, 17, 17, 0.8);
    display: flex;
    z-index: 0;
  }
`;

export const TwoPartTimeSlot = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 0;
  margin-top: 0.75rem;

  .time {
    display: flex;
    gap: 0.75rem;
    .time-index {
      ${expandFontToken(FONTS.HEADING_XS)};
      width: 1.375rem;
      height: 2.5rem;
      color: ${COLORS.BRAND.WHITE};
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: ${COLORS.TEXT.PEACHY_ORANGE_3};
      border-radius: 0.125rem;
    }
    .show-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      color: ${COLORS.TEXT.PEACHY_ORANGE_3};
      ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
      @media (max-width: 768px) {
        ${expandFontToken(FONTS.HEADING_XS)};
      }
      .duration {
        display: flex;
        gap: 0.3rem;
        align-items: baseline;
        p {
          ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
          color: ${COLORS.TEXT.PEACHY_ORANGE_3};
          margin: 0;
          @media (max-width: 768px) {
            ${expandFontToken(FONTS.UI_LABEL_SMALL)};
          }
        }
        svg {
          path {
            fill: ${COLORS.TEXT.PEACHY_ORANGE_3};
          }
          line {
            stroke: ${COLORS.TEXT.PEACHY_ORANGE_3};
          }
        }
      }
    }
  }
  .gap {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    color: ${COLORS.TEXT.PEACHY_ORANGE_3};
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    .spacer {
      width: 1.375rem;
      height: 3rem;
      background-color: ${COLORS.BACKGROUND.FADED_PALE};
    }
    @media (max-width: 768px) {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    }
  }
`;

export const Sheet = styled.div`
  background-color: red;
`;
