import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 3rem;
  svg {
    height: 0.875rem;
    width: 0.875rem;
  }
  button {
    width: fit-content;
    padding: 0.75rem 2.625rem;
    ${expandFontToken(FONTS.BUTTON_BIG)};
    border-radius: 8px;
    border: 1px solid ${COLORS.GRAY.G4};
    color: ${COLORS.GRAY.G2};
  }
  button:hover {
    box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.3);
  }
  .tabs > div {
    ${expandFontToken(FONTS.HEADING_LARGE)}
  }
  @media (max-width: 768px) {
    margin-bottom: 0;
    .tabs > * {
      svg {
        display: none;
      }
    }
    .tabs > div {
      ${expandFontToken(FONTS.HEADING_SMALL)}
    }
    button {
      border-radius: 4px;
      padding: 0.75rem 1.25rem;
      width: 100%;
      color: ${COLORS.GRAY.G2};
      border: 1px solid ${COLORS.GRAY.G2};
      ${expandFontToken(FONTS.BUTTON_MEDIUM)};
      border-radius: 8px;
    }
  }
`;

export const TitleWrapper = styled.div`
  width: auto;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

export const Author = styled.div`
  white-space: pre;
  display: flex;
  .author-name {
    margin-bottom: 0.375rem;
  }
  h3,
  a {
    ${expandFontToken(FONTS.HEADING_SMALL)};
    line-height: 1;
  }

  a {
    color: ${COLORS.TEXT.CANDY_1};
  }

  @media (max-width: 768px) {
    && {
      h3,
      a {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
        line-height: 1;
        max-width: 7rem;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 0;
      }
    }
  }
`;

export const Avatar = styled.div`
  img {
    border-radius: 50%;
  }
  @media (max-width: 768px) {
    img {
      height: 2.25rem;
      width: 2.25rem;
    }
  }
`;

export const Date = styled.span`
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
  color: ${COLORS.GRAY.G3};

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  }
`;

export const Rating = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.125rem;
`;

export const RatingCount = styled.span`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
  color: ${COLORS.GRAY.G3};
  transform: translateY(-1px);
  line-height: 1;
`;

export const ReviewContent = styled.p`
  margin: 0;
  & > * {
    margin: 0;
  }
  ${expandFontToken(FONTS.PARAGRAPH_LARGE)};

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}
  }
`;

export const ReviewWrapper = styled.div<{
  $isLoading: boolean;
}>`
  margin-bottom: 2rem;
  ${({ $isLoading }) =>
    $isLoading &&
    ` & > * {
    opacity: 0.3;
  }`}
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

export const MetaInfo = styled.div`
  width: 100%;
`;

export const ReviewHeader = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;
