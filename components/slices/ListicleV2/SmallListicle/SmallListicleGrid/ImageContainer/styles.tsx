import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ImageWrapper = styled.div`
  width: 144px;
  height: 100%;
  border-radius: 8px 0px 0px 8px;
  overflow: hidden;
  position: relative;
`;

export const IndexWrapper = styled.div`
  position: absolute;
  inset: 0;
  height: 2.604rem;
  width: 2.5rem;
  border-bottom-right-radius: 12px;
  background: linear-gradient(180deg, #ff5baa 0%, #ff017b 100%);
  display: flex;
  justify-content: center;
`;

export const IndexBox = styled.div`
  ${expandFontToken(FONTS.HEADING_SMALL)};
  color: ${COLORS.BRAND.WHITE};
  padding: 0.552rem 0;
`;
