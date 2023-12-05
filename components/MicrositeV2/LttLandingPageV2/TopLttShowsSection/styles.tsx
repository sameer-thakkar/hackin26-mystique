import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const TopShowsWrapper = styled.div<{
  $isCategoryPage: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding-top: 0.875rem;
  margin-bottom: 4rem;

  .title {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    color: ${COLORS.GRAY.G2};
    margin: 0 0 1.5rem;
    display: flex;
    flex-direction: row;
    align-items: start;
  }

  .shows {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    grid-column-gap: 24px;
    grid-row-gap: 56px;
    margin: 0 auto;
    width: 100%;
  }

  button {
    margin: 3.25rem auto 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 355px;
    height: 44px;
    background: ${COLORS.PURPS.LIGHT_TONE_4};
    border-radius: 8px;
    border: none;
    cursor: pointer;
    &:hover {
      transition: all 100ms ease-out;
      box-shadow: 0px 8px 15px rgba(128, 0, 255, 0.3);
    }
  }

  .card-wrapper {
    position: relative;
    max-width: 11.25rem;
    &:hover {
      transition: ease 0.2s;
      &:hover {
        transform: translate3d(0, -5px, 0);
      }
    }
  }

  @media (max-width: 768px) {
    padding-top: 0;

    .card-wrapper {
      max-width: initial;
    }

    .title {
      ${expandFontToken(FONTS.HEADING_LARGE)};
      margin: 0 0 1.5rem;
      display: flex;
      flex-direction: row;
      align-items: start;
      padding: 0 1.5rem;
    }

    .shows {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 100%;
      padding: 0 1.5rem;
      width: auto;
      margin: 0;
    }
    button {
      width: calc(100% - 3rem);
      max-width: 355px;
      margin: 1.5rem auto 0;
    }
  }
`;

export const Badge = styled.div<{ index: number }>`
  position: absolute;
  left: -10px;
  top: 220px;
  transition: ease 0.2s;
  z-index: 1;

  .rank {
    position: absolute;
    font-size: 24px;
    color: #93f;
    font-family: 'halyard-display', sans-serif;
    font-size: 48px;
    font-style: italic;
    font-weight: 700;
    line-height: normal;
    text-shadow: -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff,
      2px 2px 0 #fff;
    letter-spacing: -1px;
  }

  @media (max-width: 768px) {
    left: 108px;
    top: -16px;

    .rank {
      right: ${({ index }) =>
        index >= 20 ? '1%' : index >= 10 ? '5%' : '20%'};
      text-align: right;
      font-size: 36px;
      letter-spacing: 0.4px;
    }
  }
`;
