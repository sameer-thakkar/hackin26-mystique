import styled from 'styled-components';
import { expandFontToken } from 'const/typography';
import { FONTS } from 'const/fonts';

export const FlashDealBadge = styled.span`
  position: absolute;
  top: 0.625rem;
  left: 0.625rem;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: #f59e0b;
  color: #ffffff;
  border-radius: 1rem;
  ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)}
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);

  &::before {
    content: '⚡';
    font-size: 0.75rem;
    line-height: 1;
  }
`;
