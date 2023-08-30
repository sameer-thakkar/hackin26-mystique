import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';

export const GuidedTourLabel = styled.span`
  position: absolute;
  z-index: 2;
  bottom: -0.4375rem;
  width: 9.4375rem;
  height: 1.9375rem;
  display: flex;
  justify-content: center;
  align-items: center;
  left: calc((100% - 9.4375rem) / 2);
  color: ${COLORS.TEXT.PEACHY_ORANGE_3};
  font-family: ${HALYARD};
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.25rem;
  letter-spacing: 0.0375rem;
  text-transform: uppercase;
  svg {
    position: absolute;
    z-index: -1;
  }
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
    width: 9.25rem;
    left: calc((100% - 9.25rem) / 2);
  }
`;
