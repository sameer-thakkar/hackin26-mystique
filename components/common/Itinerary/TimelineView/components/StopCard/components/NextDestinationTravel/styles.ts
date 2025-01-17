import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const NextDestinationTravelContainer = styled.div`
  padding: 0.25rem 0.5rem;
  border-radius: 1.25rem;
  border: 1px solid ${COLORS.GRAY.G6};
  background-color: white;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 1.5rem;
  transform: translateY(-50%);

  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  align-items: center;

  svg {
    height: 16px;
    width: 16px;

    path {
      stroke: ${COLORS.GRAY.G2};
    }
  }

  .duration-and-distance-container {
    display: flex;
    flex-direction: row;
    gap: 0.625rem;

    p {
      ${expandFontToken(FONTS.UI_LABEL_XS)}
      color: ${COLORS.GRAY.G2};
      position: relative;
      margin: 0 !important;

      &:not(:last-child) {
        &::after {
          content: '';
          position: absolute;
          height: 2px;
          width: 2px;
          border-radius: 50px;
          background-color: ${COLORS.GRAY.G5};
          top: 50%;
          right: -5px;
          transform: translate(50%, -50%);
        }
      }
    }
  }
`;

export const NextDestinationTravelDividerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: 1.25rem;
  margin-top: 0.75rem;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    height: 0;
    width: 100%;
    border-top: 1px dashed ${COLORS.GRAY.G6};
    transform: translateY(0.5px);
  }
`;
