import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17.625rem, 1fr));
  column-gap: 1.5rem;
  row-gap: 2rem;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  .show-more {
    padding: 0.75rem 3rem;
    border-radius: 8px;
    ${expandFontToken(FONTS.BUTTON_BIG)};
    color: ${COLORS.GRAY.G2};
    border: 1px solid ${COLORS.GRAY.G2};
  }
`;

export const Cell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ImageContainer = styled.div`
  height: 178px;
  background-color: ${COLORS.GRAY.G6};
  border-radius: 8px;
  img {
    object-fit: cover;
    border-radius: 8px;
  }
`;
export const Content = styled.div`
  time {
    display: block;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    color: ${COLORS.GRAY.G3};
    margin-bottom: 0.375rem;
  }
  h3 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    ${expandFontToken(FONTS.HEADING_REGULAR)}
  }
  p {
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    color: ${COLORS.GRAY.G3};
    margin: 0.375rem 0 0;
  }
`;

export const Meta = styled.div`
  display: flex;
  gap: 0.5rem;
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  span {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
  }
`;
