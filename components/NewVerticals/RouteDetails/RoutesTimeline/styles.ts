import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StopsList = styled.ol`
  position: relative;
  list-style-type: none;
  counter-reset: li-count;
  margin: 0 1.5rem 1.5rem 0;

  &::before {
    content: '';
    position: absolute;
    width: 0.25rem;
    background-color: ${COLORS.GRAY.G7};
    top: 1.5rem;
    bottom: 0;
    left: 1.25rem;
    margin: 0 0 4rem -0.156rem;
  }
  @media (max-width: 768px) {
    &::before {
      margin-bottom: 3rem;
    }
  }
`;
export const StopDetails = styled.li`
  position: relative;
  padding-bottom: 1.75rem;
  counter-increment: li-count;
  display: grid;
  gap: 0.25rem;

  &:first-child {
    margin-top: 1.5rem;
  }
  &::before {
    display: grid;
    align-items: center;
    content: counter(li-count);
    color: ${COLORS.BRAND.WHITE};
    text-align: center;
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    background-color: ${COLORS.TEXT.PURPS_3};
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)}
    border-radius: 4px;
    left: -2rem;
    margin: 0;
  }
  svg {
    height: 0.75rem;
    width: 0.75rem;
    padding-top: 0.125rem;
  }
  .stop-location,
  .stop-attractions {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    display: grid;
    grid-template-columns: min-content auto;
    gap: 0.125rem;
    align-items: start;
  }
  .stop-name {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
  }
  .stop-location {
    color: ${COLORS.GRAY.G2};
    text-decoration: underline;
  }
  .stop-attractions {
    color: ${COLORS.GRAY.G3};
  }
  @media (max-width: 768px) {
    &:last-child {
      padding-bottom: 0;
    }
  }
`;
