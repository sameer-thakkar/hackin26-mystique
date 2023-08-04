import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const MediumListicleBox = styled.div<{
  overflow: boolean;
  isSettingsOne: boolean;
}>`
  border: 1px solid ${COLORS.GRAY.G6};
  display: grid;
  grid-template-rows: ${({ isSettingsOne }) =>
    isSettingsOne ? `214px auto 60px` : `214px auto 75px`};
  border-radius: 8px;

  .cta-button {
    margin: 0 1rem 1rem;
    padding: 0.125rem 1.25rem;
    flex: 1;
    background: ${COLORS.BRAND.PURPS};
    color: ${COLORS.BRAND.WHITE};
    ${expandFontToken(FONTS.BUTTON_MEDIUM)}
  }

  .cta-button > a {
    color: ${COLORS.BRAND.WHITE};
  }

  @media (max-width: 768px) {
    display: unset;
    position: relative;
    .cta-button {
      padding: 0.625rem 1.25rem;
    }
  }
`;

export const CTAButtonWrapper = styled.div<{
  isSettingsOne: boolean;
  isSettingsTwo: boolean;
  isReadMore: boolean;
}>`
  display: flex;
  margin-top: ${({ isSettingsOne }) => (isSettingsOne ? `0` : `1rem`)};

  @media (max-width: 768px) {
    margin-top: ${({ isReadMore }) => (isReadMore ? `1rem` : `0`)};
  }
`;
