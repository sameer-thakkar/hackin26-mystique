import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const DescriptorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  svg {
    height: 1rem;
    width: 1rem;

    path {
      stroke: ${COLORS.GRAY.G2};
    }
  }

  .descriptor-text {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
    color: ${COLORS.GRAY.G2};
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.75rem;

  ${DescriptorContainer} {
    position: relative;

    :not(:last-child) {
      ::after {
        content: '';
        height: 0.25rem;
        width: 0.25rem;
        background: ${COLORS.GRAY.G6};
        position: absolute;
        right: -0.875rem;
        transform: translate(50%, 50%);
        border-radius: 50px;
      }
    }
  }
`;
