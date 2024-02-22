import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div`
  height: 15rem;
  margin-bottom: 3rem;
  border-radius: 8px;
  border: 1px solid ${COLORS.GRAY.G6};
  padding: 2.75rem 1.5rem;
  box-sizing: border-box;
  display: flex;
  gap: 2.25rem;
  flex: 1;
  flex-wrap: nowrap;
  box-sizing: border-box;

  @media (max-width: 768px) {
    display: block;
    height: auto;
    padding: 1rem;
    gap: 0.75rem;
    margin-bottom: 0;
  }
`;

export const RatingCount = styled.div`
  text-align: center;
  strong {
    display: inline-block;
    margin-bottom: 1rem;
    ${expandFontToken(FONTS.DISPLAY_LARGE)};
  }

  @media (max-width: 768px) {
    text-align: start;
    strong {
      ${expandFontToken(FONTS.BUTTON_MEDIUM)};
      margin: 0;
      margin-right: 0.5rem;
      svg {
        margin-left: 0.125rem;
        transform: translateY(1px);
      }
    }
    color: ${COLORS.BRAND.CANDY};
    margin-bottom: 0.75rem;
  }
`;

export const VerticalSeparator = styled.div`
  height: 100%;
  border-left: 1px solid;
  border-image: linear-gradient(
    180deg,
    #d3d3d3 3.98%,
    rgba(177, 177, 177, 0.07) 100%
  );
  border-image-slice: 1;
`;

export const RatingStarsWrapper = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;

  svg,
  path {
    height: 1.625rem;
    width: 1.625rem;
  }
  @media (max-width: 768px) {
    svg,
    path {
      height: 1rem;
      width: 1rem;
    }
  }
`;

export const ReviewsCount = styled.u`
  cursor: pointer;
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
  &:hover {
    color: ${COLORS.GRAY.G2};
  }
`;

export const RatingSplitWrapper = styled.div`
  flex: 2;

  & > div {
    margin-bottom: 0.75rem;
  }

  & > div:last-child {
    margin-bottom: 0rem;
  }
`;

export const Scale = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    text-align: end;
  }
  p,
  span {
    min-width: 3.5rem;
    flex: 1;
    margin: 0;
    ${expandFontToken(FONTS.SUBHEADING_XS)};
  }
  progress {
    flex: 5;
    appearance: none;
    height: 0.25rem;
    max-width: 22.125rem;
    border: none;
  }
  progress::-webkit-progress-value {
    background-color: ${COLORS.BRAND.CANDY};
    border-radius: 14px;
  }

  progress::-webkit-progress-bar {
    background-color: ${COLORS.GRAY.G7};
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;
