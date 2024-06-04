import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div`
  padding: 1rem;

  display: grid;

  margin: 2.5rem 0;

  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-auto-flow: column;

  h5 {
    ${expandFontToken(FONTS.HEADING_SMALL)};
    margin: 0;
    max-width: 90%;

    grid-column: 1/ 3;

    .purps {
      color: ${COLORS.TEXT.PURPS_3};
    }

    padding-left: 0.75rem;
    position: relative;

    &::before {
      content: '';
      display: block;
      height: 100%;
      width: 2px;
      background-color: ${COLORS.PURPS.LIGHT_TONE_1};
      position: absolute;
      border-radius: 4px;
      left: 0;
    }
  }

  p {
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    margin-top: 1rem;
    margin-bottom: 0;
  }

  overflow: hidden;

  svg {
    max-width: 27.5rem;
    height: 100%;
  }

  .svg-container {
    margin-top: 1.5rem;

    width: calc(100% + 2rem);
    margin-inline: -1rem;
    height: 192px;

    position: relative;
    /* margin-left: -3rem; */
  }

  @media (min-width: 769px) {
    max-width: 75rem;
    margin: 3.875rem auto;
    padding: 3rem 0 1.5rem 0;

    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: auto 1fr;

    position: relative;

    h5 {
      &::before {
        width: 3px;
        background-color: ${COLORS.PURPS.LIGHT_TONE_2};
      }
    }

    &::after,
    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 2.75rem;
    }

    &::after {
      top: 0;
      background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0) 0%,
        #ffffff 100%
      );
    }

    &::before {
      bottom: 0;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        #ffffff 100%
      );
    }

    background: linear-gradient(
      270deg,
      #ffffff 9.51%,
      #faf4fe 52.39%,
      #ffffff 84.37%
    );

    h5 {
      ${expandFontToken(FONTS.DISPLAY_SMALL)};

      grid-column: 1/ 3;

      padding-left: 0.75rem;
      position: relative;

      &::before {
        content: '';
        display: block;
        height: 100%;
        width: 3px;
        background-color: ${COLORS.PURPS.LIGHT_TONE_2};
        position: absolute;
        left: 0;
        border-radius: 2px;
      }
    }

    p {
      ${expandFontToken(FONTS.SUBHEADING_LARGE)};
      margin-top: 1.5rem;

      grid-column: 1/3;
      max-width: 90%;
    }

    svg {
      margin: 0;
      max-width: unset;
      height: auto;
    }

    .svg-container {
      grid-row: span 2;
      grid-column: 3 / 7;
      height: auto;
      margin-top: 0;
      width: unset;
      margin-inline: unset;
      transform: translateX(-3rem);
    }
  }
`;

export const CountryMarker = styled.div`
  padding: 0.5rem;
  background-color: white;
  border-radius: 8px;
  width: max-content;

  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1),
    0px 0px 2px 0px rgba(0, 0, 0, 0.1);

  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};

  font-size: 0.5625rem;

  display: flex;
  align-items: center;
  position: absolute;

  &::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 12px;
    background-color: white;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    border-radius: 2px;
  }

  .flag-img {
    width: 1.2rem;
    height: 0.9rem;
    margin-right: 0.225rem;
  }

  animation: bounce 2s infinite cubic-bezier(0.3, 1, 0.7, 1);

  @keyframes bounce {
    0% {
      transform: translateY(-4px);
    }
    50% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(-4px);
    }
  }

  @media (min-width: 769px) {
    .flag-img {
      width: 2rem;
      height: 1.5rem;
      margin-right: 0.5rem;
    }
    font-size: 0.9375rem;
  }
`;
