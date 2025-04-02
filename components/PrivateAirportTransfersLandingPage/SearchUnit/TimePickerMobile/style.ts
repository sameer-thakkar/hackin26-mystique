import styled from 'styled-components';
import COLORS from 'const/colors';

const LIST_ITEM_HEIGHT = 3.125;
const PADDING_LIST_ITEM_HEIGHT = 3.90625;

export const TimePickerWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: stretch;

  margin: 1.25rem;

  border-radius: 8px;

  background-color: ${COLORS.GRAY.G8};

  overflow: hidden;
  height: 9.375rem;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;

    height: 3.125rem;
    width: 100%;

    position: absolute;
    z-index: 4;
    left: 0;
    pointer-events: none;
  }

  &::before {
    top: 0;
    background: linear-gradient(0deg, rgba(248, 248, 248, 0) 0%, #f8f8f8 100%);
  }

  &::after {
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(248, 248, 248, 0) 0%,
      #f8f8f8 100%
    );
  }

  svg {
    position: absolute;
    top: calc(50% - 0.5rem);
    left: 0;
  }

  .right {
    transform: rotate(-180deg);
    right: 0;
    left: auto;
  }

  .picker-window {
    position: absolute;

    width: calc(100% - 2.25rem);
    left: 1.125rem;
    top: calc(50% - 1.55rem);
    border-radius: 3px;

    z-index: 0;

    background-color: ${COLORS.PURPS.LEVEL_10};
    height: ${LIST_ITEM_HEIGHT}rem;
    pointer-events: none;
  }
`;

export const ScrollableColumn = styled.div`
  overflow-y: scroll;
  height: 100%;
  flex: 1;

  scroll-snap-type: y mandatory;
  // hide scroll
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;

export const NumberList = styled.ul`
  display: flex;
  flex-direction: column;
  position: relative;

  list-style: none;
  padding: 0;
  margin: 0;

  z-index: 1;

  .number-padding {
    height: ${PADDING_LIST_ITEM_HEIGHT}rem;
  }

  .number {
    color: ${COLORS.GRAY.G4A};
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums;
    font-family: 'halyard-display';
    font-size: 2rem;
    font-style: normal;
    font-weight: 500;
    letter-spacing: 0.6px;

    padding: 0 0.625rem;

    scroll-snap-align: center;

    height: 2.8125rem;
  }

  .center {
    color: ${COLORS.BRAND.PURPS};
  }
`;
