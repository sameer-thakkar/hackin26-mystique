import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const SignContainer = styled.div`
  display: inline-block;
  background-color: ${COLORS.TEXT.BEACH};
  padding: 0.125rem;
  border-radius: 0.25rem;
  position: relative;
  text-align: center;
  box-shadow: 0.125rem 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  margin-top: 0.5625rem;
  margin-left: 0.75rem;

  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 0.375rem;
    height: 0.5625rem;
    background-color: ${COLORS.BACKGROUND.DARK_CYAN};
    top: -0.5625rem;
  }

  &:before {
    left: 0.75rem;
  }

  &:after {
    right: 0.75rem;
  }
`;

export const Sign = styled.div`
  display: flex;
  background-color: ${COLORS.TEXT.BEACH};
  padding: 0.25rem 0.5rem 0.375rem;
  border: 1px solid ${COLORS.BRAND.WHITE};
  border-radius: 0.25rem;
`;

export const SignBackgroundArtifact = styled.div`
  position: absolute;
  width: 1rem;
  height: 1.75rem;
  background: ${COLORS.BRAND.WHITE};
  opacity: 0.08;
  transform: skew(-15deg);
  right: 0.5625rem;
  top: 0.125rem;
`;

export const SignTextWrapper = styled.div<{
  $width: number;
  $skipAnimation?: boolean;
}>`
  display: inline-block;
  width: ${({ $width }) => $width}px;
  transition: width 0.3s ease-in-out;
  overflow: hidden;

  ${({ $skipAnimation }) =>
    $skipAnimation &&
    css`
      transition: none;
    `};
`;

export const SignText = styled.div`
  ${expandFontToken(FONTS.MISC_OVERLINE_LARGE)}
  color: ${COLORS.BRAND.WHITE};
  font-weight: 500;
  text-transform: uppercase;
  text-wrap: nowrap;
  white-space: nowrap;
`;

export const HiddenText = styled.div`
  ${expandFontToken(FONTS.MISC_OVERLINE_LARGE)}
  position: absolute;
  visibility: hidden;
  white-space: nowrap;
`;
