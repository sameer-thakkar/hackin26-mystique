import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const LargeListicleCategoryTagsWrapper = styled.div`
  display: flex;
`;

export const LargeListicleCategoryTagWrapper = styled.div`
  border-radius: 12px;
  color: ${COLORS.GRAY.G2};
  background: ${COLORS.GRAY.G7};
  padding: 0.375rem 0.75rem;
  margin: 0 0.5rem 0.625rem 0;
  ${expandFontToken(FONTS.MISC_TAG_MEDIUM)};

  @media (max-width: 768px) {
    padding: 0.25rem 0.5rem;
    ${expandFontToken(FONTS.MISC_TAG_REGULAR)};
    margin: 0 0.5rem 1rem 0;
  }
`;
