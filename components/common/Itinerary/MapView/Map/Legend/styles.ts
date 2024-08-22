import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const LegendContainer = styled.legend`
  position: absolute;
  z-index: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: ${COLORS.GRAY.G8};
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
  border-radius: 0 0 12px 12px;
  border: 1px solid ${COLORS.GRAY.G6};

  &::before {
    z-index: -2;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${COLORS.GRAY.G8};
    border-bottom-left-radius: 10px 0;
    border-bottom-right-radius: 10px 0;
    top: -50%;
    left: -0.063rem;
    border: 1px solid ${COLORS.GRAY.G6};
    border-bottom: none;
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  .icon-text {
    margin: 0;
    ${expandFontToken(FONTS.UI_LABEL_LARGE)}
  }
  svg,
  .image-wrap {
    height: 1.5rem;
    width: 1.5rem;
  }

  @media (max-width: 768px) {
    gap: 0.375rem;
    .icon-text {
      ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
      font-weight: 400;
      color: ${COLORS.GRAY.G2};
    }
    svg,
    img,
    .image-wrap {
      height: 1.25rem;
      width: 1.25rem;
    }
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 0.313rem;
`;
