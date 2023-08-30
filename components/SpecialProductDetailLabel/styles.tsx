import styled from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const SpecialProductDetailLabelWrapper = styled.div`
  height: 1.25rem;
  gap: 0.375rem;
  display: flex;
  width: fit-content;
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .label-detail {
    color: #570101;
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
    white-space: nowrap;
  }
  @media (max-width: 768px) {
    height: 1rem;
    svg {
      width: 1rem;
      height: 1rem;
    }
    .label-detail {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
      line-height: 1rem;
    }
  }
`;
