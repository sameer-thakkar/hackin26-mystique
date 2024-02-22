import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(128, 0, 255, 0.4) 100%
    ),
    #306;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
    margin-bottom: 0;
  }
`;

export const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  h2 {
    ${expandFontToken(FONTS.DISPLAY_SMALL)};
    color: ${COLORS.BRAND.WHITE};
  }
  @media (max-width: 768px) {
    align-items: flex-start;
    margin-bottom: 0.5rem;
    h2 {
      max-width: 12.75rem;
      ${expandFontToken(FONTS.HEADING_REGULAR)}
    }
    svg {
      width: 1.9375rem;
      height: 1.625rem;
      margin-top: 0.5rem;
    }
  }
`;

export const Content = styled.div`
  background: ${COLORS.BRAND.WHITE};
  border-radius: 4px;
  border: 1px solid ${COLORS.GRAY.G7};
  padding: 1.5rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Description = styled.div`
  ${expandFontToken(FONTS.PARAGRAPH_LARGE)};

  & > * {
    color: ${COLORS.GRAY.G3};
    margin: 0;
  }
  & {
    margin-bottom: 1.5rem;
  }
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
    & {
      margin-bottom: 1rem;
    }
  }
`;

export const Toggle = styled.div<{
  $expanded: boolean;
}>`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
  width: fit-content;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: ${COLORS.BRAND.CANDY};
  ${expandFontToken(FONTS.SUBHEADING_LARGE)};
  line-height: 1;
  svg {
    transition: transform 0.3s ease;
    transform-origin: center;
  }
  svg {
    path {
      stroke: ${COLORS.BRAND.CANDY};
    }
  }
  ${({ $expanded }) => {
    return (
      $expanded &&
      `
    svg{
        transform: rotate(180deg);
    }
    `
    );
  }}
  &:hover {
    color: ${COLORS.TEXT.CANDY_1};
  }
`;

export const SubContent = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: linear-gradient(180deg, #f8f6ff 57.4%, #fff 100%);

  h3 {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.HEADING_SMALL)};
    margin-bottom: 0.5rem !important; /** Using !important to override Root styles added in the parent file of ReviewsPage */
  }
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export const SubDescription = styled.div`
  ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
  color: ${COLORS.GRAY.G3};
  & > * {
    margin: 0;
    color: ${COLORS.GRAY.G3};
  }
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.PARAGRAPH_SMALL)}
  }
`;

export const Separator = styled.div`
  margin: 1rem 0;
  width: 100%;
  border-top: 1px solid;
  border-image: linear-gradient(
    90deg,
    rgba(128, 0, 255, 0.12) 6.3%,
    rgba(230, 209, 255, 0) 89.56%
  );
  border-image-slice: 1;

  @media (max-width: 768px) {
    margin: 0.75rem 0;
  }
`;
