import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledCard = styled.div`
  display: grid;
  grid-template-columns: 35% 63%;
  gap: 1.5rem;
  position: relative;
  align-content: start;
  background: ${COLORS.BRAND.WHITE};
  overflow: hidden;
  text-decoration: none;
  height: 100%;

  .image-wrap {
    height: 100%;
    width: 100%;
    cursor: pointer;
  }
  img {
    position: relative;
    object-fit: cover;
    border-radius: 12px;
    height: 100%;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column-reverse;
    .image-wrap {
      width: 100%;
    }
    img {
      height: 11.5rem;
      border-radius: 8px;
    }
  }
`;

export const ContentWrapper = styled.div`
  .structured-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 1.5rem 0 2rem;
  }
  a button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6875rem 1rem 0.8125rem 1rem;
    margin-top: 2rem;
  }
  a.no-margin button {
    margin-top: 0;
  }
`;

export const StructuredItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;

  .label {
    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  }

  .info {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
  }
`;
