import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const TopShowsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding-top: 4rem;

  .title {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    color: ${COLORS.GRAY.G2};
    margin: 0 0 2rem;
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
    margin: 3.25rem auto;
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
    &:hover {
      transition: ease 0.2s;
      &:hover {
        transform: translate3d(0, -5px, 0);
      }
    }
  }

  @media (max-width: 768px) {
    padding-top: 0;

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
    }
    button {
      width: calc(100% - 3rem);
      max-width: 355px;
      margin: 1.5rem auto 2rem;
    }
  }
`;

export const Badge = styled.div<{ index: number }>`
  position: absolute;
  z-index: 1;
  right: 0;
  top: -3px;
  transition: ease 0.2s;

  .rank {
    position: absolute;
    padding-left: 14px;
    width: calc(100% - 14px);
    top: 0;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    ${expandFontToken(FONTS.DISPLAY_SMALL)};
    font-size: 24px;
    color: ${COLORS.BRAND.WHITE};
  }

  @media (max-width: 768px) {
    left: 81px;
    right: inherit;
    top: -3px;

    svg {
      width: 27px;
      height: 28px;
    }

    .rank {
      padding-left: 0;
      width: auto;
      color: ${COLORS.BRAND.WHITE};
      right: ${({ index }) =>
        index >= 20 ? '1%' : index >= 10 ? '5%' : '20%'};
      font-size: 16px;
      font-family: 'halyard-text';
      font-style: normal;
      font-weight: 600;
      line-height: 16px;
      text-align: center;
      top: 18%;
    }
  }
`;
