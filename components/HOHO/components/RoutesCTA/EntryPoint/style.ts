import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.button`
  position: absolute;
  display: grid;
  bottom: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
  padding: 0;
  border-radius: 10px;
  border: 1px solid ${COLORS.BRAND.WHITE}66;
  background-clip: padding-box;
  box-shadow: 0px 4px 4px 0px ${COLORS.BLACK}26;
  transition: bottom ease-in-out 150ms, transform ease-in-out 150ms;
  &:active {
    transform: scale(0.98);
  }
  & > svg {
    border-radius: 10px;
  }

  @media (min-width: 768px) {
    &:hover {
      bottom: 9px;
    }
  }
`;

export const TextIconContainer = styled.span`
  position: absolute;
  display: grid;
  grid-gap: 0.125rem;
  align-self: center;
  justify-self: center;
  justify-items: center;

  .routes-text {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    color: ${COLORS.TEXT.PURPS_3};
  }
`;
